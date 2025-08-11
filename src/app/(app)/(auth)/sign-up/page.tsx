"use client";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";


function page() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isUsernameChecking, setIsUsernameChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounceUsername = useDebounceCallback(setUsername, 300);

  //zod implementation
  const registerForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (username === "") {
      setUsernameMessage("");
    }
    const checkUsernameUnique = async () => {
      if (username) {
        setIsUsernameChecking(true);
        setUsernameMessage("");

        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          console.log("Response from API:", response.data);
          if (response.data.success) {
            setUsernameMessage("Username is available");
          } else {
            setUsernameMessage(response.data.message);
          }
        } catch (error) {
          console.error("Error checking username:", error);
          if (axios.isAxiosError(error) && error.response) {
            setUsernameMessage(
              error.response.data.message || "Error checking username"
            );
          } else {
            setUsernameMessage("Error checking username");
          }
        } finally {
          setIsUsernameChecking(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    console.log(data);
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      console.log("Response from API:", response.data);
        toast.success(response.data.message);
        router.replace(`/verify/${data.username}`);
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Error signing up");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 ">
      <div className="w-full max-w-md p-8 space-y--8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Join Mystery Message</h1>
          <p className="text-gray-600">
            Sign up to start sending and receiving anonymous messages!
          </p>
        </div>
        {/* React-Hook-Form */}
        <Form {...registerForm}>
          <form
            onSubmit={registerForm.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* username */}
            <FormField
              control={registerForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounceUsername(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isUsernameChecking && (
                    <Loader2 className="animate-spin h-4 w-4 ml-2" />
                  )}
                  <p
                    className={`text-sm ${usernameMessage === "Username is available" ? "text-green-500" : "text-red-500"}`}
                  >
                    {usernameMessage}
                  </p>
                </FormItem>
              )}
            />
            {/* email */}
            <FormField
              control={registerForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* password */}
            <FormField
              control={registerForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isSubmitting ? (
                <div>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  <span>Signing Up...</span>
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <div className="flex flex-col gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
             Continue with Google
          </Button>
          <Button
            variant="outline"
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          >
            Continue with GitHub
          </Button>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default page;
