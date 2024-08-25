import { cn } from "@/utils/cn";
import { FC, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  onClose?: () => void;
  className?: string;
}
export const Modal: FC<Props> = ({ children, onClose, className }) => {
  return (
    <div
      onClick={onClose}
      className={cn(
        "fixed z-50 left-0 right-0 top-0 bottom-0 w-full bg-[rgba(0,0,0,0.5)] items-end flex md:items-center justify-center",
        onClose && "cursor-pointer"
      )}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "bg-white md:m-auto cursor-auto max-h-[calc(100vh-40px)] overflow-y-auto md:mx-5",
          "rounded-t-xl w-full md:w-fit md:rounded-b-xl",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};
