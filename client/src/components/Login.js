import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';
import { useQuiz } from '../QuizContext';
import { useState } from 'react';
const Login = () => {
  const {setUserInfo,setDataInfo,setAdmin} = useQuiz();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const [view,setView] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e,type) => {
    e.preventDefault();

    if(type == 'signup'){
      axios.post('http://localhost:3001/register', { username: username, password: password })
        .then(response => {
          setMessage(response.data.message);
        })
        .catch(err => {
          setMessage(err.response.data.message);
        });
    }

    if(type == 'login')
    {
      axios.get('http://localhost:3001/login'+"?username="+username+"&password="+password)
        .then(response => {
          if (response.data.exists) {
            if( response.data.user.admin){
              setUserInfo(response.data.user);
              console.log('Logged in as admin',response.data.user);
              axios.get('http://localhost:3001/getusers')
                .then(response => {
                  console.log("Got all user data",response.data);
                  setAdmin(true);
                  setDataInfo(response.data);
                  navigate('/admin');
                })
                .catch(err => {
                  setMessage(err.response.data.message);
                });
            }else{
              console.log('Logged in successfully regular user',response.data.user);
              setUserInfo(response.data.user);
              setAdmin(false);
              axios.get("http://localhost:3001/getquiz")
                .then(response => {
                  console.log(response.data);
                  console.log("Got all quiz data",response.data);
                  setDataInfo(response.data);
                })
                .catch(err =>setMessage(err.response.data.message));
              navigate('/dashboard');
            }
            
          } else {
            setMessage(response.data.message);
          }
        })
        .catch(err => {
          setMessage(err.response.data.message);
        });
    }
  };
  function changeView(e){
    setView(!view);
  }
  
  return (
    <>
    <h1 id="page-title">Quizzzer</h1>
    <div className="login-container">
      
      <div className={view?"brand first":"brand second"} onClick={changeView}>
        <p>{view?"Signup":"Login"}</p>
      </div>
      <div className="login-form first">
        <h2>Sign Up</h2>
        <form onSubmit={(e) => handleSubmit(e,'signup')}>
          <div>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit">Login</button>
          <p>{message}</p>
        </form>
      </div>
      <div className="login-form second">
        <h2>Login</h2>
        <form onSubmit={(e) => handleSubmit(e,'login')}>
          <div>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit">Login</button>
          <p>{message}</p>
        </form>
      </div>
    </div>
    </>
  );
};

export default Login;
