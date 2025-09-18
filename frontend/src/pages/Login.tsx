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
import { CustomForm } from "@/components/ui/form/bookingForm";
import { PAGE_BY_ROLE } from "@/config/route";
import { setToken, TokenTypeEnum } from "@/lib/token";
import { toastError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import z from "zod";

const SIGN_UP_TITLE = "Create new account";
const LOGIN_TITLE = "Login to your account";

const SIGN_UP_DESC = "Enter your username and password to create new account";
const LOGIN_DESC = "Enter your username below to login to your account";

type Inputs = {
  username: string;
  phone?: string;
  password: string;
};

export function Login() {
  const [signUpMode, setSignUpMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const formSchema = z.object({
  username: z.string().min(6).max(20),
  phone: z.string().min(6).optional(),
  password: z.string().min(4),
  }).refine((data) => signUpMode && !!data.phone || true, {path: ["phone"]});

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const handleSubmit = async () => {
    setLoading(true);
    if (signUpMode) {
      _signUp();
    } else {
      _signIn();
    }
  };

  const _signUp = async () => {
    try {
      await signUp(form.getValues());
      setSignUpMode(!signUpMode);
    } catch (err) {
      toastError(err)();
    } finally {
      setLoading(false)
    }
  };

  const _signIn = async () => {
    try {
      const { username, password } = form.getValues();
      const res = await signIn(username, password);
      const { access_token, refresh_token, ...user_info } = res.data;
      localStorage.setItem("user", JSON.stringify(user_info));
      setToken(TokenTypeEnum.ACCESS_TOKEN, access_token);
      setToken(TokenTypeEnum.REFRESH_TOKEN, refresh_token);
      navigate(PAGE_BY_ROLE[user_info.role]);
    } catch (err) {
      toastError(err)();
    } finally {
      setLoading(false)
    }
  };

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
        <CustomForm
          form={form}
          handleSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          <CustomForm.InputField
            formControl={form.control}
            className="!mb-0"
            placeholder="username"
            name="username"
            label="Username"
          />

          {signUpMode && (
            <CustomForm.InputField
              formControl={form.control}
              className="!mb-2"
              placeholder="phone"
              name="phone"
              label="Phone"
            />
          )}
          <CustomForm.InputField
            formControl={form.control}
            className="!mb-2"
            name="password"
            placeholder="password"
            label={
              <div className="flex justify-between items-center w-full">
                Password
                {!signUpMode && (
                  <a href="#"
                     className="text-sm float-right text-blue-600 hover:underline cursor-pointer">Forgot?</a>
                )}
              </div>
            }
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-xl cursor-pointer"
          >
             {loading && <Loader2Icon className="animate-spin mr-2" />}
            {signUpMode ? "Create account" : "Login"}
          </Button>
        </CustomForm>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
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
