import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom
import "./styles/People.css";
import { useQuiz } from '../QuizContext';
import { useEffect } from 'react';
const People = () => {
  const {dataInfo,admin} = useQuiz();
  const [quiznames,setQuizNames] = useState(["all"]);
  const [key,setKey] = useState("all");
  const navigate = useNavigate(); 

  const redirectToLogin = () => {
    navigate('/');
  };

  useEffect(()=>{
    axios.get("http://localhost:3001/getquiz")
    .then(response => {
      var qnames = [...new Set(quiznames)];
      response.data.map((quiz) => qnames.push(quiz.name));
      qnames = [...new Set(qnames)];
      setQuizNames(qnames);
      console.log(qnames);
    });
  },[true]);
  const ScoreItem = (props) => {
    return (
      <div>
        <p key={props.username}>{props.username}</p><p>:</p> <p>{props.score}</p>
      </div>
    );
  }

  useEffect(()=>{
    if(!admin){
      window.alert("You are not admin dont come here");
      navigate("/");
    }
  },[]);

  function getScore(score,key){
      console.log("Current key = ",key)
      if(key == "all")
      {
        let sum = 0;
        for (const [key, value] of Object.entries(score)) {
          sum += value;
        }
        return sum;
      }
      else{
        return score[key]? score[key]:0;
      }
  }

  function setFilter(key){
    setKey(key);
    window.location.reload();
  }
  
  return (
    <div className='users'>
      <h2>USERS AND SCORES</h2>
          <select class="filter-bar" value={key} onChange={e => setKey(e.target.value)}>
            {
              quiznames.map((quiz,i) => <option key={i} value={quiz}>{quiz.toUpperCase()}</option>)
            }
          </select>
      <ul>
        {dataInfo.map(user => (
          <ScoreItem username={user.username} score={getScore(user.score,key)}/>
        ))}
      </ul>
      <button onClick={redirectToLogin}>Back to Login</button>
    </div>
  );
};

export default People;
