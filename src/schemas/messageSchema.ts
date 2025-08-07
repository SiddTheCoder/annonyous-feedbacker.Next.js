import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, "Content cannot be empty")
    .max(500, "Content must not exceed 500 characters"),
  
  sender: z.string().uuid("Invalid sender ID format"),
  
  receiver: z.string().uuid("Invalid receiver ID format"),
  
  verifyCode: z
    .string()
    .length(6, "Verification code must be exactly 6 characters long"),
  
  verifyCodeExpiry: z
    .date()
    .refine((date) => date > new Date(), {
      message: "Verification code has expired",
    }),
});
