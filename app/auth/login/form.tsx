"use client";
import { GoogleLogo } from "@/components/auth/google-logo";
import { Checkbox } from "@/components/ui/checkbox";
import { InputBox } from "@/components/ui/input-box";
import { OrLine } from "@/components/ui/or-line";
import Spinner from "@/components/ui/spinner";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const local_validate = (
  email: FormDataEntryValue | null,
  password: FormDataEntryValue | null
) => {
  if (
    !(
      typeof email === "string" &&
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    )
  )
    return ["Enter valid Email address.", "email"];
  if (!(typeof password === "string" && password.length >= 8))
    return [
      "Invalid password. Please check your password and try again",
      "password",
    ];
  return { email, password };
};

export const LoginForm = (props: {
  error_text?: string;
  error_in?: string;
  app_stage?: string;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [is_oauth_submit, setIsOauthSubmit] = useState(false);
  const [errorIn, setErrorIn] = useState(props.error_in ?? "");
  const [errorText, SetErrorText] = useState(props.error_text ?? "");

  return (
    <>
      <form
        className="flex flex-col gap-4 mb-10"
        onSubmit={async (e) => {
          e.preventDefault();
          setSubmitting(true);
          setErrorIn("");
          SetErrorText("");
          const form_data = new FormData(e.target as HTMLFormElement);
          const validated = local_validate(
            form_data.get("email"),
            form_data.get("password")
          );
          if (Array.isArray(validated)) {
            SetErrorText(validated[0]);
            setErrorIn(validated[1]);
            return setSubmitting(false);
          }
          await signIn("Credentials", {
            email: form_data.get("email"),
            password: form_data.get("password"),
            type: "signin",
            redirect: true,
            callbackUrl: "/auth/login",
          })
            .then((i) => console.log(i))
            .catch((i) => console.error(i))
            .finally(() => setSubmitting(false));
        }}
      >
        <h2 className={`font-bold text-2xl pb-3`}>
          Enter your Email and Password to Log in.
        </h2>
        {errorIn === "all" && (
          <div className="text-destructive text-sm">{errorText}</div>
        )}
        <InputBox
          title="Email"
          name="email"
          errorText={errorText}
          inpError={errorIn}
          placeholder="Your Email Address"
          autoComplete="email"
          disabled={submitting}
        />

        <InputBox
          title="Password"
          name="password"
          placeholder="Password"
          autoComplete="password"
          inpError={errorIn}
          errorText={errorText}
          type="password"
          subAction={
            <Link
              href="/auth/forget"
              className="font-light text-sm underline focus:outline-bg-main-2"
            >
              Forget Password
            </Link>
          }
          disabled={submitting}
        />
        <div className="flex items-center space-x-2">
          <Checkbox id="terms1" name="remember-me" disabled={submitting} />

          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms1"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember Me
            </label>
          </div>
        </div>
        <button
          className={`bg-bg-main-2  transition-colors text-white py-2 rounded-md flex justify-center  border-blue-300 focus:outline-blue-400 ${
            submitting ? "opacity-80" : "hover:bg-bg-main-2/90"
          }`}
          disabled={submitting}
        >
          {submitting && !is_oauth_submit ? (
            <Spinner className="h-6 w-6" />
          ) : (
            "Login"
          )}
        </button>
      </form>
      <OrLine />
      <button
        className={`flex gap-[10px] px-3 items-center justify-center w-full my-10 rounded-md border-gray-300 border-[1.5px]  transition-colors ${
          submitting ? "opacity-60 cursor-default" : "hover:bg-gray-100/70"
        }`}
        onClick={async () => {
          if (submitting) return;

          setIsOauthSubmit(true);
          setSubmitting(true);
          await signIn("google");
        }}
      >
        <GoogleLogo />
        Sign in with Google
      </button>

      <p className="text-sm text-center">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-sm text-bg-main-2">
          {" "}
          Register Here.
        </Link>
      </p>
    </>
  );
};
