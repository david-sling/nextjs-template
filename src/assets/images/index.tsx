/* eslint-disable react/display-name */
import { cn } from "@/utils/cn";
import Image, { StaticImageData } from "next/image";
import { FC } from "react";

export const createImage =
  (
    src: StaticImageData,
    alt: string
  ): FC<Omit<Parameters<typeof Image>[0], "src" | "alt">> =>
  (props) =>
    (
      <Image
        src={src}
        alt={alt}
        {...props}
        className={cn("object-contain", props.className)}
      />
    );
