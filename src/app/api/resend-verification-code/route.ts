import { NextResponse } from "next/server";
import User from "@/models/user/User";
import { sendVerificationEmail } from "@/helper/sendVerifcationEmail";
import dbConnect from "@/lib/dbconfig/dbConnect";
import crypto from "crypto";

export async function POST(request: Request) {
  await dbConnect();
  const { username } = await request.json();

  const user = await User.findOne({ username });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Generate a new verification code
  const newVerificationCode = crypto.randomInt(100000, 999999).toString();
  user.verificationCode = newVerificationCode;
  user.verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
  await user.save();

  await sendVerificationEmail(user.email, newVerificationCode, user.username);

  return NextResponse.json(
    {
      message: "Verification email resent",
      user: { username: user.username, email: user.email },
    },
    { status: 200 }
  );
}
