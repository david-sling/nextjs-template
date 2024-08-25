import { cn } from "@/utils/cn";
import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";

export type ButtonColor = "primary" | "secondary" | "mute";
type Size = "sm" | "md" | "lg";
type Variant = "filled" | "outlined" | "light";
type State = "default" | "hover" | "active" | "focus";
type Shape = "rounded" | "circle";

interface Props
  extends Omit<
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    "color"
  > {
  color?: ButtonColor;
  size?: Size;
  variant?: Variant;
  isLoading?: boolean;
  shape?: Shape;
}

const colorClasses: Record<
  ButtonColor,
  Record<Variant, Record<State, string>>
> = {
  primary: {
    filled: {
      default: "text-white fill-white bg-primary",
      hover: "hover:bg-primary-600",
      active: "active:bg-primary-700",
      focus: "focus:outline-none focus:ring focus:border-primary-300",
    },
    outlined: {
      default: "text-primary bg-white border border-primary",
      hover: "hover:bg-primary-100",
      active: "active:bg-primary-200",
      focus: "focus:outline-none focus:ring focus:border-primary-300",
    },
    light: {
      default: "text-primary bg-primary-50",
      hover: "opacity-80",
      active: "opacity-70",
      focus: "focus:outline-none focus:ring focus:border-primary",
    },
  },
  secondary: {
    filled: {
      default: "text-white fill-white bg-secondary",
      hover: "hover:bg-secondary-600",
      active: "active:bg-secondary-700",
      focus: "focus:outline-none focus:ring focus:border-secondary-300",
    },
    outlined: {
      default: "text-secondary bg-white border border-secondary",
      hover: "hover:bg-secondary-100",
      active: "active:bg-secondary-200",
      focus: "focus:outline-none focus:ring focus:border-secondary-300",
    },
    light: {
      default: "text-secondary bg-secondary-light",
      hover: "opacity-80",
      active: "opacity-70",
      focus: "focus:outline-none focus:ring focus:border-secondary",
    },
  },
  mute: {
    filled: {
      default: "bg-gray-100",
      hover: "hover:bg-gray-200",
      active: "active:bg-gray-300",
      focus: "focus:outline-none focus:ring focus:border-gray-300",
    },
    outlined: {
      default: "bg-white border-[#B6B6B6] border",
      hover: "hover:border-gray-300",
      active: "active:border-gray-400",
      focus: "focus:outline-none focus:ring focus:border-gray-300",
    },
    light: {
      default: "bg-white",
      hover: "opacity-80",
      active: "opacity-70",
      focus: "focus:outline-none focus:ring focus:border-gray-300",
    },
  },
};

const sizeClasses: Record<Size, Record<Shape, string>> = {
  sm: { rounded: "px-4 py-1 rounded-md", circle: "h-7 w-7" },
  md: { rounded: "px-8 py-2 rounded-lg", circle: "h-12 w-12" },
  lg: { rounded: "px-12 py-4 rounded-xl", circle: "" },
};
const shapeClasses: Record<Shape, string> = {
  rounded: "",
  circle: "rounded-full items-center justify-center",
};

export const Button: FC<Props> = ({
  color = "primary",
  size = "md",
  variant = "filled",
  shape = "rounded",
  className,
  disabled: buttonDisabled,
  isLoading,
  children,
  ...props
}) => {
  const disabled = isLoading || buttonDisabled;
  return (
    <button
      disabled={disabled}
      className={cn(
        "font-bold justify-center cursor-pointer flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
        colorClasses[color][variant]?.default,
        colorClasses[color][variant]?.hover,
        colorClasses[color][variant]?.active,
        colorClasses[color][variant]?.focus,
        shapeClasses[shape],
        sizeClasses[size][shape],
        className
      )}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin  mx-1 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="inherit"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            fill="none"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="inherit"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};
