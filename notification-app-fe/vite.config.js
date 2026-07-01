import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/evaluation-service': {
        target: 'http://4.224.186.213',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Remove cookies from the request before forwarding it to the backend.
            // Since this is localhost, the browser might send huge cookies from other
            // local apps, which causes a "400 Request Header Or Cookie Too Large" error.
            proxyReq.removeHeader('cookie');
          });
        }
      }
    }
  },
})
