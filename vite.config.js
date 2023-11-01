import {defineConfig, loadEnv} from "vite"
import {resolve} from 'path'
import vue from "@vitejs/plugin-vue"
import dts from "vite-plugin-dts"
import libCss from 'vite-plugin-libcss'

export default defineConfig(({command, mode }) => {

    return {
        plugins: [vue(), dts({rollupTypes: true, outDir: `dist`}), libCss()],
        build: {
            emptyOutDir: true,
            outDir: `dist`,
            cssCodeSplit: true,
            lib: {
                entry: 'index.ts',
                name: process.env.PACKAGE_NAME,
                fileName: 'index'
            },
            rollupOptions: {
                // make sure to externalize deps that shouldn't be bundled
                // into your library
                external: ['vue', 'typescript', 'vue-tsc', '@types/vue', 'vite-plugin-libcss'],
                output: {
                    // Provide global variables to use in the UMD build
                    // for externalized deps
                    globals: {
                        vue: 'Vue',
                    },
                },
            },
        },
        resolve: {
            alias: {
                '@': resolve(__dirname, './src'),
            }
        }
    }
})
