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

    if (!response.ok) {
      const errorMessage = data.message || "An unexpected error occurred"
      toast.error(errorMessage)
      // forward to login screen
      if (response.status === 403 || response.status === 401) {
        window.location.href = "/login"
      }
    } else {
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
