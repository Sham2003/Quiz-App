const express = require("express");
const mongoose=require('mongoose');
const cors = require("cors");
const app = express();
const { UserModel, QuestionModel, QuizModel } = require('./models/models');
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/Quiz");

app.get('/image/:name',(req,res)=>{
  const filename = req.params.name;
  console.log("/image ?name="+filename);
  res.sendFile("/resources/"+filename ,{
    root:"D:/Code Space/Quiz App/server"
  });
});

app.get("/getquiz",(req,res)=>{
  console.log("/getquiz");
  QuizModel.find()
    .then(result => res.json(result))
    .catch(err => res.json(err));
})

app.get('/getqs/:id',(req,res)=>{
  const ID = Number.parseInt(req.params.id);
  var size = 15;
  console.log("/getqs/"+ID);
  if(ID === 1){
    size = 20;
  }

  const process = [
    {
      $match: { quizId: ID }
    },
    {
      $sample: {size :size}
    }
  ];
  
  QuestionModel.aggregate(process).then(result => {
    res.json(result);
  }).catch(err => res.json(err));
});

app.get('/getusers',(req,res)=>{
  UserModel.find()
  .then(result => res.json(result))
  .then(result=>console.log(result))
  .catch(err => res.json(err))
});

app.get("/getMe",(req,res)=>{
  const {username} = req.query;
  console.log("/getMe ?username="+username);
  UserModel.findOne({ username: username})
    .then(user => {
      if (user) {
        res.json({ exists: true, user: user });
      } else {
        console.log("User not found");
        res.json({ exists: false,message:"User Not Found" });
      }
    })
    .catch(err => res.json({exists: false, message: 'Error occurred' }));
})

// Login Endpoint
app.get('/login', (req, res) => {
  const { username, password } = req.query;
  console.log("/login ?username="+username+"&password="+password);
  UserModel.findOne({ username: username, password: password })
    .then(user => {
      if (user) {
        console.log("User is logged in");
        res.json({ exists: true, user: user });
      } else {
        console.log("User not found");
        res.json({ exists: false,message:"User Not Found" });
      }
    })
    .catch(err => res.json({exists: false, message: 'Error occurred' }));
});

// Registration Endpoint
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  console.log("/register ?username="+username+"&password="+password);
  UserModel.findOne({ username: username })
    .then(existingUser => {
      if (existingUser) {
        console.log('Username already taken');
        res.json({ message: 'Username already taken' });
      } else {
        UserModel.create({
          username: username,
          password: password,
          admin:false
        }).then(result => {res.json({ message: 'User created successfully' });console.log('User Created');})
          .catch(err => res.json({ message: 'Error occurred' }));
      }
    })
    .catch(err => res.json({ message: 'Error occurred' }));
});

// Update Score Endpoint

app.post('/updateScore', (req, res) => {
  const { username, mark, name } = req.body;
  console.log("/updateScore", mark, name, username);
  
  UserModel.findOne({ username: username })
    .then((document) => {
      if (!document) {
        console.log("User not found");
        return res.status(404).json({ message: 'User not found' });
      }

      const score = document.score || {}; // Ensure score exists
      score[name] = mark;
      
      UserModel.updateOne({ username: username }, { score: score })
        .then(() => res.json({ message: 'Score updated successfully' }))
        .catch(() => res.status(500).json({ message: 'Error updating score' }));
    })
    .catch(err => {
      console.error("Error:", err);
      res.status(500).json({ message: 'Error updating score' });
    });
});


app.listen(3001, () => {
  console.log(`Server is running on port 3001.`);
});

