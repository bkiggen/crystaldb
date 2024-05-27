import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Box, TextField, Button, Typography, Container } from "@mui/material"

import { signUpUser, signInUser } from "../../api/users"

import { textFieldStyles } from "../../styles/vars"
import colors from "../../styles/colors"

const LoginPage = () => {
  const [password, setPassword] = useState("")
  const [nickname, setNickname] = useState("")
  const [secret, setSecret] = useState("")
  const [signUpMode, setSignUpMode] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (signUpMode) {
      const newUser = await signUpUser(secret, { nickname, password })
      if (newUser.token) {
        navigate("/")
      }
    } else {
      const loggedInUser = await signInUser({ nickname, password })
      if (loggedInUser.token) {
        navigate("/")
      }
    }
  }

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: colors.slateA4,
          padding: "24px",
          borderRadius: "4px",
          border: "1px solid white",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ margin: "12px" }}>
          Sign {signUpMode ? "Up" : "In"}
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          {signUpMode ? (
            <TextField
              margin="normal"
              required
              fullWidth
              id="secret"
              label="Secret"
              name="secret"
              autoComplete="secret"
              autoFocus
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              sx={textFieldStyles}
            />
          ) : null}
          <TextField
            margin="normal"
            required
            fullWidth
            id="nickname"
            label="Nickname"
            name="nickname"
            autoComplete="nickname"
            autoFocus
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            sx={textFieldStyles}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={textFieldStyles}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              type="button"
              variant="text"
              onClick={() => setSignUpMode(!signUpMode)}
              sx={{ mt: 3, mb: 2 }}
            >
              {signUpMode ? "Sign in instead" : "Sign up instead"}
            </Button>
            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign {signUpMode ? "Up" : "In"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default LoginPage
