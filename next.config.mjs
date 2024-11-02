/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        emotion: true
    },
    experimental: {
     outputFileTracingIncludes: {
       '/api/banner/initial': ['./public/fonts/**/*'],
      },
    },
};

export default nextConfig;
