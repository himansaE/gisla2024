import { render } from "@react-email/components";
import { JSXElementConstructor, ReactElement } from "react";
import { gmail_transporter } from "./gmail";

export const sendMail = async (
  to: string,
  subject: string,
  html: ReactElement<any, string | JSXElementConstructor<any>>
) => {
  try {
    return await gmail_transporter
      .sendMail({
        to,
        from: process.env.GMAIL_ADDR,
        html: render(html),
        subject,
      })
      .then((i) => i.response);
  } catch (e) {
    return false;
  }
};
