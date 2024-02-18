import { defineConfig } from "astro/config"
import svelte from "@astrojs/svelte"
import mdx from "@astrojs/mdx"
import rehypePrettyCode from "rehype-pretty-code"

const prettyCodeOptions = {
  theme: "material-theme-lighter",
  keepBackground: false,
  defaultLang: "elm"
}

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), mdx()],
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]]
  }
})
