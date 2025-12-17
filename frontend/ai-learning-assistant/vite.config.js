import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [react(), tailwindcss()],
    define: {
      'process.env': {
        // Map Vite env to tutorial-style process.env
        REACT_APP_API_URL: env.VITE_API_URL ?? 'http://localhost:8000',
      },
    },
  });
};
