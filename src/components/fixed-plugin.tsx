"use client";
import { Button } from "@material-tailwind/react";

export function FixedPlugin() {
  return (
    // ✅ Added props to fix build error
    <Button
      color="white"
      size="sm"
      className="!fixed bottom-4 right-4 flex gap-1 pl-2 items-center border border-blue-gray-50"
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
      onResize={undefined}
      onResizeCapture={undefined}
    >
      Admin Login
    </Button>
  );
}