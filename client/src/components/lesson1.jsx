import React from "react";

const lessonContent = {
  investing: {
    title: "Mindfulness & Meditation Basics",
    content: "Intro to breathing, calming the mind",
    videoLink: "https://www.youtube-nocookie.com/embed/zK2TXgGu-GQ", // embed version
  },
};

function Lesson1() {
  return (
    <div className="lesson-container mx-auto max-w-2xl p-4 flex flex-col items-center justify-evenly">
      <h1 className="text-2xl font-bold mb-4 hover:underline">
        {lessonContent.investing.title}
      </h1>
      <p className="mb-6 ring ring-gray p-4 rounded-xl shadow-md hover:shadow-xl hover:underline">
        {lessonContent.investing.content}
      </p>

      <div className="video-container mb-4">
        <iframe
          width="702"
          height="395"
          src={lessonContent.investing.videoLink}
          title="Day 1: Headspace 'Basics 1' Meditation Session"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>

      <div className="playlist mt-4">
        <h2 className="text-lg font-semibold mb-2">Playlist</h2>
        <ul>
          <li>
            <a href="#" className="hover:underline">
              Mindfulness & Meditation Basics
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Lesson1;
