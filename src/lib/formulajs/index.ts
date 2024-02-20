import { utils } from "@formulajs/formulajs"

const error = utils.errors

export { IF, ISERROR, TRIM, MID, LEN } from "@formulajs/formulajs"

export const SEARCH = (find_text: string, within_text: string, start_num = 0) => {
  let foundAt: number

  if (typeof find_text !== "string" || typeof within_text !== "string") {
    return error.value
  }

  // ワイルドカードへの対応
  if (find_text.includes("?") || find_text.includes("*")) {
    const find_regex = find_text.replaceAll(/\?/g, ".").replaceAll(/\*/g, ".*")
    foundAt = within_text.search(new RegExp(find_regex, "i"))

    if (foundAt === -1) {
      return error.value
    }
  } else {
    foundAt = within_text.toLowerCase().indexOf(find_text.toLowerCase(), start_num - 1) + 1
  }

  return foundAt === 0 ? error.value : foundAt
}
