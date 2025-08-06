"use client";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import { MapPinIcon, PhoneIcon, ClockIcon } from "@heroicons/react/24/solid";

export function Contact() {
  return (
    <section id="contact" className="py-20 px-8">
      <div className="container mx-auto text-center">
        <Typography variant="h2" color="blue-gray" className="mb-4">
          Contact & Location
        </Typography>
        <Typography variant="lead" className="mx-auto lg:w-3/5 !text-gray-500 mb-12">
          We'd love to hear from you! Visit us, give us a call, or drop us a line. We're here to make your day a little more delicious.
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <Card shadow={false} color="transparent">
            <CardBody className="text-center">
              <MapPinIcon className="h-10 w-10 mx-auto text-blue-gray-700 mb-4" />
              <Typography variant="h5" color="blue-gray" className="mb-2">
                Our Address
              </Typography>
              <Typography className="!text-gray-600">
                Parbhani 431401
              </Typography>
            </CardBody>
          </Card>
          <Card shadow={false} color="transparent">
            <CardBody className="text-center">
              <PhoneIcon className="h-10 w-10 mx-auto text-blue-gray-700 mb-4" />
              <Typography variant="h5" color="blue-gray" className="mb-2">
                Phone Number
              </Typography>
              <Typography className="!text-gray-600">
                +91 8055221419
              </Typography>
            </CardBody>
          </Card>
          <Card shadow={false} color="transparent">
            <CardBody className="text-center">
              <ClockIcon className="h-10 w-10 mx-auto text-blue-gray-700 mb-4" />
              <Typography variant="h5" color="blue-gray" className="mb-2">
                Opening Hours
              </Typography>
              <Typography className="!text-gray-600">
                Mon - Sun: 7:00 AM - 10:00 PM
              </Typography>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default Contact; 