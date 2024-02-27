"use client";

import { useEffect } from "react";

export default function Page() {
  const getData = async () => {
    const data = await fetch("/api/judge/timout", {
      method: "post",
      credentials: "include",
    });
    console.log(data.text());
  };
  useEffect(() => {
    getData();
  }, []);

  return <></>;
}
