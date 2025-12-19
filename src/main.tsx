import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import "+/index.css"

import { store } from "+/redux/store"

import App from "+/App"
import Palabras from "./v2/Palabras"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <Palabras />
    </Provider>
  </React.StrictMode>
)
