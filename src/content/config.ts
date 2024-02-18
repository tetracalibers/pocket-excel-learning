import { z, defineCollection, reference } from "astro:content"

const zCategory = z.enum(["lookup", "string", "condition"]).transform((val) => {
  if (val === "lookup") return "表引き"
  if (val === "string") return "文字列操作"
  if (val === "condition") return "条件分岐"
})

const zAvailableVersion = z
  .array(
    z.enum(["365", "2021", "old"]).transform((val) => {
      if (val === "365") return "Office 365"
      if (val === "2021") return "Excel 2021"
      if (val === "old") return "古いExcelでも可"
    })
  )
  .default(["old"])

const zFnReturn = z.object({
  type: z.enum(["string", "number", "boolean", "error"]),
  summary: z.coerce.string(),
  if: z.string().optional()
})

const functionCollections = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    args: z
      .array(
        z.object({
          summary: z.string(),
          default: z.string().optional(),
          pattern: z
            .array(
              z.object({
                value: z.string(),
                behavior: z.string()
              })
            )
            .optional()
        })
      )
      .default([]),
    return: z.union([zFnReturn, z.array(zFnReturn.required())]).optional(),
    category: zCategory,
    available: zAvailableVersion
  })
})

const questionsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    created: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: zCategory.array(),
    topics: z.array(z.string()).default([]),
    useFn: z.array(reference("fn")).default([]),
    available: zAvailableVersion
  })
})

export const collections = {
  fn: functionCollections,
  questions: questionsCollection
}
