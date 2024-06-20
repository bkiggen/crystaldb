export function parseCycleCSVToNumbersArray(input) {
  // Split the input string by commas
  const parts = input.split(',')

  // Initialize an array to store the result
  const result = []

  // Iterate over each part
  for (let part of parts) {
    // Trim any whitespace
    part = part.trim()

    // Check if the part is a range
    if (part.includes('-')) {
      // Split the range into start and end
      const [start, end] = part.split('-').map(Number)

      // Generate the numbers in the range and add to the result
      for (let i = start; i <= end; i++) {
        result.push(i)
      }
    } else {
      // Convert the single value to a number and add to the result
      result.push(Number(part))
    }
  }

  return result
}
