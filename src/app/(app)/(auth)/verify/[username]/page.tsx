"use client";
import React, { use } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { verifySchema } from "@/schemas/verifySchema";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

function page() {
  const [isOTPChecking, setIsOTPChecking] = React.useState(false);
  const [otpResetCount, setOtpResetCount] = React.useState(0);
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const username = params.username as string;

  const otpForm = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      verifyCode: "",
      // verifyCodeExpiry: new Date(),
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      setIsOTPChecking(true);
      console.log("Subbmiting ", data);
      toast.success(`You submitted the following values: ${data.verifyCode}`);
      const response = await axios.post("/api/verify-code", {
        code: data.verifyCode,
        username: username,
      });
      console.log("Response:", response);
      if (response.status === 200) {
        toast.success("OTP verified successfully");
        router.replace("/sign-in");
      } else {
        toast.error("Failed to verify OTP");
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data
        : error;
      console.error("Error submitting form", errorMessage);
      toast.error(`Error verifying OTP: ${errorMessage}`);
    } finally {
      setIsOTPChecking(false);
    }
  };

  const resendOTP = async () => {
    try {
      setOtpResetCount(30); // Reset the countdown to 30 seconds
      const response = await axios.post("/api/resend-verification-code", {
        username: username,
      });
      if (response.status === 200) {
        toast.success("Verification email resent successfully");
      } else {
        toast.error("Failed to resend verification email");
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data
        : error;
      console.error("Error resending OTP", errorMessage);
      toast.error(`Error resending OTP: ${errorMessage}`);
    }
  };

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpResetCount > 0) {
      timer = setInterval(() => {
        setOtpResetCount((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [otpResetCount]);

  return (
    <div className="h-screen w-screen flex  items-center bg-slate-950 text-white flex-col gap-4 space-y-16">
      <h1>Verify Your Email</h1>
      <p>Please check your email for the verification CODE.</p>
      <Form {...otpForm}>
        <form className="space-y-4" onSubmit={otpForm.handleSubmit(onSubmit)}>
          <FormField
            control={otpForm.control}
            name="verifyCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSeparator />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the one-time password sent to your phone.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">
            {isOTPChecking ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                <span>Verifying...</span>
              </div>
            ) : (
              "Verify"
            )}
          </Button>
        </form>
      </Form>

      <hr />

      <div className="text-sm text-gray-400">
        If you didn't receive the email, please check your spam folder or{" "}
        {otpResetCount > 0 ? (
          <span>wait for {otpResetCount} seconds to resend</span>
        ) : (
          <Button className="text-blue-500 hover:underline" onClick={resendOTP}>
            resend the verification link
          </Button>
        )}
      </div>
    </div>
  );
}

export default page;
