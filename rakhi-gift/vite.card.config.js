// Builds the whole app into ONE self-contained html file (card/index.html)
// that you can send directly to your sister. No server needed on her side.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'card',
  },
})
