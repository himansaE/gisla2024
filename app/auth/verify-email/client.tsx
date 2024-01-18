"use client";

import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const ResendButton = (props: { email: string; id: string }) => {
  const [submitting, setSubmit] = useState(false);
  const [error, setError] = useState<undefined | string>();
  const router = useRouter();
  return (
    <div>
      <p className="text-destructive text-sm">{error}</p>
      <Button
        className="gap-2 disabled:opacity-70 mt-2"
        onClick={async () => {
          setSubmit(true);
          setError(undefined);
          const msg = toast.loading("Sending validation Email.");
          const body = JSON.stringify({
            email: props.email,
            user: props.id,
          });
          await fetch("/api/validation/send-validation-email", {
            body: body,
            method: "post",
          })
            .then((i) => i.json())
            .then((i) => {
              if (i.done === true) {
                toast.dismiss(msg);
                toast.success("verification link sent to your inbox.");
              } else {
                if (i.error == "refresh") {
                  router.push("/");
                }
                toast.dismiss(msg);
                toast.error(i.error_text);
                setError(i.error_text);
              }
            })
            .catch((e) => {
              console.error(e);
              toast.dismiss(msg);
              toast.error("Network Error happened. Try again.");
              setError("Network Error happened. Try again.");
            });
          setSubmit(false);
        }}
        disabled={submitting}
      >
        {submitting && <Spinner />}{" "}
        {submitting ? "Sending Link" : "Resend Link"}
      </Button>
    </div>
  );
};
