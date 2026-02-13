import { createTheme } from "@mantine/core";

const theme = createTheme({
  primaryColor: "indigo",
  fontFamily: "Inter, system-ui, -apple-system, sans-serif",
  defaultRadius: "md",
  colors: {
    dark: [
      "#C1C2C5",
      "#A6A7AB",
      "#909296",
      "#5C5F66",
      "#373A40",
      "#2C2E33",
      "#25262B",
      "#1A1B1E",
      "#141517",
      "#101113",
    ],
  },
  headings: {
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    fontWeight: "700",
  },
});

export default theme;
