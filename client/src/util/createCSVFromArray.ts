const arrayToCSV = (objArray) => {
  // Extract headers
  const headers = Object.keys(objArray[0])
  const csvRows = [headers.join(",")] // Create the header row

  // Map the values of each object into CSV rows
  objArray.forEach((obj) => {
    const row = headers.map((header) => `"${obj[header]}"`).join(",") // Map each value of the object
    csvRows.push(row)
  })

  return csvRows.join("\n")
}

const downloadCSV = (csvString, filename = "data.csv") => {
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const createCSVFromArray = (array, filename) => {
  const csv = arrayToCSV(array)
  downloadCSV(csv, filename)
}

export default createCSVFromArray
