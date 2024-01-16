import { toast } from "sonner";

export const sharePost = async (url?: string) => {
  if (!navigator.share) {
    toast.warning(
      "Share Feature not available in our browser. Try update your browser or Use another sharing method."
    );
    return;
  }
  if (!url) {
    toast.warning("Something went wrong. Try refresh.");
    return;
  }
  const data: ShareData = {
    title: "Share file",
  };

  let res: Blob;
  try {
    res = await fetch(url, { mode: "no-cors" }).then((i) => i.blob());
  } catch (e) {
    toast.warning("Can't load the Artwork. Try again.");
    return;
  }
  data.files = [
    new File([res], url.split("/").pop() ?? "file.jpg", {
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
};

export const copyText = async (text: string) => {
  console.log(text);
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Link coped successfully.");
      return;
    } catch (e) {}
  }
  const elm = document.createElement("input");
  elm.value = text;
  elm.style.position = "fixed";
  elm.style.top = "0";
  elm.style.zIndex = "-102";
  document.body.appendChild(elm);
  setTimeout(() => {
    elm.focus();
    elm.select();
    try {
      var successful = document.execCommand("copy");
      if (successful) toast.success("Link coped successfully.");
      else toast.error("Link copy unsuccessful.");
    } catch (err) {
      toast.error("Link copy unsuccessful.");
      console.log(err);
    }
    document.body.removeChild(elm);
  }, 0);
};

export const openLinkInNewWindow = (link: string) => {
  window.open(link, "_blank");
};

export const downloadImage = (link: string) => {
  const a = document.createElement("a");
  a.href = link;
  a.target = "_blank";
  a.download = link.split("/").pop() ?? "artwork.jpg";
  document.body.appendChild(a);
  setTimeout(() => {
    a.click();
  }, 0);
};
