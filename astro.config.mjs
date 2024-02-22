import { defineConfig } from "astro/config"
import svelte from "@astrojs/svelte"
import mdx from "@astrojs/mdx"
import rehypePrettyCode from "rehype-pretty-code"
import tailwind from "@astrojs/tailwind"
import AutoImport from "astro-auto-import"
import { astroMdxDirective, directiveAutoImport } from "./integration/mdx-directive"
import { resolve } from "node:path"
import react from "@astrojs/react"

const __dirname = new URL(".", import.meta.url).pathname
const prettyCodeOptions = {
  theme: "dracula",
  keepBackground: false,
  defaultLang: "elm"
}

// https://astro.build/config
export default defineConfig({
  site: "https://tetracalibers.github.io",
  base: "/pocket-excel-learning",
  integrations: [
    AutoImport({
      imports: [directiveAutoImport]
    }),
    astroMdxDirective(),
    svelte(),
    mdx(),
    tailwind(),
    react()
  ],
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]]
  },
  vite: {
    resolve: {
      alias: {
        "@": resolve(__dirname, "src")
      }
    }
  }
})
