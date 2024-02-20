import type { ContainerDirective } from "mdast-util-directive"
import type * as mdast from "mdast"
import { remove } from "unist-util-remove"

const TAG_NAME = "AutoImportedClosureBlock"

const importClosureBlockComponent: Record<string, [string, string][]> = {
  "./src/components/directive/closure.astro": [["default", TAG_NAME]]
}

const variants = new Set(["answer", "details"])

const isClosureBlock = (node: ContainerDirective) => {
  return variants.has(node.name)
}

const parseClosureBlock = (node: ContainerDirective) => {
  let label: string

  switch (node.name) {
    case "answer":
      label = "解答例"
      break
    case "details":
      remove(node, (child) => {
        const { data } = child
        if (!data) return false
        if ("directiveLabel" in data && data.directiveLabel) {
          if ("children" in child && "value" in child.children[0]) {
            label = child.children[0].value
          }
          return true
        }
      })
      break
  }

  return {
    name: TAG_NAME,
    attributes: { label },
    children: node.children as mdast.BlockContent[]
  }
}

export const closureContainer = {
  import: importClosureBlockComponent,
  is: isClosureBlock,
  parse: parseClosureBlock
}
