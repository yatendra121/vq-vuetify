/// <reference types="vitest" />

import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
    plugins: [Vue(), vueJsx(), vuetify({ autoImport: false, styles: 'none' })],
    test: {
        server: {
            deps: {
                inline: ['vuetify']
            }
        },
        globals: true,
        environment: 'jsdom',
        exclude: ['**/node_modules/**', '**/dist/**', '.claude/**'],
        setupFiles: ['./vitest.setup.ts']
    }
})
