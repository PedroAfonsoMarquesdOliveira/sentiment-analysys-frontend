import React from 'react';

import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./Welcome";
import Analyzer from "./Analyzer";
function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/analyze" element={<Analyzer />} />
        </Routes>
      </Router>
  );
}

export default App;
