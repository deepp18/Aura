import React from "react";
import { Link } from "react-router-dom";
import Lesson from "../components/lesson";
import Lesson1 from "../components/lesson1";
import Lesson2 from "../components/lesson2";
import QuestionsForm1 from "../components/QandA/Finance";
import QuestionsForm from "../components/QandA/Invest";
import QuestionsForm2 from "../components/QandA/Budgeting.jsx";
import BudgetingImage from "../assets/budget.jpg";
import fin from "../assets/fin.jpg";
import invest from "../assets/invest.jpg";
import { Home, QuestionAnswerRounded } from "@mui/icons-material";
import BlogHome from "./BlogHome.jsx";

/**
 * Learning page redesigned to match Aura theme.
 * Uses .glass-card, .text-gradient, .btn-primary and readable contrast.
 */

export function Learning() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-white">
          <span className="text-gradient">Recommended Courses</span>
        </h1>
        <p className="text-sm text-white/75 mt-1">
          Interactive, bite-sized lessons to build financial literacy.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card
          to="/budgeting"
          title="Name It to Tame It"
          description="Learning to name your emotions to gain control"
          image={BudgetingImage}
        />
        <Card
          to="/investing"
          title="Mindfulness & Meditation Basics"
          description="Intro to breathing, calming the mind"
          image={invest}
        />
        <Card
          to="/financing"
          title=" Dealing With Stress / Reframing"
          description="Techniques to reframe stress & calm the mind"
          image={fin}
        />
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-semibold text-white mb-4">Blogs and Articles</h2>
        <div className="glass-card p-4">
          <BlogHome />
        </div>
      </section>
    </div>
  );
}

export function Card({ to, title, description, image }) {
  return (
    <Link
      to={to}
      className="glass-card overflow-hidden rounded-xl block transition-transform transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      aria-label={`Open ${title}`}
    >
      <div className="w-full h-44 md:h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="p-5">
        <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-white/80 mb-4">{description}</p>

        <div className="flex items-center justify-between">
          <Link
            to={`${to}/qanda`}
            className="inline-flex items-center gap-2 text-sm font-medium btn-primary px-3 py-1 rounded-full"
            aria-label={`Open Q and A for ${title}`}
          >
            <QuestionAnswerRounded fontSize="small" />
            Q &amp; A
          </Link>

          <span className="text-xs text-white/70">Start learning →</span>
        </div>
      </div>
    </Link>
  );
}

export function Budgeting() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="glass-card p-6">
        <Lesson />
        <div className="mt-6 flex gap-3">
          <Link to="/budgeting/qanda" className="btn-primary px-4 py-2 rounded-full">
            <QuestionAnswerRounded /> Q &amp; A
          </Link>

          <Link to="/learning" className="underline text-white/80 ml-auto flex items-center gap-2">
            <Home /> Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export function BudgetingQAndA() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="glass-card p-6">
        <QuestionsForm2 />
        <div className="mt-4">
          <Link to="/learning" className="text-sm text-white/80 hover:underline inline-flex items-center gap-2">
            <Home /> Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Investing() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="glass-card p-6">
        <Lesson1 />
        <div className="mt-6 flex gap-3">
          <Link to="/investing/qanda" className="btn-primary px-4 py-2 rounded-full">
            <QuestionAnswerRounded /> Q &amp; A
          </Link>
          <Link to="/learning" className="underline text-white/80 ml-auto flex items-center gap-2">
            <Home /> Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export function InvestingQAndA() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="glass-card p-6">
        <QuestionsForm />
        <div className="mt-4">
          <Link to="/learning" className="text-sm text-white/80 hover:underline inline-flex items-center gap-2">
            <Home /> Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Financing() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="glass-card p-6">
        <Lesson2 />
        <div className="mt-6 flex gap-3">
          <Link to="/financing/qanda" className="btn-primary px-4 py-2 rounded-full">
            <QuestionAnswerRounded /> Q &amp; A
          </Link>
          <Link to="/learning" className="underline text-white/80 ml-auto flex items-center gap-2">
            <Home /> Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export function FinancingQAndA() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="glass-card p-6">
        <QuestionsForm1 />
        <div className="mt-4">
          <Link to="/learning" className="text-sm text-white/80 hover:underline inline-flex items-center gap-2">
            <Home /> Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Learning;

