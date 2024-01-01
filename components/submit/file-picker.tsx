"use client";

import { showFilePicker } from "@/components/submit/file-picker-dialog";
import { ResponseDone, ResponseError } from "@/lib/request";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BeforeDialog, ConformUploadDialog } from "./before-update";

export enum FilePickerState {
  EMPTY,
  FILE_CONFORM,
  UPLOADING,
}

export const FilePickerDialog = () => {
  const [file, setFile] = useState<File>();
  const [originalImgUrl, setOriginalImgUrl] = useState<string | undefined>();
  const [state, setState] = useState(FilePickerState.EMPTY);
  const router = useRouter();
  const abort_ref = useRef<AbortController>();
  const uplaodImage = async (img: File) => {
    const t = toast.loading("Uploading file.", {
      cancelButtonStyle: { display: "none", visibility: "hidden" },
      dismissible: false,
    });
    const form_data = new FormData();
    form_data.append("file", img);
    const req = await fetch("/api/submit/image", {
      method: "POST",
      body: form_data,
    })
      .then((i) => i.json())
      .then((i) => {
        console.log(i.data);
        if (i.done) return ResponseDone(i.data);
        else return ResponseError(i.error_text);
      })
      .catch((i) => {
        return ResponseError(i.error_text);
      });

    toast.dismiss(t);

    if (req.done) {
      toast.success("Upload Done");
      // router.refresh();
    } else {
      toast.error("Failed to uplaod.", {});
      setState(FilePickerState.FILE_CONFORM);
    }
  };

  useEffect(() => {
    if (file instanceof File) {
      URL.revokeObjectURL(originalImgUrl ?? "");
      setOriginalImgUrl(URL.createObjectURL(file));
      setState(FilePickerState.FILE_CONFORM);
    }

    return () => URL.revokeObjectURL(originalImgUrl ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  useEffect(() => {
    if (abort_ref.current) abort_ref.current.abort();
    if (state === FilePickerState.UPLOADING) {
      // do the image uploading
      if (file) uplaodImage(file);
    }

    abort_ref.current;
  }, [state]);

  const CurrentDialog = () => {
    switch (state) {
      case FilePickerState.EMPTY:
        return <BeforeDialog />;

      case FilePickerState.FILE_CONFORM:
        return (
          <ConformUploadDialog img={originalImgUrl ?? ""} setState={setState} />
        );
    }
  };

  return (
    <div className="flex justify-center select-none">
      <div
        className="flex flex-col gap-2 justify-center items-center my-10 p-3 min-h-[300px] max-w-2xl w-full border-2 border-dashed rounded-lg bg-bg-main-2/10 border-bg-main-2/50 cursor-pointer"
        onClick={async () => {
          if (state === FilePickerState.EMPTY)
            setFile(
              (
                await showFilePicker({
                  multiple: false,
                  accept: ".jpg,.jpeg,.png",
                })
              )[0]
            );
        }}
      >
        <CurrentDialog />
      </div>
    </div>
  );
};
