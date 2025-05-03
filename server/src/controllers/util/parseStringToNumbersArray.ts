export function parseCycleCSVToNumbersArray(input) {
  // Split the input string by commas
  const parts = input.split(",");

  // Initialize an array to store the result
  const result = [];

  // Iterate over each part
  for (let part of parts) {
    // Trim any whitespace
    part = part.trim();

    // Check if the part is a range
    if (part.includes("-")) {
      // Split the range into start and end
      const [start, end] = part.split("-").map(Number);

      // Generate the numbers in the range and add to the result
      for (let i = start; i <= end; i++) {
        result.push(i);
      }
    } else {
      // Convert the single value to a number and add to the result
      result.push(Number(part));
    }
  }

  return result;
}

export function parseCycles(input: string): number[] {
  if (!input) {
    return [];
  }
  const parts = input.split(",");
  const result: number[] = [];

  for (const part of parts) {
    const trimmed = part.trim();

    if (trimmed.includes("-")) {
      const [startStr, endStr] = trimmed.split("-").map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) {
          result.push(i);
        }
      }
    } else {
      const value = parseInt(trimmed, 10);
      if (!isNaN(value)) {
        result.push(value);
      }
    }
  }

  return result;
}
