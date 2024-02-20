import { defineConfig } from "astro/config"
import svelte from "@astrojs/svelte"
import mdx from "@astrojs/mdx"
import rehypePrettyCode from "rehype-pretty-code"
import tailwind from "@astrojs/tailwind"
import AutoImport from "astro-auto-import"
import { astroMdxDirective, directiveAutoImport } from "./integration/mdx-directive"

const prettyCodeOptions = {
  theme: "dracula",
  keepBackground: false,
  defaultLang: "elm"
}

// https://astro.build/config
export default defineConfig({
  integrations: [
    AutoImport({ imports: [directiveAutoImport] }),
    astroMdxDirective(),
    svelte(),
    mdx(),
    tailwind()
  ],
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]]
  }
})
