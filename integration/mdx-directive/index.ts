import type { AstroIntegration } from "astro"
import type * as mdast from "mdast"
import remarkDirective from "remark-directive"
import type * as unified from "unified"
import { visit } from "unist-util-visit"
import type { ContainerDirective, TextDirective, LeafDirective } from "mdast-util-directive"
import { makeComponentNode } from "./ast-node"
import { closureContainer } from "./component/closure"
import { popoverExcelFnText } from "./component/popover-excel-fn"

export const directiveAutoImport: Record<string, [string, string][]> = {
  ...closureContainer.import,
  ...popoverExcelFnText.import
}

function remarkDirectiveComponent(): unified.Plugin<[], mdast.Root> {
  const transformer: unified.Transformer<mdast.Root> = (tree) => {
    visit(tree, (_node, index, parent) => {
      if (!parent || index === null) {
        return
      }

      // @ts-ignore
      if (_node.type === "containerDirective") {
        const node: ContainerDirective = _node

        if (closureContainer.is(node)) {
          parent.children[index] = makeComponentNode(closureContainer.parse(node))
          return
        }
      }

      // @ts-ignore
      if (_node.type === "leafDirective") {
        // const node: LeafDirective = _node
        // add your own leafDirective here
      }

      // @ts-ignore
      if (_node.type === "textDirective") {
        const node: TextDirective = _node

        if (popoverExcelFnText.is(node)) {
          parent.children[index] = makeComponentNode(popoverExcelFnText.parse(node))
          return
        }
      }
    })
  }

  return function attacher() {
    return transformer
  }
}

export function astroMdxDirective(): AstroIntegration {
  return {
    name: "astro-mdx-directive",
    hooks: {
      "astro:config:setup": ({ updateConfig }) => {
        updateConfig({
          markdown: {
            remarkPlugins: [remarkDirective, remarkDirectiveComponent()]
          }
        })
      }
    }
  }
}
