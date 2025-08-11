import User from "@/models/user/User";
import dbConnect from "@/lib/dbconfig/dbConnect";

export async function POST(request: Request) {
  const { username, code } = await request.json();

  console.log("cpde", code);
  try {
    await dbConnect();

    const user = await User.findOne({ username });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const isCodeValid = user.verificationCode === code;
    const isCodeNotExpired = user.verificationCodeExpires
      ? new Date(user.verificationCodeExpires) > new Date()
      : false;

    let a = new Date();

    console.log("Expiry date", a);

    if (!isCodeValid) {
      return new Response("Invalid verification code", { status: 400 });
    } else if (!isCodeNotExpired) {
      return new Response("Verification code expired", { status: 400 });
    } else {
      user.isVerified = true;
      await user.save();
    }

    return new Response("User verified successfully", { status: 200 });
  } catch (error) {
    console.error("Error verifying user:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
