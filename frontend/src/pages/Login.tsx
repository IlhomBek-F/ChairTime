import { signIn, signUp } from "@/api/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/form/input";
import { Label } from "@/components/ui/form/label";
import { PAGE_BY_ROLE } from "@/config/route";
import { setToken } from "@/lib/token";
import { toastError } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router";

const SIGN_UP_TITLE = "Create new account"
const LOGIN_TITLE = "Login to your account"

const SIGN_UP_DESC = "Enter your username and password to create new account"
const LOGIN_DESC = "Enter your username below to login to your account"

export function Login() {
  const [signUpMode, setSignUpMode] = useState(false);
  const [credential, setCredential] = useState({username: "", password: "", phone: ""})
  const navigate = useNavigate();

  const handleSubmit = async () => {
      if(signUpMode) {
        _signUp()
      } else {
        _signIn()
      }
  }

  const _signUp = async () => {
    try {
      await signUp(credential)
      setSignUpMode(!signUpMode)
    } catch(err) {
        toastError(err)()
    }
  }

  const _signIn = async () => {
    try {
      const res = await signIn(credential.username, credential.password)
      const {access_token, ...user_info} = res.data;
      localStorage.setItem("user", JSON.stringify(user_info));
      setToken(access_token)
      navigate(PAGE_BY_ROLE[user_info.role])
    } catch(err) {
        toastError(err)()
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg rounded-2xl border border-gray-100">
  <CardHeader className="space-y-1 text-center">
    <CardTitle className="text-2xl font-bold font-mono">
      {signUpMode ? SIGN_UP_TITLE : LOGIN_TITLE}
    </CardTitle>
    <CardDescription className="text-gray-500">
      {signUpMode ? SIGN_UP_DESC : LOGIN_DESC}
    </CardDescription>
  </CardHeader>

  <CardContent>
    <form className="flex flex-col gap-4">
      {/* Username */}
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="yourname"
          required
          onChange={(e) =>
            setCredential({ ...credential, username: e.target.value })
          }
        />
      </div>

      {/* Phone only on SignUp */}
      {signUpMode && (
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+992"
            required
            onChange={(e) =>
              setCredential({ ...credential, phone: e.target.value })
            }
          />
        </div>
      )}

      {/* Password */}
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          {!signUpMode && (
            <a
              href="#"
              className="text-sm text-blue-600 hover:underline cursor-pointer"
            >
              Forgot?
            </a>
          )}
        </div>
        <Input
          id="password"
          type="password"
          required
          onChange={(e) =>
            setCredential({ ...credential, password: e.target.value })
          }
        />
      </div>
    </form>
  </CardContent>

  <CardFooter className="flex flex-col gap-3">
    {/* Primary button */}
    <Button
      type="submit"
      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-xl cursor-pointer"
      onClick={handleSubmit}
    >
      {signUpMode ? "Create account" : "Login"}
    </Button>

    {/* Switch form mode */}
    <Button
      variant="ghost"
      className="w-full text-sm text-gray-600 hover:text-black"
      onClick={() => setSignUpMode(!signUpMode)}
    >
      {signUpMode ? "Already have an account? Login" : "Create new account"}
    </Button>
  </CardFooter>
</Card>

  );
}
