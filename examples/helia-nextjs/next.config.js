import { NodeProtocolUrlPlugin } from 'node-stdlib-browser/helpers/webpack/plugin'

export default {
  reactStrictMode: true,
  images: {
    loader: 'imgix',
    path: 'http://localhost:3000'
  },
  output: 'export',
  distDir: 'dist',
  webpack: (config) => {
    // support loading modules with "node:" prefix
    // see https://github.com/webpack/webpack/issues/14166
    // see https://github.com/Richienb/node-polyfill-webpack-plugin/issues/19
    config.plugins.push(new NodeProtocolUrlPlugin())

    // Important: return the modified config
    return config
  }
}
