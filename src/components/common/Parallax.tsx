"use client";

import { useElementPosition } from "@/hooks/useElementPosition";
import {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  ReactNode,
  useMemo,
  useRef,
} from "react";

export const Parallax: FC<
  {
    speedX?: number;
    speedY?: number;
    children: ReactNode | FC<{ position: number }>;
  } & Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    "children"
  >
> = ({ speedX = 0, speedY = 0, children: Children, ...props }) => {
  const ref = useRef(null);
  const { position } = useElementPosition(ref);
  const MemoizedChildren = useMemo(() => Children, []);
  return (
    <div
      {...(props as any)}
      ref={ref}
      style={{
        transform: `translate(${position * speedX}%, ${position * speedY}%)`,
        ...props.style,
      }}
    >
      {typeof MemoizedChildren === "function" ? (
        <MemoizedChildren position={position} />
      ) : (
        MemoizedChildren
      )}
    </div>
  );
};
