import { z } from "zod";

export const verifySchema = z.object({
  verifyCode: z
    .string()
    .length(6, "Verification code must be exactly 6 characters long"),
  
  verifyCodeExpiry: z
    .date()
    .refine((date) => date > new Date(), {
      message: "Verification code has expired",
    }),
});