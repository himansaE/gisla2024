import { UploadCloud } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { font_poppins_one } from "@/lib/font";
import { Dispatch, SetStateAction, useState } from "react";
import { FilePickerState } from "./upload-box";

export const BeforeDialog = (props: { dragging: boolean }) => {
  return (
    <>
      <UploadCloud size={50} className="text-bg-main-2 animate" />
      <p className="text-bg-main-2" draggable>
        {props.dragging ? "Drop here" : "Drag file or click to open file"}
      </p>
    </>
  );
};

export const ConformUploadDialog = (props: {
  img: string;
  setState: Dispatch<SetStateAction<FilePickerState>>;
}) => {
  const [is_open, setIsOpen] = useState(true);
  const close = (state: FilePickerState) => {
    setIsOpen(false);
    setTimeout(() => props.setState(state), 200);
  };
  return (
    <Dialog
      open={is_open}
      onOpenChange={(open) => !open && close(FilePickerState.EMPTY)}
    >
      <DialogContent
        className={`${font_poppins_one.className} max-h-screen overflow-y-auto`}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Confirm Image Upload</DialogTitle>
          <DialogDescription>
            Ready to Enter the Generative AI Image Competition? Confirm Your
            image to Get Started!
          </DialogDescription>
        </DialogHeader>
        <Center maxWidth="400px" className="py-4">
          {props.img ? (
            <Image
              src={props.img ?? ""}
              alt=""
              height={400}
              width={400}
              className="max-w-[400px] max-h-[400px] w-full h-full rounded-xl object-contain"
            />
          ) : (
            <div className="h-[400px] w-[400px] bg-bg-main-2/20 animate-pulse rounded-xl"></div>
          )}
        </Center>
        <DialogFooter className="gap-y-3">
          <Button
            variant="secondary"
            onClick={() => close(FilePickerState.EMPTY)}
          >
            Close
          </Button>
          <Button onClick={() => close(FilePickerState.UPLOADING)}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
