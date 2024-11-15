import type { NextConfig } from 'next'
import type { Configuration } from 'webpack'

const nextConfig: NextConfig = {
  webpack: (config: Configuration) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      react: require.resolve('react'),
    }
    return config
  },
}

export default nextConfig