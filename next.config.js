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
  experimental: {
    appDir: true
  }
};

module.exports = nextConfig;
