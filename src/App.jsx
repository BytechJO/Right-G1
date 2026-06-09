import { useState } from "react";
import "./App.css";
import Book from "./component/Book";
import OrientationGate from "./component/OrientationGate";
import { AudioProvider } from "./AudioContext";

function App() {
  return (
    <>
      <OrientationGate>
        <AudioProvider>
          <Book />
        </AudioProvider>
      </OrientationGate>
    </>
  );
}

export default App;
