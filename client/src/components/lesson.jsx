import { QuestionAnswer } from "@mui/icons-material";
import React from "react";

const lessonContent = {
  budgeting: {
    title: "Name It to Tame It",
    content:
      "Learning to name your emotions to gain control",
    videoLink: "https://www.youtube.com/watch?v=zoCiHlFjo04",
  },
};

function Lesson() {
  return (
    <div className="lesson-container mx-auto max-w-2xl p-4 flex flex-col items-center justify-evenly">
      <h1 className="text-2xl font-bold mb-4 hover:underline">
        {lessonContent.budgeting.title}
      </h1>
      <p className="mb-6 ring ring-gray p-4 rounded-xl shadow-md hover:shadow-xl hover:underline">
        {lessonContent.budgeting.content}
      </p>

      <div className="video-container mb-4">
        <iframe
        
            width="702"
            height="395"
            src="https://www.youtube-nocookie.com/embed/zoCiHlFjo04" 
            title="Session 1 - Name It to Tame It: How to Process Emotions 1/30"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
/>

      </div>

      {/* Playlist */}
      <div className="playlist mt-4">
        <h2 className="text-lg font-semibold mb-2">Playlist</h2>
        <ul>
          {/* You can add list items for different lessons here */}
          <li>
            <a href="#">
              Name It to Tame It
            </a>
          </li>
          {/* Add more lessons as needed */}
        </ul>
      </div>
    </div>
  );
}

export default Lesson;
