/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Article thumbnails come from many publisher domains, so allow any HTTPS host.
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;
