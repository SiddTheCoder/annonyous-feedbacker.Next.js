import { NextResponse } from "next/server";
import User from "@/models/user/User";
import { sendVerificationEmail } from "@/helper/sendVerifcationEmail";
import dbConnect from "@/lib/dbconfig/dbConnect";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, username, password } = await request.json();

    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    // 6 digit verification code(OTP)
    const verifyCode = crypto.randomInt(100000, 999999).toString();

    if (existingUser) {
      if (!existingUser.isVerified) {
        let newUser = await User.findByIdAndUpdate(
          existingUser._id,
          {
            $set: {
              username,
              email,
              password: await bcrypt.hash(password, 10),
              isVerified: false,
              verificationCode: verifyCode,
              updatedAt: new Date(),
              verificationCodeExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
            },
          },
          { new: true }
        );
        await sendVerificationEmail(
          existingUser.email,
          verifyCode,
          existingUser.username
        );

        if (!newUser) {
          return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
          );
        }

        const safeData = {
          ...newUser.toObject(),
          password: undefined, // Exclude password from response
          verificationCodeExpires: undefined, // Exclude verification code expiration from response
        };

        return NextResponse.json(
          { message: "Verification email sent", user: safeData },
          { status: 200 }
        );
      } else {
        const safeData = {
          ...existingUser.toObject(),
          password: undefined, // Exclude password from response
          verificationCodeExpires: undefined, // Exclude verification code expiration from response
        };
        return NextResponse.json(
          { message: "User already exists", user: safeData },
          { status: 400 }
        );
      }
    }

    const user = await User.create({
      email,
      username,
      password: await bcrypt.hash(password, 10),
      isVerified: false,
      verificationCode: verifyCode,
      verificationCodeExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    });
    await sendVerificationEmail(email, verifyCode, username);

    const safeData = {
      ...user.toObject(),
      password: undefined, // Exclude password from response
      verificationCodeExpires: undefined, // Exclude verification code expiration from response
    };

    return NextResponse.json(
      { message: "OTP Sent to your email ! Please Verify", user: safeData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/sign-up:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
