interface RestRequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE"
  body?: string
}

const BASE_URL = "http://localhost:4000"

export const makeRestRequest = async <T>(
  endpoint: string,
  method: RestRequestOptions["method"],
  body?: string,
): Promise<T> => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  const options: RequestInit = {
    method,
    headers,
    body,
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: T = await response.json()
    return data
  } catch (error) {
    console.error("REST request failed:", error)
    throw error
  }
}

// const fetchProtectedData = async () => {
//   const token = localStorage.getItem("userToken")
//   try {
//     const response = await fetch("/protected-endpoint", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     const data = await response.json()
//     console.log(data)
//     // Handle the protected data
//   } catch (error) {
//     console.error("An error occurred:", error)
//   }
// }
