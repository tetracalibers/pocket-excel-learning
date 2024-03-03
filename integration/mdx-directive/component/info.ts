import type { ContainerDirective } from "mdast-util-directive"
import type * as mdast from "mdast"

const TAG_NAME = "AutoImportedInfoBlock"

const importInfoBlockComponent: Record<string, [string, string][]> = {
  "./src/components/directive/info.astro": [["default", TAG_NAME]]
}

const variants = new Set(["info"])

const isInfoBlock = (node: ContainerDirective) => {
  return variants.has(node.name)
}

const parseInfoBlock = (node: ContainerDirective) => {
  return {
    name: TAG_NAME,
    attributes: {},
    children: node.children as mdast.BlockContent[]
  }
}

export const infoContainer = {
  import: importInfoBlockComponent,
  is: isInfoBlock,
  parse: parseInfoBlock
}
