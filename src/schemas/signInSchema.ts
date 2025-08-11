import { z } from "zod";

export const signInSchema = z.object({
  identifier: z // email or username(identifier)
    .string()
    .email({ message: "Invalid email address" })
    .max(50, "Email must not exceed 50 characters"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters long")
    .max(50, "Password must not exceed 50 characters"),
});
