"use client";
import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AlertDialogComponent from "./AlertDialogComponent";

import { toast } from "sonner";


function MessageCard() {
  

  const handleClose = () => {
    toast.success("Dialog closed");
    console.log("Dialog closed");
  };

  const handleConfirm = () => {
    toast.success("Dialog confirmed");
    console.log("Dialog confirmed");
  };

  return (
    <>
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction className="bg-slate-950 px-2 py-1 text-sm rounded-md text-white">
            {" "}
            <AlertDialogComponent
              cardTriggeringName="Delete"
              title="Confirm Deletion"
              description="Are you sure you want to delete this item?"
              onClose={handleClose}
              onConfirm={handleConfirm}
            />
          </CardAction>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
      </Card>
    </>
  );
}

export default MessageCard;
