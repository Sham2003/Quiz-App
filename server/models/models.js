const mongoose=require('mongoose');
const QuestionSchema=new mongoose.Schema({
    question: String,
    options:[String],
    answer: String,
    quizId:Number
})
const UserSchema=new mongoose.Schema({
   username:String,
   password:String,
   score : {
    type:Object,
    default:{}
   },
   admin:{
    type:Boolean,
    required:true
   }
},{ minimize: false });

const QuizSchema = new mongoose.Schema({
    name:String,
    quizId:Number,
    image:String,
    thumbnail:String
});

const QuizModel = mongoose.model("quizzes",QuizSchema);
const QuestionModel=mongoose.model("qs",QuestionSchema);
const UserModel=mongoose.model("users",UserSchema);
module.exports = { UserModel, QuestionModel ,QuizModel};
