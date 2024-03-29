import { z, defineCollection, reference } from "astro:content"

const COLORS = {
  string: "rgb(219, 237, 219)",
  logical: "rgb(232, 222, 238)",
  ref: "#FAF3DD",
  lookup: "#F3EEEE",
  convert: "#FAECEC",
  total: "#F9F2F5",
  rank: "#F9F2F5",
  sequence: "#E9F3F7"
}

const CATEGORIES = [
  "lookup",
  "string",
  "condition",
  "ref",
  "convert",
  "total",
  "rank",
  "sequence"
] as const
export type CategoryKey = (typeof CATEGORIES)[number]
const zCategory = z.enum(CATEGORIES).transform((val) => {
  if (val === "lookup")
    return {
      label: "表引き",
      color: COLORS.lookup
    }
  if (val === "string")
    return {
      label: "文字列操作",
      color: COLORS.string
    }
  if (val === "condition")
    return {
      label: "条件分岐",
      color: COLORS.logical
    }
  if (val === "ref") return { label: "セル参照", color: COLORS.ref }
  if (val === "convert") return { label: "データ型の変換", color: COLORS.convert }
  if (val === "total") return { label: "集計", color: COLORS.total }
  if (val === "rank") return { label: "データの順序", color: COLORS.rank }
  if (val === "sequence") return { label: "連続データ", color: COLORS.sequence }
})

const zAvailableVersion = z
  .array(
    z.enum(["365", "2021", "old"]).transform((val) => {
      if (val === "365") return "Microsoft 365"
      if (val === "2021") return "Excel 2021"
      if (val === "old") return "古いExcelでも可"
    })
  )
  .default(["old"])

const zFnArgument = z
  .object({
    summary: z.string(),
    optional: z.boolean().optional(),
    default: z.coerce.string().optional(),
    pattern: z
      .array(
        z
          .object({
            value: z.coerce.string(),
            behavior: z.string()
          })
          .strict()
      )
      .optional(),
    detail: z.string().optional(),
    multiple: z.boolean().optional()
  })
  .strict()

export type FnArgument = z.infer<typeof zFnArgument>

const zValueType = z.enum(["string", "number", "boolean", "error"]).transform((val) => {
  if (val === "string")
    return {
      label: "文字列",
      color: COLORS.string
    }
  if (val === "number")
    return {
      label: "数値",
      color: "#67e8f9"
    }
  if (val === "boolean")
    return {
      label: "真偽値",
      color: COLORS.logical
    }
  if (val === "error")
    return {
      label: "エラー",
      color: "#fca5a5"
    }
})

const zFnReturn = z
  .object({
    type: zValueType.optional(),
    summary: z.coerce.string()
  })
  .strict()
export type FnReturn = z.infer<typeof zFnReturn>

const functionCollections = defineCollection({
  type: "content",
  schema: z
    .object({
      name: z.string(),
      summary: z.string(),
      args: z.array(zFnArgument).default([]),
      return: z.union([zFnReturn, z.array(zFnReturn.extend({ if: z.string() }))]).optional(),
      category: zCategory,
      available: zAvailableVersion,
      similarFn: z.array(reference("fn")).default([]),
      togetherFn: z.array(reference("fn")).default([]),
      relatedTopics: z.array(reference("topic")).default([])
    })
    .strict()
})

const topicCollection = defineCollection({
  type: "content",
  schema: z
    .object({
      title: z.string(),
      category: zCategory
    })
    .strict()
})

const questionsCollection = defineCollection({
  type: "content",
  schema: z
    .object({
      title: z.string(),
      created: z.coerce.date(),
      updated: z.coerce.date().optional(),
      category: zCategory,
      topics: z.array(reference("topic")).default([]),
      useFn: z.array(reference("fn")).default([]),
      available: zAvailableVersion,
      sheet: z.string().optional(),
      level: z.number().int().min(1).max(5),
      draft: z.boolean().default(false)
    })
    .strict()
})

export const collections = {
  fn: functionCollections,
  topic: topicCollection,
  questions: questionsCollection
}
