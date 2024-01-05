"use client";

import { ResponseDone, ResponseError } from "@/lib/request";
import type { User } from "next-auth";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Spinner from "../ui/spinner";
import { BeforeDialog, ConformUploadDialog } from "./before-update";
import { SubmitState } from "./submit-client";

export enum FilePickerState {
  EMPTY,
  FILE_CONFORM,
  UPLOADING,
}

type Props = {
  user: User;
  file?: File;
  setFile: Dispatch<SetStateAction<File | undefined>>;
  draft_url?: string;
  setDaftUrl: Dispatch<SetStateAction<string>>;
  edit: boolean;
  setPageState: Dispatch<SetStateAction<SubmitState>>;
  draft_id?: string;
  setDratId: Dispatch<SetStateAction<string>>;
};

export const FilePickerDialog = (props: Props) => {
  const [originalImgUrl, setOriginalImgUrl] = useState<string | undefined>();
  const [state, setState] = useState(FilePickerState.EMPTY);
  const abort_ref = useRef<AbortController>();
  const [dragging, setDragging] = useState(false);

  const uplaodImage = async (img: File) => {
    const t = toast.loading("Uploading file.", {
      cancelButtonStyle: { display: "none", visibility: "hidden" },
      dismissible: false,
      important: true,
      duration: 40000,
    });
    const form_data = new FormData();
    form_data.append("file", img);
    form_data.append("user", props.user.id);
    form_data.append("draft_id", props.draft_id ?? "");
    const req = await fetch("/api/submit/draft", {
      method: "POST",
      body: form_data,
    })
      .then((i) => i.json())
      .then((i) => {
        if (i.done) return ResponseDone(i.data);
        else return ResponseError(i.error_text);
      })
      .catch((i) => {
        return ResponseError(i.error_text);
      });

    toast.dismiss(t);

    if (req.done) {
      toast.success("Upload Done");
      console.log(req.data);
      props.setDaftUrl(req.data.url);
      props.setDratId(req.data.draft_id);
      props.setPageState(SubmitState.FORM);
    } else {
      console.log(req);
      toast.error(req.error_text ?? "Failed to uplaod.");
      setState(FilePickerState.FILE_CONFORM);
    }
  };

  useEffect(() => {
    setDragging(false);
    if (props.file instanceof File) {
      URL.revokeObjectURL(originalImgUrl ?? "");
      setOriginalImgUrl(URL.createObjectURL(props.file));
      setState(FilePickerState.FILE_CONFORM);
    }

    return () => URL.revokeObjectURL(originalImgUrl ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.file]);

  useEffect(() => {
    if (props.edit && props.file) {
      setOriginalImgUrl(URL.createObjectURL(props.file ?? new Blob()));
      setState(FilePickerState.FILE_CONFORM);
    } else setState(FilePickerState.EMPTY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (abort_ref.current) abort_ref.current.abort();
    if (state === FilePickerState.UPLOADING) {
      if (props.file) uplaodImage(props.file);
    }

    abort_ref.current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const CurrentDialog = () => {
    switch (state) {
      case FilePickerState.EMPTY:
        return <BeforeDialog dragging={dragging} />;

      case FilePickerState.FILE_CONFORM:
        return (
          <ConformUploadDialog img={originalImgUrl ?? ""} setState={setState} />
        );

      case FilePickerState.UPLOADING:
        return (
          <div className="flex flex-col justify-center items-center gap-2">
            <Spinner className="text-bg-main-2" />
            <span className="text-bg-main-2">Uploading File </span>
          </div>
        );
    }
  };

  return (
    <div className="flex justify-center">
      <label
        className="flex flex-col gap-2 justify-center items-center my-10 p-3 min-h-[300px] max-w-2xl w-full border-2 border-dashed rounded-lg bg-bg-main-2/10 border-bg-main-2/50 cursor-pointer"
        onDrop={(e) => {
          e.preventDefault();
          if (
            e.dataTransfer.files.length > 0 &&
            e.dataTransfer.files[0].type.startsWith("image/")
          )
            props.setFile(e.dataTransfer.files[0]);
          else
            toast.warning(
              "Unsupported file format submitted. Please upload a valid image."
            );
        }}
        onDragEnter={(e) => {
          if (e.dataTransfer.types.includes("Files")) {
            e.preventDefault();
            setDragging(true);
          }
        }}
        onDragOver={(e) => {
          if (e.dataTransfer.types.includes("Files")) {
            e.preventDefault();
          }
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          if (e.currentTarget != e.target) return;
          setDragging(false);
        }}
      >
        {state === FilePickerState.EMPTY ? (
          <input
            type="file"
            className="hidden"
            accept=".jpg,.jpeg,.png"
            multiple={false}
            onChange={(e) => {
              const _file = (
                (e.target as HTMLInputElement).files as FileList
              )[0];
              props.setFile(_file);
              setState(FilePickerState.FILE_CONFORM);
            }}
          />
        ) : (
          <></>
        )}
        <CurrentDialog />
      </label>
    </div>
  );
};
