export const getHeaders = (data: Array<Record<string, unknown>>) => {
  // Object.keysの要素数が最も大きいものを採用
  const keys = data.map((row) => Object.keys(row))
  const header = keys.reduce((acc, cur) => {
    return cur.length > acc.length ? cur : acc
  }, [])
  return header
}

export const toTableArray = (data: Array<Record<string, unknown>>, headers: string[]) => {
  return [
    headers,
    ...data.map((row) => {
      return headers.map((header) => {
        return row[header] || ""
      })
    })
  ]
}
