import { toast } from "react-toastify"

const BASE_URL = "http://localhost:4000"

export const makeRestRequest = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: string,
): Promise<T> => {
  const token = localStorage.getItem("userToken")
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  }

  const options: RequestInit = {
    method,
    headers,
    body,
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options)
    const data = await response.json()
    if (!response.ok) {
      const errorMessage = data.message || "An unexpected error occurred"
      toast.error(errorMessage)
    }

    return data
  } catch (error) {
    console.error("REST request failed:", error)
    throw error
  }
}
