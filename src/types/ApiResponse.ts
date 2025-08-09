import { IMessage } from "@/models/messages/Message";

export type ApiResponse = {
  success: boolean;
  message: string | null;
  error: string | null;
  isAcceptingFeedback?: boolean;
  messages?: Array<IMessage>;
  data?: any;
};
