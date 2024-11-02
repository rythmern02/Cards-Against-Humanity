/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
     outputFileTracingIncludes: {
       './src/app/api/code/route': ['./public/fonts/**/*'],
      },
    },
};

export default nextConfig;
