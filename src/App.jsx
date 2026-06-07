import { useState } from "react";

import "./App.css";
import Book from "./component/Book";
import OrientationGate from "./component/OrientationGate";

function App() {
  return (
    <>
      <OrientationGate>
        <Book />
      </OrientationGate>
    </>
  );
}

export default App;
