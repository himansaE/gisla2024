import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export const Center = (props: {
  maxWidth: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={twMerge("w-full h-full justify-center flex", props.className)}
    >
      <div className="w-full" style={{ maxWidth: props.maxWidth }}>
        {props.children}
      </div>
    </div>
  );
};
