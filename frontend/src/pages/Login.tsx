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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const handleSubmit = () => {
    if(signUpMode) {
        signUp(credential)
         .then(() => {
           setSignUpMode(!signUpMode)
         }).catch(toastError)
    } else {
        signIn(credential.username, credential.password)
         .then((res) => {
            const {access_token, ...user_info} = res.data;
            localStorage.setItem("user", JSON.stringify(user_info));
            setToken(access_token)
            navigate(PAGE_BY_ROLE[user_info.role])
         }).catch(toastError)
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{signUpMode ? SIGN_UP_TITLE : LOGIN_TITLE}</CardTitle>
        <CardDescription>{signUpMode ? SIGN_UP_DESC : LOGIN_DESC}</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Username</Label>
              <Input id="email"
                     type="email"
                     onChange={(e) => setCredential({...credential, username: e.target.value})}
                     placeholder="m@example.com"
                     required
                    />
            </div>
            {signUpMode && <div className="grid gap-2">
              <Label htmlFor="email">Phone</Label>
              <Input id="phone"
                     onChange={(e) => setCredential({...credential, phone: e.target.value})}
                     placeholder="+992"
                     required
                    />
            </div>}
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required onChange={(e) => setCredential({...credential, password: e.target.value})}
/>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" onClick={handleSubmit}>
          {signUpMode ? "Create account" : "Login"}
        </Button>
        <Button variant="link" className="w-full" onClick={() => setSignUpMode(!signUpMode)}>
           {signUpMode ? 'Login' : 'Create new account'}
        </Button>
      </CardFooter>
    </Card>
  );
}
