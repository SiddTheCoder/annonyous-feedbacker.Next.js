import resend from "@/lib/resend";
import { VerificationEmail } from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  otp: string,
  username: string
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Email Verification",
      react: VerificationEmail({ username, otp }),
    });
    return {
      success: true,
      message: "Verification email sent successfully",
      error: null,
      data: data,
    };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {
      success: false,
      message: "Failed to send verification email",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  } finally {
    console.log("Email sending process completed");
    // Additional cleanup or logging can be done here if needed
  }
}
