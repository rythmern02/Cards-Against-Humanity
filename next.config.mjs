/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
     outputFileTracingIncludes: {
        './src/app/api/**/*': ['./public/fonts/**/*'],
      },
    },
};

export default nextConfig;
