import type { FnArgument } from "@/content/config"

interface FnArgumentWithHue extends FnArgument {
  hue: string
}

export const getArgColorHues = (args: FnArgument[]) => {
  return args.map((_, i) => i * (360 / args.length) + "deg")
}

const getRepeatGroupArgs = (
  args: FnArgument[],
  hues: string[]
): { args: FnArgumentWithHue[]; start: number } => {
  const fallback = { args: [], start: args.length }

  const restStartIdx = args.findIndex((arg) => arg.multiple)
  if (restStartIdx === -1) return fallback

  const rest = args.slice(restStartIdx)
  if (rest.length === 0) return fallback

  const remapped = Array.from({ length: 2 }, (_, i) =>
    rest.map((arg, j) => ({
      ...arg,
      summary: `${arg.summary}${i + 1}`,
      hue: hues[restStartIdx + j]
    }))
  )

  return { args: remapped.flat(), start: restStartIdx }
}

export const remapArgs = (
  args: FnArgument[],
  hues: string[]
): { args: FnArgumentWithHue[]; rest: boolean } => {
  const { args: repeatGroupArgs, start } = getRepeatGroupArgs(args, hues)
  const notRepeatArgs = args.slice(0, start).map((arg, i) => ({ ...arg, hue: hues[i] }))

  return {
    args: [...notRepeatArgs, ...repeatGroupArgs],
    rest: repeatGroupArgs.length > 0
  }
}
