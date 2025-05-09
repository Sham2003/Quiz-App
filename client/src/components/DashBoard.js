import React, { useEffect } from 'react'
import "./styles/DashBoard.css"
import { useQuiz } from '../QuizContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function DashBoard() {
  const navigate = useNavigate();
  const {userInfo,setUserInfo,setQuizStatus,admin,dataInfo,quizStatus} = useQuiz();

  function goToQuiz(quiz,img,quizId){
    setQuizStatus("not_started");
    navigate('/quiz', { state: { quiz: quiz,img:img,quizId:quizId } });
  }

  useEffect(()=>{
    if(admin){
      window.alert("You are admin dont come here");
      navigate("/");
    }
    axios.get('http://localhost:3001/getMe'+"?username="+userInfo.username)
    .then(response => {
      if (response.data.exists) {
        if( response.data.user){
          setUserInfo(response.data.user);
        } 
      }
    },[])
    .catch(err => console.log(err));
    
    const elements = document.querySelectorAll(".quiz-box-content p:nth-child(1)");

    const getFontSize = (textLength) => {
      const baseSize = 2;
      const maxTextLength = 10; // You can adjust this value as needed
      const slope = 0.1; // Slope for linear interpolation
      const fontSize = baseSize - slope * Math.max(textLength - maxTextLength,0);
      return `${fontSize}em`;
    };

    const getMBottom = (textLength) => {
      const basemb = 20;
      const maxTextLength = 10;
      const slope = 3;
      const mb = basemb + slope * Math.max(textLength - maxTextLength,0);
      return `${mb}px`
    }
      
    elements.forEach(box => {
      let fsize = getFontSize(box.textContent.length);
      box.style.fontSize = fsize;
      box.style.marginBottom = getMBottom(box.textContent.length);
    })

  });

  const quizItems = [];
  dataInfo.map((quiz,index) =>{
    const qscore = userInfo.score[quiz.name]?userInfo.score[quiz.name]:0; 
    quizItems.push(
      <div className='quiz-box' key={index}>
        <img className='q-bg' src={quiz.thumbnail}></img>
        <div className='quiz-box-content'>
          <p>{quiz.name}</p>
          <p>Current Score:<p>{qscore}</p></p>
          <button onClick={(e) => goToQuiz(quiz.name,quiz.image,quiz.quizId)}> Attempt Quiz</button>
        </div>
      </div>
    )
  })

  function logOut(){
    setQuizStatus("not_started");
    navigate('/');
  }

  return (
    <div class="app-container">
        <div class="app-header">
          <p><div className='app-icon'></div>{userInfo.username}</p>
          <p>Quizzer.com</p>
          <button className='logout' onClick={logOut}></button>
        </div>
        <div className='quiz-header'>
            {quizItems}
        </div>
    </div>
  )
}

export default DashBoard