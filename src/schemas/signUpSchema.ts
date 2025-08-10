import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(3, "Username must be at least 3 characters long")
  .max(20, "Username must not exceed 20 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores"
  );

export const signUpSchema = z.object({
  username: userNameValidation,
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .max(50, "Email must not exceed 50 characters"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters long")
    .max(50, "Password must not exceed 50 characters"),
  // confirmPassword: z
  //   .string()
  //   .min(4, "Confirm Password must be at least 4 characters long")
  //   .max(50, "Confirm Password must not exceed 50 characters"),
});
