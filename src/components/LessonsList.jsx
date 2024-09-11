import React, { useEffect, useState } from "react";
import axios from "axios";

const LessonsList = ({ onSelectLesson }) => {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    // Fetch lessons from your API or database
    axios
      .get("/api/lessons")
      .then((response) => {
        setLessons(response.data);
      })
      .catch((error) => {
        console.error("Error fetching lessons:", error);
      });
  }, []);

  return (
    <div>
      <h1>Available Lessons</h1>
      <ul>
        {lessons.map((lesson) => (
          <li key={lesson._id} onClick={() => onSelectLesson(lesson)}>
            {lesson.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LessonsList;
