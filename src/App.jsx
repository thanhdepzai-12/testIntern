import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from './components/Layout/Homepage/Homepage';
import Chatpage from './components/Layout/Chatpage/Chatpage';



const App = () => (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/chat/:conversationId" element={<Chatpage />} />
    </Routes>
);

export default App;