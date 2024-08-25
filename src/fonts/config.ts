import localFont from "next/font/local";

export const systemUi = localFont({
  src: [
    {
      path: "./system_ui/sys_ui-Black.woff",
      weight: "900",
      style: "normal",
    },
    {
      path: "./system_ui/sys_ui-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "./system_ui/sys_ui-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./system_ui/sys_ui-Heavy.woff",
      weight: "1200",
      style: "normal",
    },
    {
      path: "./system_ui/sys_ui-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "./system_ui/sys_ui-Thin.woff",
      weight: "100",
      style: "normal",
    },
    {
      path: "./system_ui/sys_ui-Semibold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "./system_ui/sys_ui-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./system_ui/sys_ui-UltraLight.woff",
      weight: "200",
      style: "normal",
    },
  ],
});
