"use client";

import { useState } from 'react';
import { Button, Input, Card, CardBody, Typography } from "@material-tailwind/react";
import QRCode from 'qrcode.react';

export default function GenerateQR() {
  const [tableNumber, setTableNumber] = useState('');
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const downloadQR = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
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
      <Card className="max-w-md mx-auto">
        <CardBody>
          <Typography variant="h4" color="blue-gray" className="mb-4">
            Generate Table QR Code
          </Typography>
          <div className="space-y-4">
            <Input
              label="Table Number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />
            {tableNumber && (
              <div className="text-center">
                <div className="mb-4">
                  <QRCode
                    id="qr-code"
                    value={`${baseUrl}/table/${tableNumber}`}
                    size={200}
                    level="H"
                  />
                </div>
                <Button onClick={downloadQR}>
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