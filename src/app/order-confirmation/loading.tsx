"use client";

import { Typography } from "@material-tailwind/react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      {/* ✅ Added props to fix build error */}
      <Typography
        className="ml-3"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
      >
        Loading...
      </Typography>
    </div>
  );
}