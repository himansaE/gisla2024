import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { CSSProperties } from "react";

export const MailVerifyComponent = (link: string, email: string) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your Account for GISLA 2024</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={"https://gisla2024.vercel.app/images/logo-for-light.png"}
            width="300"
            height="136.36"
            alt="gisla2024 logo"
          />
          <Heading style={heading}>Verify your Account for GISLA 2024.</Heading>
          <Text style={email_addr}>{email}</Text>
          <Section style={buttonContainer}>
            <Button style={button} href={link}>
              Verify
            </Button>
          </Section>
          <Text style={paragraph}>
            Click the button to verify your account. This link will only be
            valid for the next 1 hour. If the link does not work, you can copy
            and paste the below link on your web browser.
          </Text>
          <Link href={link}>{link}</Link>
          <Hr style={hr} />
          <Link href="https://gisla2024.vercel.app/" style={reportLink}>
            GISLA 2024
          </Link>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    'Poppins,"Google Sans",Roboto,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "560px",
};

const heading: CSSProperties = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
  marginBottom: "0px",
};

const email_addr: CSSProperties = {
  fontSize: "15px",
  color: "#7e7e7e",
};

const paragraph = {
  margin: "0 0 5px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
};

const buttonContainer = {
  padding: "27px 0 27px",
};

const button = {
  padding: "10px 20px",
  backgroundColor: "#2a726f",
  borderRadius: "6px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
};

const reportLink = {
  fontSize: "14px",
  color: "#b4becc",
};

const hr = {
  borderColor: "#dfe1e4",
  margin: "50px 0 26px",
};

const code = {
  fontFamily: "monospace",
  fontWeight: "700",
  padding: "1px 4px",
  backgroundColor: "#dfe1e4",
  letterSpacing: "-0.3px",
  fontSize: "21px",
  borderRadius: "4px",
  color: "#3c4149",
};
