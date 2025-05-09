import React, { createContext, useState, useContext } from 'react';

const QuizContext = createContext();

export const useQuiz = () => {
  return useContext(QuizContext);
};


export const QuizProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [admin, setAdmin] = useState(false);
  const [dataInfo, setDataInfo] = useState([]);
  const [quizStatus, setQuizStatus] = useState('not_started');
  const [questions, setQuestions] = useState([]);

  return (
    <QuizContext.Provider value={{ userInfo, setUserInfo,admin, setAdmin,dataInfo, setDataInfo, quizStatus, setQuizStatus, questions, setQuestions }}>
      {children}
    </QuizContext.Provider>
  );
};
