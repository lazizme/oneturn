/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@workspace/ui",
    "@workspace/types",
    "@workspace/mock-data",
  ],
}

export default nextConfig
