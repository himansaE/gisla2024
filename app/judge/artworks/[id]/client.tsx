"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const JudgeForm = (props: { id: string; token: string }) => {
  const ref = useRef(null);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<
    { in: string; text: string } | undefined
  >(undefined);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors(undefined);

    const [error, data] = validate(new FormData(e.currentTarget));
    if (error) {
      setErrors({ in: data.error, text: data.text });
    }
    // send to server

    try {
      const req = await fetch("/api/judge/artwork", {
        method: "POST",
        body: JSON.stringify({
          vote: data,
          post: props.id,
          token: props.token,
        }),
      }).then((i) => i.json());
      if (req.done == false) {
        setErrors({ in: req.error, text: req.error_text });
        setSubmitting(false);
      } else {
        setErrors(undefined);
        router.replace("/judge/artworks");
      }
    } catch (e) {
      setErrors({
        in: "all",
        text: "Can't connect to the internet. Retry again.",
      });
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (errors == undefined) return;
    let elem;
    if (errors.in == "all") elem = document.getElementById("error");
    else elem = document.getElementsByName(errors.in)[0];
    if (elem == null) return;
    if (typeof (elem as any).scrollIntoViewIfNeeded === "function")
      (elem as any).scrollIntoViewIfNeeded();
    else elem.scrollIntoView();
  }, [errors]);

  return (
    <>
      <form ref={ref} onSubmit={onSubmit}>
        <div id="error" className="text-destructive">
          {errors?.in === "all" && errors.text}
        </div>
        {mark_inputs.map((i) => (
          <InputBox
            key={i[0]}
            name={i[0]}
            des={i[2]}
            title={i[1]}
            disabled={submitting}
            error={errors?.in === i[0]}
            errorText={errors?.text}
          />
        ))}
        <Button className="gap-3" disabled={submitting}>
          {submitting && <Spinner />}Vote Now
        </Button>
      </form>
    </>
  );
};

const validate = (
  f: FormData
):
  | [true, { error: string; text: string }]
  | [
      false,
      {
        [key: string]: number;
      }
    ] => {
  const data: { [key: string]: number } = {};
  for (const i of mark_inputs) {
    let val = f.get(i[0]);
    if (typeof val != "string") return [true, { error: i[0], text: "" }];

    try {
      data[i[0]] = parseFloat(val);
      if (data[i[0]] < 0 || data[i[0]] > 10) {
        return [true, { error: i[0], text: "vote should between 1-10" }];
      }
    } catch (e) {
      return [
        true,
        { error: i[0], text: "vote should floating-point numbers " },
      ];
    }
  }
  return [false, data];
};

const mark_inputs = [
  [
    "relevance",
    "Relevance to Theme (Global call for climate action)",
    "How well does the artwork align with the theme of addressing climate change and promoting environmental awareness?",
  ],
  [
    "creativity",
    "Creativity and Originality",
    "Evaluate the uniqueness and innovative aspects of the artwork. Consider whether it brings a fresh perspective or approach to the theme.",
  ],
  [
    "artistic",
    "Artistic Expression",
    "Assess the effectiveness of conveying the intended message through artistic elements, such as composition, color, and symbolism.",
  ],
  [
    "clarity",
    "Conceptual Clarity",
    "How clearly does the artwork communicate its intended message related to climate action? Judges should be able to understand the artist's perspective.",
  ],
  [
    "impact",
    "Emotional Impact",
    "Consider the emotional response evoked by the artwork. Does it inspire, provoke thought, or create a strong emotional connection with the audience?",
  ],
  [
    "technical",
    "Technical Proficiency",
    "Even though participants don't need graphic design skills, evaluate the technical execution within the constraints of the chosen method (e.g., Copilot-generated art). This includes coherence, consistency, and attention to detail.",
  ],
  [
    "diversity",
    "Inclusivity and Diversity",
    "Encourage submissions that embrace diverse perspectives and voices. Consider how the artwork reflects a global understanding of climate change and the call to action.",
  ],
  [
    "accessibility",
    "Accessibility",
    "Ensure that the artworks are accessible to a broad audience, considering factors like clarity, simplicity, and the ability to convey the message effectively.",
  ],
  [
    "content",
    "Prominent Use of Copilot-generated Content",
    "Recognize submissions that effectively utilize Copilot-generated content in creating meaningful and impactful artworks.",
  ],
  [
    "completeness",
    "Completeness",
    "Evaluate the overall presentation, including the completeness of the submission, adherence to guidelines, and the quality of the description provided by the artist.",
  ],
];

const InputBox = (props: {
  name: string;
  title: string;
  des: string;
  disabled: boolean;
  error: boolean;
  errorText?: string;
}) => (
  <div className="my-4">
    <div className="flex gap-2 items-center">
      <div className={`${props.error ? "text-destructive" : ""}`}>
        {props.title}
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <HelpCircle className="text-gray-700 " size="1em" />
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs max-w-md bg-black/80 text-white shadow-md  px-3 py-1.5 rounded-sm">
              {props.des}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <Input
      placeholder="vote"
      type="number"
      min={0}
      max={10}
      name={props.name}
      step="0.1"
      disabled={props.disabled}
      className={
        props.error
          ? "text-destructive ring-destructive border-destructive"
          : ""
      }
      required
    />
    <div className="text-destructive  text-xs">
      {props.error && props.errorText}
    </div>
  </div>
);

export const OnlineIndicator = (props: { submitting: boolean; id: string }) => {
  const toaster = useRef(null);
  const [online, setOnline] = useState(true);
  const revalidate = async (submitting: boolean) => {
    if (submitting) return;
    setOnline(
      await fetch("/api/judge/artwork/timeout", {
        method: "POST",
        credentials: "include",
      })
        .then((i) => i.json())
        .then((i) => i.done == true)
        .catch((i) => false)
    );
  };

  useEffect(() => {
    if (!online)
      toast.warning("You are offline", {
        duration: 10000,
      });
    else toast.warning("not", { duration: 4000 });
  }, [online]);
  useEffect(() => {
    const interval = setInterval(() => revalidate(props.submitting), 5000);
    return () => clearInterval(interval);
  }, [props.submitting]);
  return (
    <div className="sticky z-10 lg:static top-[4.5rem] lg:z-50 flex justify-center mt-5">
      <div
        className={`lg:fixed top-4 right-6 z-50 flex items-center text-sm ${
          online ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        } px-3 py-1.5 rounded-md gap-2`}
      >
        <span className="relative flex h-3 w-3 justify-center items-center">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full   ${
              online ? "bg-green-600" : "bg-red-600"
            }`}
          ></span>
          <span
            className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              online ? "bg-green-600" : "bg-red-600"
            }`}
          ></span>
        </span>
        {online ? "You are Online" : "You are Offline"}
      </div>
    </div>
  );
};
