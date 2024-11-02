/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
     outputFileTracingIncludes: {
        './src/app/api/banner/initial/route': ['./public/fonts/**/*'],
      },
    },
};

export default nextConfig;
