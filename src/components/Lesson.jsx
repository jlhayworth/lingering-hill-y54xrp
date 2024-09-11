import React, { useState, useEffect } from "react";
import axios from "axios";

const Lesson = ({ lessonId }) => {
  const [lesson, setLesson] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState({});

  useEffect(() => {
    // Fetch lesson by ID
    axios
      .get(`/api/lessons/${lessonId}`)
      .then((response) => {
        setLesson(response.data);
      })
      .catch((error) => {
        console.error("Error fetching lesson:", error);
      });
  }, [lessonId]);

  const handleQuizSubmit = (sectionId, questionIndex, selectedOption) => {
    const section = lesson.sections.find((s) => s._id === sectionId);
    const question = section.content.find((c) => c.type === "quiz").questions[
      questionIndex
    ];

    const isCorrect = selectedOption === question.correct_answer;

    setQuizFeedback({
      ...quizFeedback,
      [sectionId]: {
        ...quizFeedback[sectionId],
        [questionIndex]: isCorrect ? "Correct!" : "Incorrect.",
      },
    });
  };

  if (!lesson) return <div>Loading...</div>;

  return (
    <div>
      <h1>{lesson.title}</h1>
      {lesson.sections.map((section) => (
        <div key={section._id}>
          <h2>{section.title}</h2>
          {section.content.map((content, index) => (
            <div key={index}>
              {content.type === "text" && <p>{content.content}</p>}
              {content.type === "image" && (
                <img src={content.url} alt={content.alt_text} />
              )}
              {content.type === "video" && (
                <video controls src={content.url}></video>
              )}
              {content.type === "quiz" && (
                <div>
                  {content.questions.map((question, qIndex) => (
                    <div key={qIndex}>
                      <p>{question.question}</p>
                      {question.options.map((option, oIndex) => (
                        <button
                          key={oIndex}
                          onClick={() =>
                            handleQuizSubmit(section._id, qIndex, oIndex)
                          }
                        >
                          {option}
                        </button>
                      ))}
                      <p>{quizFeedback[section._id]?.[qIndex]}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Lesson;
