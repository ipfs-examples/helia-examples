export default {
  build: {
    target: 'es2022',
    outDir: './dist',
    emptyOutDir: true
  },
  optimizeDeps: {
    esbuildOptions: { target: 'es2022', supported: { bigint: true } }
  },
  server: {
    open: true
  },
  root: './publisher'
}
