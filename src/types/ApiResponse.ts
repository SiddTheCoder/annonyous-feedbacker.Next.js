import { IMessage } from "@/models/messages/Message";

export type ApiResponse = {
  success: boolean;
  message: string | null;
  error?: string | null;
  isAcceptingMessages?: boolean;
  messages?: Array<IMessage>;
  data?: any;
};
