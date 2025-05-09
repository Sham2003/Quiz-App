const axios = require('axios');
const he = require('he');
const fs = require('fs');

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


async function fetchDataAndInsert() {
try {
    // Fetch quiz categories
    const categoryResponse = await axios.get('https://opentdb.com/api_category.php');
    const categories = categoryResponse.data.trivia_categories;
  
    // Prepare array of quiz documents
    const quizzes = categories.map(category => ({
      name: category.name,
      quizId: category.id,
      image: '',
      thumbnail: ''
    }));
  
    // Save quizzes as JSON file
    fs.writeFileSync('quizzes.json', JSON.stringify(quizzes, null, 2));
    console.log('QuizModels saved to quizzes.json');
  
    for (const category of categories) {
      // Fetch questions for each category
      const response = await axios.get(`https://opentdb.com/api.php?amount=20&category=${category.id}`);
      const questions = response.data.results;
  
      // Prepare array of question documents
      const questionDocs = questions.map(question => ({
        question: he.decode(question.question),
        options: shuffleArray([...question.incorrect_answers, question.correct_answer]),
        answer: question.correct_answer,
        quizId: category.id
      }));
  
      // Save questions as JSON file
      fs.writeFileSync(`questions_${category.id}.json`, JSON.stringify(questionDocs, null, 2));
      console.log(`QuestionModels saved for category ${category.name} to questions_${category.id}.json`);
    }
  
    console.log('Data saved successfully as JSON files.');
  } catch (error) {
    console.error('Error fetching or saving data:', error);
  }
}
// Call the function to fetch data and insert into the database
fetchDataAndInsert();
