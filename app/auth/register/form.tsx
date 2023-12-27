"use client";
import { useRouter } from "next/navigation";
import { GoogleLogo } from "@/components/auth/google-logo";
import { Checkbox } from "@/components/ui/checkbox";
import { InputBox } from "@/components/ui/input-box";
import { OrLine } from "@/components/ui/or-line";
import Spinner from "@/components/ui/spinner";
import {
  registerWithPassword,
  signInWithGoogle,
  signInWithPassword,
} from "@/lib/firebase/auth";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export const RegisterForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [errorIn, setErrorIn] = useState("");
  const [errorText, SetErrorText] = useState("");
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  return (
    <>
      <form
        className="flex flex-col gap-4 mb-8"
        onSubmit={async (e) => {
          e.preventDefault();
          setSubmitting(true);
          setErrorIn("");
          SetErrorText("");
          const form_data = new FormData(e.target as HTMLFormElement);
          await registerWithPassword(
            form_data.get("first-name"),
            form_data.get("last-name"),
            form_data.get("email"),
            form_data.get("password"),
            form_data.get("conform-password"),
            form_data.get("rules")
          ).then((i) => {
            if (i.error) {
              if (i.toast) toast.error(i.error);
              setErrorIn(i.in);
              SetErrorText(i.text);
              return setSubmitting(false);
            }
            toast.success("Login Successful! Welcome back!");
            router.push("/");
          });
        }}
      >
        <h2 className={`font-bold text-2xl pb-3`}>
          Enter your Email and Password to Log in.
        </h2>
        {errorIn === "all" && (
          <div className="text-destructive text-sm">{errorText}</div>
        )}

        <div className="grid xsm:grid-cols-2 gap-3">
          <InputBox
            title="First Name"
            name="first-name"
            errorText={errorText}
            inpError={errorIn}
            placeholder="Your First Name"
            autoComplete="given-name"
            disabled={submitting}
          />
          <InputBox
            title="Last Name"
            name="last-name"
            errorText={errorText}
            inpError={errorIn}
            placeholder="Your Last Name"
            autoComplete="family-name"
            disabled={submitting}
          />
        </div>

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
          autoComplete="new-password"
          inpError={errorIn}
          errorText={errorText}
          type={showPass ? "text" : "password"}
          disabled={submitting}
          subAction={
            <div
              onClick={() => setShowPass((i) => !i)}
              className="text-sm hover:underline"
            >
              {showPass ? "Hide" : "Show"}
            </div>
          }
        />
        <InputBox
          title="Conform Password"
          name="conform-password"
          placeholder="Re-enter Password"
          autoComplete="new-password"
          inpError={errorIn}
          errorText={errorText}
          type={showPass ? "text" : "password"}
          disabled={submitting}
        />
        <div>
          <div className="flex items-center space-x-2">
            <Checkbox name="rules" id="rules" disabled={submitting} />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="rules"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to Gisla rules and guidelines.
              </label>
            </div>
          </div>
          {errorIn === "rules" ? (
            <div className="text-sm text-destructive mt-2">{errorText}</div>
          ) : (
            <></>
          )}
        </div>
        <button
          className={`bg-bg-main-2  transition-colors text-white py-2 rounded-md flex justify-center  border-blue-300 focus:outline-blue-400 ${
            submitting ? "opacity-80" : "hover:bg-bg-main-2/90"
          }`}
          disabled={submitting}
        >
          {submitting ? <Spinner className="h-6 w-6" /> : "Sign up"}
        </button>
      </form>
      <OrLine />
      <button
        className={`flex gap-[10px] px-3 items-center justify-center w-full my-10 rounded-md border-gray-300 border-[1.5px]  transition-colors ${
          submitting ? "opacity-60 cursor-default" : "hover:bg-gray-100/70"
        }`}
        onClick={() => {
          !submitting &&
            signInWithGoogle().then((i) => {
              console.log(i.operationType);
              toast.success("Sign in with Google successful.", {});
              router.push("/");
            });
        }}
      >
        <GoogleLogo />
        Sign up with Google
      </button>

      <p className="text-sm text-center">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-sm text-bg-main-2">
          {" "}
          Login Here.
        </Link>
      </p>
    </>
  );
};
