import { cn } from "@/utils/cn";
import { FC, useState } from "react";

interface Props {
  value: boolean;
  onChange: (p: boolean) => void | Promise<void>;
}

export const Switch: FC<Props> = ({ onChange, value }) => {
  const [loading, setLoading] = useState(false);
  return (
    <div
      onClick={async () => {
        setLoading(true);
        await onChange(!value);
        setLoading(false);
      }}
      className={cn(
        "cursor-pointer p-[4.5px] w-[43px] flex transition-all rounded-full",
        value ? "bg-primary" : "bg-gray-300",
        loading && "cursor-progress bg-primary-100"
      )}
    >
      <div className={cn(value && "flex-1", "transition-all")} />
      <div className="bg-white p-[7px] rounded-full" />
    </div>
  );
};
