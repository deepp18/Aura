import React from "react";

const lessonContent = {
  investing: {
    title: "Dealing With Stress / Reframing",
    content: "Techniques to reframe stress & calm the mind.",
    videoLink: "https://www.youtube-nocookie.com/embed/lS0kcSNlULw", // ✅ embed URL
  },
};

function Lesson2() {
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
          title="A 10-Minute Meditation for Stress from Headspace | Mental Health Action Day"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}

export default Lesson2;
