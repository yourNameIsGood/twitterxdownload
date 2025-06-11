/** @type {import('next').NextConfig} */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const packageJson = require('./package.json');

const nextConfig = {
  env: {
    APP_VERSION: packageJson.version
  },
  experimental: {
    forceSwcTransforms: true,
  },
  reactStrictMode: false // 禁用严格模式，避免在开发过程中useEffect执行2次
}

export default nextConfig