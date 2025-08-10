import User from "@/models/user/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  const { email, code } = await request.json();

  try {
    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const isCodeValid = user.verificationCode === code;
    const isCodeNotExpired = user.verificationCodeExpires
      ? new Date(user.verificationCodeExpires) > new Date()
      : false;

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
