import { ReactNode, forwardRef } from "react";
import { Input, InputProps } from "./input";
import { Textarea } from "./textarea";

type InputBoxProps = {
  title: string;
  subAction?: ReactNode;
  inpError?: string;
  errorText?: string;
} & InputProps;
export const InputBox = (props: InputBoxProps) => {
  return <Container {...props} element={Input} />;
};

export const TextAreaBox = (props: InputBoxProps) => {
  return <Container {...props} element={Textarea} />;
};
const Container = (props: InputBoxProps & { element?: any }) => {
  const { subAction, inpError, errorText, ...inputProps } = props;
  return (
    <div>
      <label>
        <div className="mx-0.5  my-1 flex justify-between text-sm font-medium text-slate-800 dark:text-slate-300">
          <div
            className={`font-semibold ${
              props.inpError == props.name ? "text-destructive" : ""
            }`}
          >
            {props.title}
          </div>
          <div className="mr-1" onClick={(e) => e.preventDefault()}>
            {subAction ?? <></>}
          </div>
        </div>
        <props.element {...inputProps} required />
        <div className="text-sm text-destructive">
          {inpError == props.name ? errorText : ""}
        </div>
      </label>
    </div>
  );
};

export const InputBoxWithRef = forwardRef<HTMLInputElement, InputBoxProps>(
  (props, ref) => {
    const { subAction, ...inputProps } = props;
    return (
      <div>
        <label>
          <div className="mx-0.5 flex justify-between text-sm font-medium text-slate-800 dark:text-slate-300">
            <div>{props.title}</div>
            <div className="mr-1">{subAction ?? <></>}</div>
          </div>
          <Input {...inputProps} required ref={ref} />
        </label>
      </div>
    );
  }
);

InputBoxWithRef.displayName = "InputBoxWithRef";
