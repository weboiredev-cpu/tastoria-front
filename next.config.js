/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'plus.unsplash.com',
      'lh3.googleusercontent.com',
      'res.cloudinary.com'
    ],
  },
  transpilePackages: ['framer-motion'],
};

module.exports = nextConfig;