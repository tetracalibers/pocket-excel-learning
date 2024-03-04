import { unified } from "unified"
import rehypeParse from "rehype-parse"
import rehypeStringify from "rehype-stringify"
import rehypeSlug from "@/lib/rehype-slug"
import type { MiddlewareHandler } from "astro"
import { SITE_BASE } from "@/site-config"

const processor = unified().use(rehypeParse).use(rehypeSlug).use(rehypeStringify)

const APPLY_TARGET = ["topic"]

export const addHeadingIds: MiddlewareHandler = async (context, next) => {
  const response = await next()

  const [category, slug] = context.url.pathname.replace(SITE_BASE, "").split("/").filter(Boolean)

  // 記事ページ以外は処理しない
  // - category === undefined => top page
  // - slug === undefined => top page for category
  if (!category || !slug) {
    return response
  }

  // APPLY_TARGET配下のページのみ処理する
  if (!APPLY_TARGET.includes(category)) {
    return response
  }

  const html = await response.text()
  const processedHtml = (await processor.process(html)).toString()

  return new Response(processedHtml, {
    status: 200,
    headers: response.headers
  })
}
