import GithubSlugger from "github-slugger"
import { headingRank } from "hast-util-heading-rank"
import { toString } from "hast-util-to-string"
import { visit } from "unist-util-visit"

interface Options {
  prefix?: string
}

const emptyOptions: Options = {}
const slugs = new GithubSlugger()

export default function rehypeSlug(options?: Options) {
  const settings = options || emptyOptions
  const prefix = settings.prefix || ""

  return function (tree: import("hast").Root) {
    slugs.reset()

    visit(tree, "element", function (node) {
      const depth = headingRank(node)
      if (!depth) return

      // 除外するもの
      // - h1タグ
      // - 既にidが設定されているタグ
      if (depth > 1 && !node.properties.id) {
        node.properties.id = prefix + slugs.slug(toString(node).trim())
      }
    })
  }
}
