"use client";

import { useHasBeenOnScreen } from "@/hooks/useHasBeenOnScreen";
import { DetailedHTMLProps, FC, HTMLAttributes, useRef } from "react";

const NUMBER_OF_ROLLS = 4;

const getFontProps = (fontSize: number) => {
  const offset = (16 * fontSize - 392) / 25;
  const numGap = 5;
  const numHeight = fontSize + 3;
  const numHeightWithGap = numHeight + numGap;

  return { offset, numGap, numHeight, numHeightWithGap };
};

const Roll: FC<{
  num: number;
  idx: number;
  fontSize: number;
  hasBeenOnScreen: boolean;
}> = ({ num, idx, fontSize, hasBeenOnScreen }) => {
  const { offset, numHeight, numHeightWithGap } = getFontProps(fontSize);
  return (
    <div style={{ height: numHeight }}>
      <div
        style={{
          transform: hasBeenOnScreen
            ? `translateY(-${
                (num + (NUMBER_OF_ROLLS - 1) * 10) * numHeightWithGap - offset
              }px)`
            : undefined,
          transitionDelay: `${idx * 0.1}s`,
          transitionDuration: "1s",
        }}
        className="flex flex-col"
      >
        {Array.from({ length: NUMBER_OF_ROLLS }, () =>
          Array.from({ length: 10 }, (_, i) => (
            <p
              style={{
                height: numHeightWithGap,
                fontSize,
                width: fontSize * 0.64,
              }}
              key={i}
              className="font-bold text-right"
            >
              {i}
            </p>
          ))
        )}
      </div>
    </div>
  );
};

export const NumberRoll: FC<
  {
    children: string;
    fontSize?: number;
  } & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ children, fontSize = 37, ...props }) => {
  const { offset, numGap, numHeight } = getFontProps(fontSize);

  const characters = children.split("");
  const ref = useRef(null);
  const hasBeenOnScreen = useHasBeenOnScreen(ref);
  return (
    <div
      {...(props as any)}
      ref={ref}
      style={{ ...props.style, paddingTop: numGap }}
      className="flex overflow-y-hidden"
    >
      {characters.map((char, idx) => {
        const num = parseInt(char, 10);
        return char === " " ? (
          <div style={{ width: 10 }} />
        ) : Number.isNaN(num) ? (
          <p
            style={{
              fontSize,
              height: numHeight,
              transform: `translateY(${offset}px)`,
            }}
            className="font-bold text-right"
          >
            {char}
          </p>
        ) : (
          <Roll
            num={num}
            key={char}
            idx={idx}
            fontSize={fontSize}
            hasBeenOnScreen={hasBeenOnScreen}
          />
        );
      })}
    </div>
  );
};
