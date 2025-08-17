import {
  Card,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import Image from "next/image";
import { motion } from "framer-motion";

interface AboutCardProp {
  title: string;
  subTitle: string;
  description: string;
  image?: string;
}

export function AboutCard({ title, description, subTitle, image }: AboutCardProp) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* ✅ Added props to fix build error */}
      <Card
        shadow={false}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
      >
        <CardBody
          className="h-[453px] p-5 flex flex-col justify-center items-center rounded-2xl bg-gray-900 relative overflow-hidden"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
        >
          {image && (
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover opacity-50"
              />
            </motion.div>
          )}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h6"
              className="mb-4 text-center"
              color="white"
              placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
            >
              {subTitle}
            </Typography>
            <Typography
              variant="h4"
              className="text-center"
              color="white"
              placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
            >
              {title}
            </Typography>
            <Typography
              color="white"
              className="mt-2 mb-10 text-base w-full lg:w-8/12 text-center font-normal"
              placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
            >
              {description}
            </Typography>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                color="white"
                size="sm"
                placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
              >
                view details
              </Button>
            </motion.div>
          </motion.div>
        </CardBody>
      </Card>
    </motion.div>
  );
}

export default AboutCard;