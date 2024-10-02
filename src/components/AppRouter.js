// AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuizMaker from './QuizMaker/QuizMaker'; 
import Results from './Results/Results'; 

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuizMaker />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
