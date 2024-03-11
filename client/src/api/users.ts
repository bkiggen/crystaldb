import type { UserT } from "../types/User"
import { makeRestRequest } from "./makeRequest" // Utility function we will create

export const signUpUser = async (newUser: UserT): Promise<UserT> => {
  const endpoint = "/users/signup"
  const body = JSON.stringify(newUser)
  return makeRestRequest<UserT>(endpoint, "POST", body)
}

export const signInUser = async (
  credentials: Pick<UserT, "email" | "password">,
): Promise<{ token: string; user: UserT }> => {
  const endpoint = "/users/login"
  const body = JSON.stringify(credentials)
  const data = await makeRestRequest<{ token: string; user: UserT }>(endpoint, "POST", body)

  if (data.token) {
    localStorage.setItem("userToken", data.token)
    console.log("Login successful")
  } else {
    console.error("Login failed")
  }

  return data
}

export const handleLogout = () => {
  localStorage.removeItem("userToken")
  console.log("Logout successful")
  // Redirect to login page or update UI
}
