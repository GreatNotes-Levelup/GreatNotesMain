import { createTheme } from "@mui/material";

const themeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#2adfb4',
    },
    secondary: {
      main: '#4fc3f7',
    },
  },
};

export const theme = createTheme(themeOptions);