import type { UserT } from "../types/User"
import { makeRestRequest } from "./makeRequest" // Utility function we will create
import { toast } from "react-toastify"

export const signUpUser = async (newUser: UserT): Promise<UserT> => {
  const endpoint = "/users/signup"
  const body = JSON.stringify(newUser)
  return makeRestRequest<UserT>(endpoint, "POST", body)
}

export const signInUser = async (
  credentials: Pick<UserT, "nickname" | "password">,
): Promise<{ token: string; user: UserT }> => {
  const endpoint = "/users/login"
  const body = JSON.stringify(credentials)
  const data = await makeRestRequest<{ token: string; user: UserT }>(endpoint, "POST", body)

  if (data.token) {
    localStorage.setItem("userToken", data.token)
    localStorage.setItem("userIsAdmin", data.user.isAdmin ? "true" : "false")
    console.log("Login successful")
  } else {
    toast.error("Login failed")
  }

  return data
}

export const handleLogout = () => {
  localStorage.removeItem("userToken")
  localStorage.removeItem("userIsAdmin")
  console.log("Logout successful")
  // Redirect to login page or update UI
}
