"use client";

import { useState } from 'react';
import { Button, Input, Card, CardBody, Typography } from "@material-tailwind/react";
// ✅ FINAL, CORRECT IMPORT: The library exports a specific component for Canvas rendering.
import { QRCodeCanvas } from 'qrcode.react';

export default function GenerateQR() {
  const [tableNumber, setTableNumber] = useState('');
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const downloadQR = () => {
    // Note: The id here should match the id on the QRCodeCanvas component
    const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `table-${tableNumber}-qr.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="container mx-auto px-4 py-32">
      <Card
        className="max-w-md mx-auto"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
      >
        <CardBody
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
        >
          <Typography
            variant="h4"
            color="blue-gray"
            className="mb-4"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            Generate Table QR Code
          </Typography>
          <div className="space-y-4">
            <Input
              label="Table Number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
            />
            {tableNumber && (
              <div className="text-center">
                <div className="mb-4">
                  {/* ✅ FINAL, CORRECT COMPONENT: Use the specific Canvas component */}
                  <QRCodeCanvas
                    id="qr-code-canvas"
                    value={`${baseUrl}/table/${tableNumber}`}
                    size={200}
                    level="H"
                  />
                </div>
                <Button
                  onClick={downloadQR}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  onResize={undefined}
                  onResizeCapture={undefined}
                >
                  Download QR Code
                </Button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}