/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    loader: 'imgix',
    path: 'http://localhost:3000'
  },
  distDir: 'dist',
  webpack: (config) => {
    /**
     * @see https://github.com/ipfs/helia/issues/553#issuecomment-2158940930
     */
    config.externals.push('node-datachannel/polyfill')
    return config
  }
}

export default () => {
  /**
   * `next start` requires either `undefined` or `'standalone'` output
   * @type {import('next').NextConfig['output']}
   */
  let output = 'standalone'
  if (process.env.NODE_ENV === 'test') {
    // test-browser-example requires  `'export'` output
    output = 'export'
  }

  return {
    ...config,
    output
  }
}
