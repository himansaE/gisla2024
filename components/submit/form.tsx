"use client";

import { font_poppins_one } from "@/lib/font";
import { Edit2Icon } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { Center } from "../ui/center";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { InputBox, TextAreaBox } from "../ui/input-box";
import Spinner from "../ui/spinner";
import { RulesText } from "./rules";
import { SubmitState } from "./submit-client";

type Props = {
  setEdit: Dispatch<SetStateAction<boolean>>;
  setPageState: Dispatch<SetStateAction<SubmitState>>;
  draft_img_url?: string;
  draft_id?: string;
  file?: File;
};
export const SubmitForm = (props: Props) => {
  const [is_submitting, setSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [show_terms_dialog, showTermsDialog] = useState(false);
  const [error, setError] = useState("");
  const [error_in, setErrorIn] = useState("");
  const [show_change_warning, setChangeWarning] = useState(false);

  const changeImage = () => {
    props.setEdit(true);
    props.setPageState(SubmitState.IMAGE);
  };
  return (
    <div className={`${font_poppins_one.className} lg:grid grid-cols-2 gap-4`}>
      <div className="px-4 lg:px-4 py-4 flex min-h-min lg:[min-height:calc(100vh_-_6.25rem)] lg:max-h-[calc(max(500px,100vh))] justify-center items-center">
        <div className="flex h-full flex-col my-5 lg:my-0 items-center justify-center">
          <div className="flex justify-end text-sm w-full">
            <button
              className="flex items-center hover:underline focus:underline my-1 pr-2"
              onClick={() => {
                if (!props.file) return setChangeWarning(true);
                changeImage();
              }}
            >
              <Edit2Icon className="h-3" /> Change Image
            </button>
            <ChangeImageWarningDialog
              show={show_change_warning}
              setShow={setChangeWarning}
              changeImage={changeImage}
            />
          </div>
          <Image
            className="rounded-lg bg-bg-main-2/10"
            unoptimized
            src={props.draft_img_url ?? ""}
            alt="image"
            height={500}
            width={500}
          />
        </div>
      </div>
      <Center maxWidth="600px" className="px-0 lg:px-6">
        <h2 className={`font-bold text-2xl mt-2 lg:mt-20 mb-6`}>
          Enter Detailed Information About Your Artwork.
        </h2>
        <div
          className={`font-normal flex flex-col gap-5  ${
            is_submitting ? "opacity-85" : ""
          }`}
        >
          <InputBox
            title="Artwork Title"
            name="title"
            disabled={is_submitting}
            placeholder="Give a title for your artwork"
            inpError={error_in}
            errorText={error}
          />
          <InputBox
            title="Description about Artwork"
            name="title"
            disabled={is_submitting}
            placeholder="Give a short Description for your artwork"
            inpError={error_in}
            errorText={error}
          />
          <TextAreaBox
            title="Prompt"
            name="prompt"
            disabled={is_submitting}
            placeholder="Give the prompt used generating artwork."
            errorText={error}
            inpError={error_in}
            className="max-h-96"
          />
          <InputBox
            title="Generated using"
            name="prompt"
            disabled={is_submitting}
            placeholder="AI used to generate this artwork."
            errorText={error}
            inpError={error_in}
          />

          <div>
            <div className="flex flex-row gap-2 items-top px-2">
              <Checkbox
                id="terms1"
                name="remember-me"
                checked={agreed}
                className="mt-1"
                onClick={() => {
                  if (agreed) return setAgreed(false);
                  showTermsDialog(true);
                }}
              />
              <div className="grid gap-1.5 leading-none ">
                <label
                  htmlFor="terms1"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  onClick={() => {
                    if (agreed) return setAgreed(false);
                    showTermsDialog(true);
                  }}
                >
                  I Agree to GISLA 2024 Terms
                </label>
                <p className="text-xs text-muted-foreground">
                  By checking this box, I acknowledge that I have read and agree
                  to the terms and conditions of the GISLA 2024 AI Art
                  Competition.
                </p>
                {error_in === "rules" ? (
                  <div className="text-sm text-destructive ">{error}</div>
                ) : (
                  <></>
                )}
                <TermsDialog
                  agreed={agreed}
                  setAgreed={setAgreed}
                  setShow={showTermsDialog}
                  show={show_terms_dialog}
                />
              </div>
            </div>
          </div>
          <Button
            disabled={is_submitting}
            onClick={() => {
              if (is_submitting) return;
              setSubmitting(true);
            }}
            className="gap-3"
          >
            {is_submitting ? <Spinner /> : <></>}Submit Artwork
          </Button>
        </div>
      </Center>
    </div>
  );
};

const TermsDialog = (props: {
  agreed: boolean;
  setAgreed: Dispatch<SetStateAction<boolean>>;
  setShow: Dispatch<SetStateAction<boolean>>;
  show: boolean;
}) => {
  return (
    <Dialog open={props.show} onOpenChange={(open) => props.setShow(false)}>
      <DialogContent
        className={`${font_poppins_one.className} max-h-screen overflow-y-auto md:max-w-2xl  lg:max-w-4xl `}
        style={{ maxHeight: "100dvh" }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Agree to GISLA 2024 Terms.
          </DialogTitle>
          <DialogDescription>
            Please take a moment to read and understand the rules and
            regulations for the GISLA 2024 AI Art Competition as your
            participation implies your agreement to follow them.
          </DialogDescription>
        </DialogHeader>
        <div className="flex">
          <RulesText />
        </div>
        <DialogFooter className="gap-y-4 gap-x-3">
          <Button variant="secondary" onClick={() => props.setShow(false)}>
            Close
          </Button>
          <Button
            onClick={() => {
              props.setShow(false);
              props.setAgreed(true);
            }}
          >
            I Agree
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ChangeImageWarningDialog = (props: {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  changeImage: () => void;
}) => {
  return (
    <Dialog open={props.show} onOpenChange={(open) => props.setShow(false)}>
      <DialogContent
        className={`${font_poppins_one.className} max-h-screen overflow-y-auto `}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Waring</DialogTitle>
          <DialogDescription>
            Image from Previous Draft Loaded.
          </DialogDescription>
        </DialogHeader>
        <div className="flex text-slate-600">
          Changing the Image Will Result in Loss of Current Draft. You can Undo
          it by Refreshing the Page.
        </div>
        <DialogFooter className="gap-y-4 gap-x-3">
          <Button variant="secondary" onClick={() => props.setShow(false)}>
            Close
          </Button>
          <Button
            onClick={() => {
              props.setShow(false);
              props.changeImage();
            }}
          >
            Change
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
