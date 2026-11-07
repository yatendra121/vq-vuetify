import fs from 'fs/promises'
//import { readFileSync } from "fs";

import dts from 'rollup-plugin-dts'
//import alias from "@rollup/plugin-alias";
import fg from 'fast-glob'
import mm from 'micromatch'

// Every Vq* component a plugin's install() registers, read from the barrel it
// registers from, so the global component types can't fall behind it.
async function registeredComponents(barrel) {
    const source = await fs.readFile(new URL(barrel, import.meta.url), { encoding: 'utf8' })
    const names = []
    for (const [, list] of source.matchAll(/^export\s*\{([^}]*)\}\s*from/gm)) {
        for (const name of list.split(',').map((part) => part.trim())) {
            if (name.startsWith('Vq')) names.push(name)
        }
    }
    return names
}

// Typed by the exported value, not the same-named type alias: some aliases are
// instance types (VqTextField), which templates can't check against.
const globalComponentEntries = (names) =>
    names.map((name) => `        ${name}: typeof ${name}`).join('\n')

const externalsPlugin = () => ({
    resolveId(source, importer) {
        if (importer && (source.endsWith('.sass') || source.endsWith('.scss'))) {
            return {
                id: source,
                external: true,
                moduleSideEffects: false
            }
        }
    }
})

function createTypesConfig(input, output, renderChunk, filter) {
    input = 'temp-types/' + input
    let files = fg.sync(input)

    if (filter) files = filter(files)
    console.log({ files, input, output, renderChunk, filter })

    return files.map((file) => {
        const outputFile = output.replace('*', mm.capture(input, file)[0])
        return {
            input: file,
            output: [{ file: outputFile, format: 'es' }],
            plugins: [
                dts(),
                externalsPlugin(),
                // alias({
                //   entries: [
                //     {
                //       find: /^@\/(.*)/,
                //       replacement: path.resolve(__dirname, "../types-temp/$1"),
                //     },
                //   ],
                // }),
                {
                    async renderChunk(code) {
                        return renderChunk ? renderChunk(code) : code
                    }
                }
            ]
        }
    })
}

async function getShims() {
    const components = globalComponentEntries(
        await registeredComponents('../src/components/index.ts')
    )

    return (
        await fs.readFile(new URL('../src/shims.d.ts', import.meta.url), {
            encoding: 'utf8'
        })
    )
        .replace(/^\s+\/\/ @skip-build\s+.*$/gm, '')
        .replace(/^\s+\/\/ @generate-components$/gm, components)
}

export default [
    // createTypesConfig("framework.d.ts", "lib/index.d.ts", async (code) => {
    //   return code + "\n\n" + (await getShims());
    // }),
    createTypesConfig('index.d.ts', 'dist/index.d.ts', async (code) => {
        return code + '\n\n' + (await getShims())
    }),
    createTypesConfig('integrations.d.ts', 'dist/integrations.d.ts', async (code) => {
        const components = globalComponentEntries(
            await registeredComponents('../src/components/integrations.ts')
        )
        return `${code}\n\ndeclare module 'vue' {\n    export interface GlobalComponents {\n${components}\n    }\n}\n`
    })
    // createTypesConfig("main.d.ts", "dist/index.d.ts", async (code) => {
    //   console.log("importMap.components");

    //   return (
    //     code +
    //     "\n\n" +
    //     (await getShims()).replace(", VNodeChild } from 'vue'", " } from 'vue'")
    //   );
    // }),
    //createTypesConfig("integrations.d.ts", "dist/index.d.ts"),
    // createTypesConfig("components/index.d.ts", "lib/components/index.d.ts"),
    // createTypesConfig(
    //   "components/*/index.d.ts",
    //   "lib/components/*/index.d.ts",
    //   undefined,
    //   (files) => {
    //     const index = readFileSync(
    //       path.resolve(__dirname, "../src/components/index.ts"),
    //       { encoding: "utf8" }
    //     );
    //     const block = Array.from(
    //       index.matchAll(/^\/\/ export \* from '\.\/(.*)'$/gm),
    //       (m) => m[1]
    //     );
    //     return files.filter(
    //       (file) => !block.some((name) => file.includes(`/${name}/`))
    //     );
    //   }
    // ),
    // createTypesConfig("directives/index.d.ts", "lib/directives/index.d.ts"),
    // createTypesConfig("locale/index.d.ts", "lib/locale/index.d.ts"),
    // createTypesConfig("locale/adapters/*.d.ts", "lib/locale/adapters/*.d.ts"),
    // createTypesConfig("iconsets/*.d.ts", "lib/iconsets/*.d.ts"),
].flat()
