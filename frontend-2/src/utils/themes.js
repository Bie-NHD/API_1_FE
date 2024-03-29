import { createTheme } from "@mui/material";

const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#391386",
      contrastText: "#fff",
    },
    secondary: {
      main: "#df208f",
    },
    background: {
      default: "#F1F1F1",
      paper: "#ffffff",
    },
  },
});

export default appTheme;
