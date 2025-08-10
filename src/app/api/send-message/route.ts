import dbConnect from "@/lib/dbConnect";
import Message from "@/models/messages/Message";
import User, { IUser } from "@/models/user/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  let userId;
  if (user) {
    userId = user._id;
  }

  const { content, receiverUsername } = await request.json();

  try {
    const receiverUser = await User.findOne({ username: receiverUsername });

    if (!receiverUser) {
      return Response.json(
        {
          message: "No user found with such username",
          error: "No user found",
        },
        { status: 201 }
      );
    }

    if (!receiverUser.isAcceptingMessages) {
      return Response.json(
        {
          message: "User is not accepting messages",
          error: "User is not accepting messages",
        },
        { status: 201 }
      );
    }

    const newMessage = { content, createdAt: new Date() };

    const createdMessage = await Message.create(newMessage);
    if (!createdMessage) {
      return Response.json(
        {
          message: "Failed to create message",
          error: "Failed to create message",
        },
        { status: 500 }
      );
    }

    receiverUser.messages.push(createdMessage._id);
    await receiverUser.save();

    // adding message inside sender
    if (userId) {
      await User.findByIdAndUpdate(
        userId,
        {
          $push: { sentMessages: createdMessage._id },
        },
        { new: true }
      );
    }

    return Response.json({
      message: "Message sent successfully",
      data: {
        content,
        receiver: receiverUser.username,
      },
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return Response.json(
      {
        error: "Internal Server Error",
        message: "An error occurred while sending the message.",
      },
      { status: 500 }
    );
  }
}
