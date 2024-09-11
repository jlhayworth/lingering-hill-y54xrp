import React, { useState, useEffect } from "react";
import axios from "axios";

const Test = ({ lessonId, onCompleteTest }) => {
  const [test, setTest] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [startTime, setStartTime] = useState(Date.now());
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Fetch the test for the lesson
    axios
      .get(`/api/tests/${lessonId}`)
      .then((response) => {
        setTest(response.data);
        setStartTime(Date.now()); // Start the test time
      })
      .catch((error) => {
        console.error("Error fetching test:", error);
      });
  }, [lessonId]);

  const handleAnswerChange = (questionIndex, selectedOption) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: selectedOption,
    });
  };

  const handleSubmitTest = () => {
    const endTime = Date.now();
    const incorrectAnswers = [];
    let correctCount = 0;

    test.questions.forEach((question, index) => {
      if (userAnswers[index] !== question.correct_answer) {
        incorrectAnswers.push({ question, userAnswer: userAnswers[index] });
      } else {
        correctCount++;
      }
    });

    const finalScore = (correctCount / test.questions.length) * 100;

    setScore(finalScore);

    // Send test result to API
    axios
      .post("/api/tests/submit", {
        lessonId,
        score: finalScore,
        incorrectAnswers,
        completionTime: endTime - startTime,
      })
      .then(() => {
        onCompleteTest({
          score: finalScore,
          incorrectAnswers,
          completionTime: endTime - startTime,
        });
      })
      .catch((error) => {
        console.error("Error submitting test:", error);
      });
  };

  if (!test) return <div>Loading...</div>;

  return (
    <div>
      <h2>Test</h2>
      {test.questions.map((question, qIndex) => (
        <div key={qIndex}>
          <p>{question.question}</p>
          {question.options.map((option, oIndex) => (
            <button
              key={oIndex}
              onClick={() => handleAnswerChange(qIndex, oIndex)}
            >
              {option}
            </button>
          ))}
        </div>
      ))}
      <button onClick={handleSubmitTest}>Submit Test</button>
      {score !== null && <p>Your Score: {score}%</p>}
    </div>
  );
};

export default Test;
