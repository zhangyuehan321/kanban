/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
    base: process.env.VITE_BASE_PATH || '/',
    resolve: {
        alias: {
            // '@': '/src',
            '@': path.resolve(__dirname, 'src')
        }
    },
    server: {
        // 开发环境：将 /api 请求代理到本地 Node 后端（server/index.mjs）
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true
            }
        }
    },
    plugins: [react(), tailwindcss()],
    test: {
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        include: ['src/**/*.{test,spec}.{ts,tsx}']
    }
});
