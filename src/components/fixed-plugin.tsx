"use client";
import { Button } from "@material-tailwind/react";

export function FixedPlugin() {
  return (
    <Button
      color="white"
      size="sm"
      className="!fixed bottom-4 right-4 flex gap-1 pl-2 items-center border border-blue-gray-50"
    >
      Admin Login
    </Button>
  );
}
