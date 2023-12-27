"use client";
import { auth } from "@/lib/firebase/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignOutPage() {
  const router = useRouter();
  useEffect(() => {
    signOut(auth).then((i) => router.replace("/auth/login"));
  }, []);
  return (
    <>
    </>
  );
}
