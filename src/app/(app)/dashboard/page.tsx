"use client";

import React from "react";
import MessageCard from "@/components/localcomponents/MessageCard";
import { useSession } from "next-auth/react";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getAcceptMessageStatus,
  toggleAcceptMessageStatus,
} from "@/redux/features/messages/messageThunks";

function Page() {
  const { data: session, status, update } = useSession();
  const user = session?.user;
  const dispatch = useAppDispatch();
  const { acceptMessage } = useAppSelector((state) => state.messages);

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: { acceptMessages: false }, // start neutral until backend loads
  });

  // Fetch status from backend on mount
  React.useEffect(() => {
    dispatch(getAcceptMessageStatus());
  }, [dispatch]);

  // Sync form value with Redux when it changes
  React.useEffect(() => {
    form.reset({ acceptMessages: acceptMessage });
  }, [acceptMessage, form]);

  const handleToggle = async (value: boolean) => {
    try {
      await dispatch(toggleAcceptMessageStatus(value)).unwrap();
      toast.success(`Acceptance status: ${value}`);
    } catch {
      toast.error("Failed to update acceptance status");
    }
  };

  if (status === "loading") return <p>Loading session...</p>;
  if (!session) return <p>User not signed in</p>;

  return (
    <div className="flex flex-col w-full h-[75vh] p-5">
      <div className="flex justify-between pl-40 items-center w-full bg-gray-100">
        <Form {...form}>
          <form className="w-80 space-y-6 p-4 rounded-lg shadow-md">
            <h3 className="mb-4 text-lg font-medium">Acceptance Status</h3>
            <FormField
              control={form.control}
              name="acceptMessages"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-slate-200">
                  <div className="space-y-0.5">
                    <FormLabel>Accept Feedback</FormLabel>
                    <FormDescription>
                      Receive Anonymous Feedback
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(val) => {
                        field.onChange(val);
                        handleToggle(val);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <hr />
      <main className="flex w-full justify-center items-center p-10">
        <MessageCard />
      </main>
    </div>
  );
}

export default Page;
