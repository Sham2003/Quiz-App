// Score.js
import React,{useEffect} from "react";
import { useNavigate } from 'react-router-dom'; 
import "./styles/Score.css";
import { useQuiz } from '../QuizContext';
const Score = (props) => {
  const {setQuizStatus} = useQuiz();
  const navigate = useNavigate(); 
  const redirectToLogin = () => {
    setQuizStatus("Completed");
    console.log("Going to dashboard");
    navigate('/dashboard');
  };
  
  return (
    <div className="score-container">
      <img src={props.img} className='score-bg'></img>
      <div className="score">
        <h2>{props.username}</h2><p> You have scored {props.mark} out of {props.total}</p>
        <button onClick={redirectToLogin}>Go To DashBoard </button>
      </div>
    </div>
  );
};

export default Score;
