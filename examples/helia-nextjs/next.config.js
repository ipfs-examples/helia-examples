/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    loader: 'imgix',
    path: 'http://localhost:3000'
  },
  distDir: 'dist',
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
