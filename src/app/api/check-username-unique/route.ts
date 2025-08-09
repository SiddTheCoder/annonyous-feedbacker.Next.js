import dbConnect from "@/lib/dbConnect";
import User from "@/models/user/User";
import { success, z } from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
  username: userNameValidation
});

export async function GET(request: Request) {
  try {
    await dbConnect();

    // http://localhost/api/sign-up?username=siddthecoder?age=19

    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username")
    };

    //validation with zod
    const validationResult = usernameQuerySchema.safeParse(queryParam)
    console.log("Validation Result", validationResult)
    
    if (!validationResult.success) {
      const usernameErrorArray = validationResult.error.format().username?._errors || []
      return Response.json({
        success: false,
        messsage: usernameErrorArray.length > 0 ? usernameErrorArray.join(', ') : 'Username format mismatch'
      },{status: 400})
    }

    const { username } = validationResult.data;

    const existingVerifiedUser = await User.findOne({ username, isVerified: true });

    

    if (existingVerifiedUser) {
      let createdMessage = "";
      if (existingVerifiedUser.createdAt) {
        const createdAt = new Date(existingVerifiedUser.createdAt);
        const now = new Date();

        // Difference in milliseconds
        const diffMs = now.getTime() - createdAt.getTime();

        // Convert to days
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        createdMessage = `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
      }
      return Response.json({
        success: false,
        message: 'Username is already taken ' + createdMessage
      }, { status: 409 });
    }

    return Response.json(
      {
        success: true,
        message: "Username is available",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in GET /check-username-unique:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}