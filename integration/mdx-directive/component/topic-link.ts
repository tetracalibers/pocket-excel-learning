import type { TextDirective } from "mdast-util-directive"

const TAG_NAME = "AutoImportedTopicLink"

const importTopicLinkComponent: Record<string, [string, string][]> = {
  "./src/components/directive/topic-link.astro": [["default", TAG_NAME]]
}

const variants = new Set(["topic"])

const isTopicLinkNode = (node: TextDirective) => {
  return variants.has(node.name)
}

const parseTopicLinkNode = (node: TextDirective) => {
  return {
    name: TAG_NAME,
    attributes: { id: node.attributes.id },
    children: node.children
  }
}

export const topicLinkText = {
  import: importTopicLinkComponent,
  is: isTopicLinkNode,
  parse: parseTopicLinkNode
}
