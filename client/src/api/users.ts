import type { UserT } from "../types/User"
import { makeRestRequest } from "./makeRequest" // Utility function we will create
import { toast } from "react-toastify"

type UserReturnT = { token: string; user: UserT }

const logUserIn = (data) => {
  if (data.token) {
    localStorage.setItem("userToken", data.token)
    localStorage.setItem("userIsAdmin", data.user.isAdmin ? "true" : "false")
    console.log("Login successful")
  } else {
    toast.error("Login failed")
  }

  return data
}

export const signUpUser = async (secret, newUser: UserT): Promise<UserReturnT> => {
  const endpoint = "/users/signup"
  const body = JSON.stringify({ ...newUser, secret })
  const data = await makeRestRequest<UserReturnT>({ endpoint, method: "POST", body })
  return logUserIn(data)
}

export const signInUser = async (
  credentials: Pick<UserT, "nickname" | "password">,
): Promise<UserReturnT> => {
  const endpoint = "/users/login"
  const body = JSON.stringify(credentials)
  const data = await makeRestRequest<UserReturnT>({ endpoint, method: "POST", body })
  return logUserIn(data)
}

export const handleLogout = () => {
  localStorage.removeItem("userToken")
  localStorage.removeItem("userIsAdmin")
  console.log("Logout successful")
}
