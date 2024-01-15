"use client";

import { font_poppins_one } from "@/lib/font";
import { Copy, DownloadIcon, Edit2Icon, Share2 } from "lucide-react";
import { User } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { toast } from "sonner";
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

enum PageState {
  FORM,
  DONE,
}

type Props = {
  setEdit: Dispatch<SetStateAction<boolean>>;
  setPageState: Dispatch<SetStateAction<SubmitState>>;
  draft_img_url?: string;
  draft_id?: string;
  file?: File;
  user: User;
};
export const SubmitForm = (props: Props) => {
  const [is_submitting, setSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [show_terms_dialog, showTermsDialog] = useState(false);
  const [error, setError] = useState("");
  const [error_in, setErrorIn] = useState("");
  const [show_change_warning, setChangeWarning] = useState(false);
  const [state, setState] = useState(PageState.FORM);
  const [post_link, setPostLink] = useState<string>("");
  const [show_share_sheet, setShareSheet] = useState(false);
  const changeImage = () => {
    props.setEdit(true);
    props.setPageState(SubmitState.IMAGE);
  };
  return (
    <div className={`${font_poppins_one.className} lg:grid grid-cols-2 gap-4`}>
      <div className="px-4 lg:px-4 py-4 flex min-h-min lg:[min-height:calc(100vh_-_6.25rem)] lg:max-h-[calc(max(500px,100vh))] justify-center items-center">
        <div className="flex h-full flex-col my-5 lg:my-0 items-center justify-center">
          <div className="flex justify-end text-sm w-full">
            {state === PageState.FORM ? (
              <>
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
              </>
            ) : (
              <>
                <a
                  className="flex items-center hover:underline focus:underline my-1 pr-2"
                  download
                  target="_blank"
                  href={props.draft_img_url}
                >
                  <DownloadIcon className="h-3" /> Download Artwork
                </a>
              </>
            )}
          </div>

          <Image
            className="rounded-lg bg-bg-main-2/10 max-h-[500px] max-w-full object-contain"
            unoptimized
            src={props.draft_img_url ?? ""}
            alt="image"
            height={500}
            width={500}
          />
        </div>
      </div>
      <Center maxWidth="600px" className="px-0 lg:px-6">
        {state === PageState.FORM ? (
          <>
            <h2 className={`font-bold text-2xl mt-2 lg:mt-20 mb-6`}>
              Enter Detailed Information About Your Artwork.
            </h2>
            {error_in === "all" ? (
              <div className="text-sm text-destructive ">{error}</div>
            ) : (
              <></>
            )}
            <form
              className={`font-normal flex flex-col gap-5  ${
                is_submitting ? "opacity-85" : ""
              }`}
              onSubmit={async (e) => {
                e.preventDefault();
                if (is_submitting) return;
                setSubmitting(true);
                setErrorIn("");
                setError("");
                const form_data = new FormData(e.currentTarget);
                const val = local_validate(form_data);
                if (val != null) {
                  setError(val[0]);
                  return setErrorIn(val[1]);
                }
                if (!agreed) {
                  setError(
                    "you must agree to the terms and conditions before submitting."
                  );
                  return setErrorIn("terms");
                }
                const res = await fetch("/api/submit", {
                  method: "POST",
                  body: JSON.stringify({
                    title: form_data.get("title"),
                    des: form_data.get("des"),
                    prompt: form_data.get("prompt"),
                    used: form_data.get("ai-used"),
                    draft: props.draft_id,
                    user: props.user.id,
                  }),
                })
                  .then((i) => i.json())
                  .then((i) => {
                    if (i.done) {
                      toast.success("Submission successful.");
                      setState(PageState.DONE);
                      setPostLink(
                        `https://gisla2024.vercel.app/artwork/${i.data.id}`
                      );
                    } else {
                      setError(i.error_text);
                      setErrorIn("all");
                      setSubmitting(false);
                    }
                  })
                  .catch((e) => {
                    console.log(e);
                    setError(
                      "Sorry, a network error occurred. Please check your internet connection and try again."
                    );
                    setErrorIn("all");
                    setSubmitting(false);
                    toast.error(
                      "Sorry, a network error occurred. Please check your internet connection and try again."
                    );
                  });
              }}
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
                name="des"
                disabled={is_submitting}
                placeholder="Give a short Description for your artwork"
                inpError={error_in}
                errorText={error}
              />
              <TextAreaBox
                title="Prompt (Only Visible to you)"
                name="prompt"
                disabled={is_submitting}
                placeholder="Give the prompt used generating artwork."
                errorText={error}
                inpError={error_in}
                className="max-h-96"
              />
              <InputBox
                title="Generated using"
                name="ai-used"
                disabled={is_submitting}
                placeholder="AI used to generate this artwork."
                errorText={error}
                inpError={error_in}
              />

              <div>
                <div className="flex flex-row gap-2 items-top px-2">
                  <Checkbox
                    id="terms1"
                    name="terms"
                    checked={agreed}
                    disabled={is_submitting}
                    className="mt-1"
                    onClick={() => {
                      if (is_submitting) return;
                      if (agreed) return setAgreed(false);
                      showTermsDialog(true);
                    }}
                  />
                  <div className="grid gap-1.5 leading-none ">
                    <label
                      htmlFor="terms1"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        if (agreed) return setAgreed(false);
                        showTermsDialog(true);
                      }}
                    >
                      I Agree to GISLA 2024 Terms
                    </label>
                    <p className="text-xs text-muted-foreground">
                      By checking this box, I acknowledge that I have read and
                      agree to the terms and conditions of the GISLA 2024 AI Art
                      Competition.
                    </p>
                    {error_in === "terms" ? (
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
              <Button disabled={is_submitting} className="gap-3">
                {is_submitting ? <Spinner /> : <></>}Submit Artwork
              </Button>
            </form>
          </>
        ) : (
          <>
            <h2 className={`font-bold text-2xl mt-2 lg:mt-20 mb-6`}>
              Your Artwork has been Successfully Submitted.
            </h2>
            <div className="flex gap-2 flex-col">
              <InputBox
                className="!cursor-default"
                title="Artwork URL"
                disabled
                placeholder="Image Link"
                errorText=""
                inpError=""
                itemRef=""
                id="copy_link"
                value={post_link}
                subAction={
                  <button
                    className="cursor-pointer hover:underline px-1 flex items-center pr-2"
                    onClick={async (e) => {
                      const copy_link_ref = document.getElementById(
                        "copy_link"
                      ) as HTMLInputElement;
                      if (copy_link_ref) {
                        if (navigator.clipboard) {
                          await navigator.clipboard.writeText(
                            String(post_link)
                          );
                          toast.success("Link coped successfully.");
                        } else {
                          copy_link_ref.select();
                          const copy = document?.execCommand("copy");
                          if (copy) toast.success("Link coped successfully.");
                          else toast.warning("Link copy unsuccessful.");
                        }
                      }
                    }}
                  >
                    <Copy className="h-3" /> Copy Link
                  </button>
                }
              />
              <div className="flex flex-col gap-2">
                <Button onClick={() => setShareSheet(true)}>Share</Button>
                <Link
                  href={`https://gisla2024.vercel.app/artwork/${props.draft_id}`}
                  className="text-sm flex justify-center py-2 bg-bg-main-2/10 rounded-md   hover:bg-bg-main-2/20 transition-colors"
                >
                  View Artwork
                </Link>
              </div>
              <ShareSheet
                url={props.draft_img_url}
                setShow={setShareSheet}
                show={show_share_sheet}
              />
            </div>
            <div className="py-10">
              <h2 className="mb-2 text-lg font-semibold">
                What&apos;s Next...
              </h2>
              <ul className="space-y-1 list-disc list-outside text-gray-800 text-sm">
                <li className="list-item list-outside lis">
                  Click the share button and share your artwork on Facebook and
                  Instagram.
                </li>
                <li className="list-item list-outside lis">
                  Or you can make your post by including{" "}
                  <span className="bg-bg-main-2/10 px-1 rounded-sm">
                    #IEEEGISLA{" "}
                  </span>
                  ,{" "}
                  <span className="bg-bg-main-2/10 px-1 rounded-sm">
                    {" "}
                    #GISLA2024
                  </span>{" "}
                  and{" "}
                  <span className="bg-bg-main-2/10 px-1 rounded-sm">
                    {" "}
                    #SLTCIEEE
                  </span>{" "}
                  hashtags and share.
                </li>
                <li>
                  Increase votes by earning likes from your network. Only
                  Facebook and Instagram likes count as votes. Fake votes are
                  not permitted. Best of Luck!
                </li>
              </ul>
            </div>
          </>
        )}
      </Center>
    </div>
  );
};

const local_validate = (data: FormData) => {
  const arr = Array.from(data);
  for (const i of arr) {
    if (i[1].toString().trim() == "") return ["This field is required.", i[0]];
  }
  return null;
};

const ShareSheet = (props: {
  setShow: Dispatch<SetStateAction<boolean>>;
  show: boolean;
  url?: string;
}) => {
  return (
    <Dialog open={props.show} onOpenChange={(open) => props.setShow(false)}>
      <DialogContent
        className={`${font_poppins_one.className} max-h-screen overflow-y-auto md:max-w-lg  `}
        style={{ maxHeight: "100dvh" }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Share your Artwork.</DialogTitle>
          <DialogDescription>
            Share your artwork on Facebook, Instagram.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap px-3 xsm:px-6 py-10 gap-x-6 gap-y-6 justify-center">
          <ShareItem
            onClick={async () => {
              if (!navigator.share) {
                toast.warning(
                  "Share Feature not available in our browser. Try update your browser or Use another sharing method."
                );
                return;
              }
              if (!props.url) {
                toast.warning("Something went wrong. Try refresh.");
                return;
              }
              const data: ShareData = {
                title: "Share file",
              };

              let res: Blob;
              try {
                res = await fetch(props.url, { mode: "no-cors" }).then((i) =>
                  i.blob()
                );
              } catch (e) {
                toast.warning("Can't load the Artwork. Try again.");
                return;
              }
              data.files = [
                new File([res], props.url.split("/").pop() ?? "file.jpg", {
                  type: "image/jpeg",
                }),
              ];
              console.log(data);
              const can = navigator.canShare(data);
              if (!can) {
                toast.warning(
                  "Share Feature not available in our browser. Try update your browser or Use another sharing method."
                );
                return;
              }
              try {
                await navigator.share(data);
              } catch {
                toast.error(
                  "Share Feature not available in our browser. Try update your browser or Use another sharing method."
                );
              }
            }}
            text="Share"
          >
            <Share2 height="1.2em" />
          </ShareItem>
        </div>
        <DialogFooter className="gap-y-4 gap-x-3">
          <Button
            onClick={() => {
              props.setShow(false);
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ShareItem = (props: {
  text: string;
  children: ReactNode;
  onClick: () => Promise<void>;
}) => {
  return (
    <div className="w-16 sm:w-20 flex justify-center">
      <button
        className="flex flex-col items-center gap-1 cursor-pointer hover:underline"
        onClick={() => props.onClick()}
      >
        <div className="h-10 w-10 flex justify-center items-center bg-[#d0e0df] rounded-full">
          {props.children}
        </div>
        <div className="text-sm">{props.text}</div>
      </button>
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
