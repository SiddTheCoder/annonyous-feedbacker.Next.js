import dbConnect from "@/lib/dbConnect";
import Message from "@/models/messages/Message";
import User, { IUser } from "@/models/user/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return Response.json(
      {
        error: "Unauthorized",
        message: "You must be logged in to get messages.",
      },
      { status: 401 }
    );
  }

  try {
    const userId = new mongoose.Types.ObjectId(user._id);
    const userWithMessages = await User.findById(userId).populate("messages");
  
    return Response.json(
      {
        message: "User messages retrieved successfully.",
        user: userWithMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving user messages:", error);
    return Response.json(
      {
        error: "Internal Server Error",
        message: "An error occurred while retrieving user messages.",
      },
      { status: 500 }
    );
  }
}