import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'My React Vite PWA',
        short_name: 'ReactPWA',
        description: 'My React Vite Progressive Web App',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          }
        ],
      },
    }),
  ],
  server: {
    host: '0.0.0.0', // Allows external access
    port: 5173, // Your Vite dev server port
    strictPort: true, // Ensure the port is not changed
    hmr: {
      host: '192.168.8.112', // Use your local network IP
    },
    watch: {
      usePolling: true, // Ensure file changes are detected
    },
  }
})