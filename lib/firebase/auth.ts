import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  browserLocalPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
  signInWithRedirect,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import type { NextOrObserver, User, UserCredential } from "firebase/auth";
import { auth } from "./firebase";

type AuthError = {
  error: true;
  in: string;
  text: string;
  toast?: boolean;
};

type AuthDone = {
  error: false;
  user: UserCredential;
};

const authError = (
  text: string,
  error_in?: string,
  toast?: boolean
): AuthError => ({
  error: true,
  in: error_in ?? "all",
  toast: toast,
  text: text,
});
type AuthResponse = AuthDone | AuthError;

const firebaseAuthCommonErrors = async (
  error: string,
  provider?: string,
  email?: string
) => {
  switch (error) {
    case "auth/email-already-in-use":
      return authError(
        "Provided email is already in use. Please use a different email address or consider resetting your password if you forgot it.",
        "email"
      );
    case "auth/user-not-found":
      return authError(
        "User not found. Please check your credentials or sign up for an account.",
        "all",
        true
      );
    case "auth/invalid-credential":
      return authError(
        "Please check your Email and Password or sign up for an account.",
        "all",
        true
      );

    case "auth/wrong-password":
      return authError(
        "Incorrect password. Please double-check your password.",
        "password",
        true
      );

    case "auth/invalid-email":
      return authError(
        "Invalid email address. Please enter a valid email.",
        "email",
        true
      );

    default:
      return authError(
        "Something went wrong. Please try again later or contact support if the issue persists.",
        "all",
        true
      );
  }
};

export function onAuthStateChanged(cb: NextOrObserver<User>) {
  return _onAuthStateChanged(auth, cb);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/userinfo.email");
  provider.addScope("https://www.googleapis.com/auth/userinfo.profile");
  await auth.setPersistence(browserLocalPersistence);
  return await signInWithPopup(auth, provider).catch(async (i) => {
    console.log(i);
    return await signInWithRedirect(auth, provider);
  });
}

export async function registerWithPassword(
  fname: FormDataEntryValue | null,
  lname: FormDataEntryValue | null,
  email: FormDataEntryValue | null,
  pass: FormDataEntryValue | null,
  conf_pass: FormDataEntryValue | null,
  rules: FormDataEntryValue | null,
  provider?: string
): Promise<AuthResponse> {
  if (typeof fname !== "string" || fname.trim() === "")
    return authError("Enter valid first name.", "first-name");

  if (typeof lname !== "string" || lname.trim() === "")
    return authError("Enter valid last name.", "last-name");

  if (
    typeof email !== "string" ||
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
  )
    return authError(
      "Invalid email. Please enter a valid email address.",
      "email"
    );
  if (typeof pass !== "string" || pass.length < 8)
    return authError(
      "Invalid password. Please enter a password with at least eight characters.",
      "password"
    );
  if (typeof conf_pass !== "string" || pass != conf_pass)
    return authError(
      "Passwords do not match. Please ensure that the 'Password' and 'Confirm Password' fields contain the same values.",
      "conform-password"
    );

  if (typeof rules !== "string" || rules != "on")
    return authError(
      "Please make sure to agree to Gisla rules and guidelines before proceeding.",
      "rules"
    );

  return await createUserWithEmailAndPassword(auth, email, pass)
    .then(
      (i): AuthDone => ({
        error: false,
        user: i,
      })
    )
    .catch(async (i) => {
      return firebaseAuthCommonErrors(i.code, provider, email);
    });
}

export async function signInWithPassword(
  email: FormDataEntryValue | null,
  password?: FormDataEntryValue | null,
  remember?: boolean,
  provider?: string
): Promise<AuthResponse> {
  await auth.setPersistence(
    remember ? browserLocalPersistence : browserSessionPersistence
  );
  if (typeof email !== "string" || typeof password !== "string")
    return authError(
      "Something went wrong. Please try again later or contact support if the issue persists.",
      "all",
      true
    );

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
    return authError(
      "Invalid email. Please enter a valid email address.",
      "email"
    );

  if (password.length < 8)
    return authError(
      "Invalid password. Please enter a password with at least eight characters.",
      "password"
    );

  return await signInWithEmailAndPassword(auth, email, password)
    .then((i): AuthDone => {
      return { error: false, user: i };
    })
    .catch(async (i): Promise<AuthError> => {
      return await firebaseAuthCommonErrors(i.code, provider, email);
    });
}

export async function signOut() {
  try {
    auth.signOut();
  } catch (error) {
    console.error("Error signing out ", error);
  }
}

export async function getServerSession() {
  // dynamically import to prevent import errors in pages router
  const { cookies } = await import("next/headers");

  try {
    return cookies().get("__session")?.value;
  } catch (error) {
    //   // call from client side
    //   return undefined;
  }
}
