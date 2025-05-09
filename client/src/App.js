// App.js
import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import People from './components/People';
import Quiz from './components/Quiz'; 
import DashBoard from './components/DashBoard';
import { QuizProvider } from './QuizContext';

function App() {

  return (
    <QuizProvider>
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/dashboard' element={<DashBoard/>}/>
          <Route path="/admin" element={<People/>} />
          <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </div>
    </Router>
    </QuizProvider>
  );
}

export default App;
