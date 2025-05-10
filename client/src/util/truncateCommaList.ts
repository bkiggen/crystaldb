export const truncateCommaList = (str: string) => {
  if (!str) {
    return ""
  }

  const trimmedStr = str.trim()
  const splitStr = trimmedStr.split(",")
  // if only one item, return it as a string
  if (splitStr.length === 1) {
    return splitStr[0].trim()
  }
  // if more than one item, return just first and last item in format 2-23
  const firstItem = splitStr[0].trim()
  const lastItem = splitStr[splitStr.length - 1].trim()
  return `${firstItem}-${lastItem}`
}
