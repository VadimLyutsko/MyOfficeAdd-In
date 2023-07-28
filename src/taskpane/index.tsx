import { AppContainer } from "react-hot-loader";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { ThemeProvider } from "@fluentui/react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {MyApp} from '../app/MyApp';
import { Provider } from "react-redux";
import {store} from '../app/store';

/* global document, Office, module, require */

initializeIcons();

let isOfficeInitialized = false;

const title = "Task Pane Add-in";

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <ThemeProvider>
        <Provider store={store}>
        <Component title={title} isOfficeInitialized={isOfficeInitialized} />
        </Provider>
      </ThemeProvider>
    </AppContainer>,
    document.getElementById("container")
  );
};

/* Render application after Office initializes */
Office.onReady(() => {
  isOfficeInitialized = true;
  render(MyApp);
});

if ((module as any).hot) {
  (module as any).hot.accept("../app/MyApp", () => {
    const NextApp = require("../app/MyApp").default;
    render(NextApp);
  });
}
