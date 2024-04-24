import { toast } from "react-toastify"

const BASE_URL = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:4000"

export const makeRestRequest = async <T>({
  endpoint,
  method,
  body,
  successMessage,
}: {
  endpoint: string
  method: "GET" | "POST" | "PUT" | "DELETE"
  body?: string
  successMessage?: string
}): Promise<T> => {
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
    console.log("🚀 ~ response:", response)
    if (!response.ok) {
      const errorMessage = data.message || "An unexpected error occurred"
      toast.error(errorMessage)
    } else {
      console.log("OK", successMessage)
      if (successMessage) {
        toast.success(successMessage)
      }
    }

    return data
  } catch (error) {
    console.error("REST request failed:", error)
    throw error
  }
}
