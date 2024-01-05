"use client";
import { User } from "next-auth";
import { useState } from "react";
import { SubmitForm } from "./form";
import { FilePickerDialog } from "./upload-box";

export enum SubmitState {
  IMAGE,
  FORM,
}

type Props = { user: User; draft_id?: string; img_url?: string };

export const SubmitClient = (props: Props) => {
  const [page_state, setPageState] = useState(
    props.draft_id ? SubmitState.FORM : SubmitState.IMAGE
  );
  const [draft_img_url, setDraftImgUrl] = useState(props.img_url ?? "");
  const [file, setFile] = useState<File>();
  const [edit, setEdit] = useState(false);
  const [draft_id, setDraftId] = useState(props.draft_id ?? "");

  if (page_state === SubmitState.IMAGE)
    return (
      <FilePickerDialog
        user={props.user}
        file={file}
        setFile={setFile}
        setDaftUrl={setDraftImgUrl}
        edit={edit}
        setPageState={setPageState}
        setDratId={setDraftId}
      />
    );
  return (
    <SubmitForm
      setEdit={setEdit}
      setPageState={setPageState}
      draft_id={draft_id}
      draft_img_url={draft_img_url}
      file={file}
    />
  );
};
