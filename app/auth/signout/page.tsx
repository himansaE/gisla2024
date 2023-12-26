"use client";
import { auth } from "@/lib/firebase/firebase";
import { signOut } from "firebase/auth";

export default function SignOutPage() {
  return (
    <button
      className="px-3 py-2 bg-bg-main-2 text-white m-20 rounded-md "
      onClick={() => signOut(auth)}
    >
      Sign Out
    </button>
  );
}
