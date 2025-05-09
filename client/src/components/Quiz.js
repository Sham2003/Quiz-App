// Quiz.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Score from './Score';
import "./styles/Quiz.css";
import { useQuiz } from '../QuizContext';

function Quiz() {
    const {userInfo,setQuizStatus} = useQuiz();
    const location = useLocation();
    const quizname = location.state.quiz;
    const quizId = location.state.quizId;
    const img = location.state.img;
    const [questions, setQuestions] = useState([]);
    const [qindex, setIndex] = useState(0);
    const [total, setTotal] = useState();
    const [marks, setMarks] = useState([]);
    const [tmark,setTmark] = useState([]);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const navigate = useNavigate();


    function updateTotal(){
        let sum = 0;
        marks.forEach( num => {
            sum += num;
        });
        setTmark(sum);
    }
    
    useEffect(() => {
        setQuizStatus("Started");
        console.log("Started");
        axios.get('http://localhost:3001/getqs/'+quizId)
            .then(result => {
                setQuestions(result.data);
                setTotal(result.data.length);
                setMarks(new Array(result.data.length));
            })
            .catch(err => console.log(err));

    }, []);

    const handleNextQuestion = () => {
        document.querySelectorAll('.quiz-rs ul li').forEach(option => {
            option.classList.remove('selected');
        });

        if (qindex < questions.length - 1) {
            setIndex(qindex + 1);
        } else {
            setQuizCompleted(true);
        }
    };
    const handlePrevQuestion = () => {
        document.querySelectorAll('.quiz-rs ul li').forEach(option => {
            option.classList.remove('selected');
        });

        if (qindex > 0) {
            setIndex(qindex - 1);
        }

        if (qindex === 0)
        {
            console.log("Going Back");
            navigate("/dashboard");
        }
    };

    function markAnswer(index,s){
        const newMarks = [...marks];
        marks[index] = s;
        setMarks(marks);
    }
    const checkAns = (e, i) => {
        const correctAnswer = questions[qindex].answer;
        
        document.querySelectorAll('.quiz-rs ul li').forEach(option => {
            option.classList.remove('selected');
        });
        e.target.className = "selected";
        if (questions[qindex].options[i] === correctAnswer) {
            markAnswer(qindex,1);
            updateTotal();
        } else {
            markAnswer(qindex,0);
            updateTotal();
            console.log('Incorrect answer!',correctAnswer);
        }
    };

    const submitScore = () => {
        axios.post('http://localhost:3001/updateScore', { username: userInfo.username, mark: tmark,name:quizname })
            .then(response => {
                console.log('Score updated successfully');
            })
            .catch(error => {
                console.error('Error updating score:', error);
            });
    };

    useEffect(() => {
        if (quizCompleted) {
            submitScore(); 
        }
    }, [quizCompleted]);


    
    if (quizCompleted) {
        return (
            <Score username = {userInfo.username} mark={tmark} img={img} total={total} />
        );
    }

    function goBack(e){
        console.log("Going Back")
        navigate("/dashboard");
    }

    return (
        <div className='quiz'>
            <button className="quiz-back" onClick={goBack}>Back</button>
            <img src={img} className='quiz-bg'></img>
            <div className='quiz-container'>
                <div className='quiz-ls'>
                    <p>{quizname} Quiz</p>
                    <p>{(qindex+1) +" of " + questions.length}</p>
                </div>
            {
                questions.length === 0 ? <div className='quiz-rs'><h2>No questions</h2></div> :
                <div className='quiz-rs'>
                    <h2>{questions[qindex].question}</h2>
                    <ul>
                        {
                            questions[qindex].options.map((opt,i) => {
                                return <li onClick={(e) => checkAns(e, i)} key={i}>{opt}</li>
                            })
                        }
                    </ul>
                    <div className='quiz-rs-btn'>
                        <button onClick={handlePrevQuestion}>{qindex === 0 ? 'Home' : 'Prev'}</button>
                        <button onClick={handleNextQuestion}>{qindex === questions.length - 1 ? 'Submit' : 'Next'}</button>
                    </div>
                </div>
            }
            </div>
        </div>
    );
}

export default Quiz;
