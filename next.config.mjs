/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
     outputFileTracingIncludes: {
       './src/app/api/banner/initial': ['./public/fonts/**/*'],
      },
    },
};

export default nextConfig;
