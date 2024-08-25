import { FC } from "react";
import { Collapsible } from "../common/Collapsible";

interface Props {
  error?: string | null;
  isTouched?: boolean;
  className?: string;
}
export const ErrorMessage: FC<Props> = ({ error, isTouched, className }) => {
  return (
    <Collapsible className={className} collapsed={!error || !isTouched}>
      <p className="text-red-500 mt-1 text-sm font-medium">{error}</p>
    </Collapsible>
  );
};
