interface FilePickerOptions {
  multiple?: boolean;
  accept?: string;
}

type FilePickerResult<TOptions extends FilePickerOptions> =
  TOptions["multiple"] extends true ? File : FileList;

export const showFilePicker = async (
  options: FilePickerOptions
): Promise<FilePickerResult<typeof options>> => {
  return new Promise((res) => {
    if ((globalThis as unknown as any[])[0] == undefined) return;
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = options.multiple || false;
    input.accept = options.accept || "";
    input.addEventListener("change", (event: Event) => {
      const files = (event.target as HTMLInputElement).files as FileList;
      res(files);
    });
    input.click();
  });
};

showFilePicker({ multiple: false }).then((i) => i);
