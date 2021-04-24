import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import React from "react";

import theme from './theme';
import { Routes } from "./routes";
import { SnackbarProvider } from 'notistack';


const App = () => {

  return (
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <CssBaseline />
        <Routes />
      </SnackbarProvider>
    </MuiThemeProvider>
  );
}

export default App;
