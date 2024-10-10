import { resolve } from 'path'
import defaultConfig from '../vite.config.js'

// override resolution of `blockstore-core` module so we can pre-fill a memory
// blockstore with test data
defaultConfig.resolve ??= {}
defaultConfig.resolve.alias ??= {}
defaultConfig.resolve.alias['blockstore-core/dist/src/memory.js'] = resolve(process.cwd(), 'test/blockstore.js')

// https://vitejs.dev/config/
export default defaultConfig
