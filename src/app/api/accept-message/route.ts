import dbConnect from "@/lib/dbconfig/dbConnect";
import User, { IUser } from "@/models/user/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return Response.json(
      {
        error: "Unauthorized",
        message: "You must be logged in to accept messages.",
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptingMessage } = await request.json();

  try {
    const foundUser = await User.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptingMessage },
      { new: true }
    );
    if (!foundUser) {
      return Response.json(
        {
          error: "User not found",
          message: "The user does not exist.",
        },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Accepting messages toggled successfully.",
      isAcceptingMessages: foundUser.isAcceptingMessages,
      user: foundUser,
    });
  } catch (error) {
    console.error("Error accepting message:", error);
    return Response.json(
      {
        error: "Internal Server Error",
        message: "An error occurred while accepting the message.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: IUser = session?.user;

  if (!user) {
    return Response.json(
      {
        error: "Unauthorized",
        message:
          "You must be logged in to retrieve your message acceptance status.",
      },
      { status: 401 }
    );
  }

  const userId = user._id;

  try {
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          error: "User not found",
          message: "The user does not exist.",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        message: "User message acceptance status retrieved successfully.",
        isAcceptingMessages: foundUser.isAcceptingMessages,
        user: foundUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving message acceptance status:", error);
    return Response.json(
      {
        error: "Internal Server Error",
        message:
          "An error occurred while retrieving the message acceptance status.",
      },
      { status: 500 }
    );
  }
}
