// App.jsx (NavBar + Footer inlined)
import React, { Fragment, useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider, Outlet, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import WhatshotOutlinedIcon from "@mui/icons-material/WhatshotOutlined";
import { IconButton, Button } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { Leaderboard, Logout, Person, Stream } from "@mui/icons-material";
import { FiChevronDown } from "react-icons/fi";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* App pages & components (keep same relative imports as before) */
import Login from "./pages/Login";
import Home from "./pages/Home";
import BlogHome from "./pages/BlogHome";
import Blog from "./pages/Blog";
import Profile from "./pages/Profile";
import Party from "./pages/Party";
import TaskPages from "./pages/TaskPages";
import Monetary from "./pages/Monetary";
import FriendsPage from "./pages/FriendsPage";
import Redirect from "./Redirect";
import StaggeredDropDown from "./components/ChatBot";
import {
  Budgeting,
  BudgetingQAndA,
  Investing,
  InvestingQAndA,
  Financing,
  FinancingQAndA,
} from "./pages/Learning";
import StockGame from "./pages/stockgame";
import Savings from "./pages/Savings";
import Learning from "./pages/Learning";
import LeaderBoard from "./pages/FriendsPage";
import Tracker from "./pages/helpers/Tracker";
import InvestPortfolio from "./pages/helpers/InvestPortfolio";

/* Local assets & small components used by NavBar */
import logo from "./assets/logo-hck.svg";
import ExpIcon from "./assets/exp-icon.png";
import DailyModal from "./components/DailyModal";
import NotiModal from "./components/NotiModal";

/* App CSS */
import "./App.css";

/* --- NAVIGATION DATA --- */
const navigation = [
  { name: "Home", href: "/home" },
  { name: "Tasks", href: "/tasks" },
  { name: "Games", href: "/party" },
  { name: "Villages", href: "/stock" },
  { name: "Meditation", href: "/learning" },
];

/* -------------------------
   Inline NavBar Component
   ------------------------- */
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function NavBarInline() {
  const location = useLocation();
  const [path, setPath] = useState(location?.pathname || "/");
  const [mopen, setOpen] = useState(false);
  const [nopen, setNOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || { level: 1 });
  const userPfp = useSelector((state) => state.pfp?.userPfp);
  const [pfp, setPfp] = useState(user?.pfp || null);

  // scroll-based UI tweak
  const [scrolled, setScrolled] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const clamp = Math.min(1, y / 180);
      setScrolled(clamp);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setPath(location.pathname), [location.pathname]);

  useEffect(() => {
    const curr = JSON.parse(localStorage.getItem("user")) || user;
    setPfp(curr?.pfp || pfp);
    setUser(curr || user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPfp]);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  const openNewPage = () => window.open("http://localhost:9000/", "_blank");
  const handleNOpen = () => setNOpen(true);
  const handleNClose = () => setNOpen(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const scale = 1 - 0.06 * scrolled;

  return (
    <div className="fixed top-0 left-0 w-full z-50 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: -28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ transform: `scale(${scale})`, transition: "transform 240ms cubic-bezier(.2,.9,.2,1)" }}
        className="mx-auto max-w-7xl px-4 pt-4 pointer-events-auto"
        aria-label="Top navigation bar"
      >
        <div
          className="relative rounded-lg border px-5 py-3 flex items-center justify-between"
          style={{
            background: "rgba(10, 10, 25, 0.45)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          {/* LEFT: logo */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12, duration: 0.36 }}
            className="flex items-center gap-3 min-w-0"
          >
            <img src={logo} alt="Aura logo" className="h-8 w-auto flex-shrink-0" />
            <span className="font-semibold text-lg bg-clip-text text-transparent bg-white/90">
              AURA
            </span>
          </motion.div>

          {/* CENTER: links */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-10 px-6">
            {navigation.map((item) => {
              const active = item.href === path;
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  style={{ display: "inline-block" }}
                >
                  <Link
                    to={item.href}
                    className={classNames(
                      "text-sm font-medium transition-all whitespace-nowrap",
                      active ? "text-white" : "text-white/70 hover:text-white"
                    )}
                    aria-current={active ? "page" : undefined}
                    style={{ position: "relative" }}
                  >
                    {item.name}
                    {active && (
                      <span
                        aria-hidden
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: -10,
                          height: 3,
                          borderRadius: 999,
                          background: "linear-gradient(90deg,#8b5cf6 0%, #06b6d4 100%)",
                          opacity: 0.95,
                          transform: "translateY(3px)",
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}

            <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <button
                onClick={toggleDropdown}
                aria-haspopup="true"
                aria-expanded={isOpen}
                className={classNames("flex items-center gap-1 text-sm font-medium transition-colors", isOpen ? "text-white" : "text-white/70 hover:text-white")}
              >
                Helpers
                <FiChevronDown className={classNames("ml-1 transition-transform", isOpen ? "rotate-180" : "")} />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-3 w-56 rounded-2xl"
                    style={{
                      background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
                      border: "1px solid rgba(255,255,255,0.06)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <a href="/investment-portfolio" className="block px-4 py-3 text-sm text-white/80 hover:bg-white/5">IMental Health Enhancer Suggestions</a>
                    <a href="/expense-tracker" className="block px-4 py-3 text-sm text-white/80 hover:bg-white/5">Tasks Tracker</a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: actions */}
          <div className="flex items-center gap-3 min-w-0">
            <IconButton onClick={handleClickOpen} aria-label="Open daily modal" sx={{ backgroundColor: "rgba(255,255,255,0.04)", color: "white", "&:hover": { backgroundColor: "rgba(255,255,255,0.07)" } }} size="small">
              <WhatshotOutlinedIcon fontSize="small" />
            </IconButton>

            <IconButton onClick={handleNOpen} aria-label="Open notifications" sx={{ backgroundColor: "rgba(255,255,255,0.04)", color: "white", "&:hover": { backgroundColor: "rgba(255,255,255,0.07)" } }} size="small">
              <EmailIcon fontSize="small" />
            </IconButton>

            <div className="hidden sm:flex items-center gap-2 px-2">
              <img src={ExpIcon} alt="level icon" className="h-7 w-7" />
              <span className="text-sm text-white/80 font-medium">Level {user?.level ?? 1}</span>
            </div>

            <Button
              variant="contained"
              onClick={() => (window.location.href = "/home")}
              sx={{
                background: "linear-gradient(90deg, rgba(99,102,241,1) 0%, rgba(139,92,246,1) 40%, rgba(139,92,246,0.96) 100%)",
                color: "white",
                borderRadius: "9999px",
                textTransform: "none",
                fontWeight: 700,
                px: 3,
                py: 0.5,
                boxShadow: "0 6px 24px rgba(99,102,241,0.12)",
                "&:hover": { filter: "brightness(0.95)", boxShadow: "0 8px 30px rgba(99,102,241,0.16)" },
              }}
            >
              Start Tracking
            </Button>

            <Menu as="div" className="relative ml-2">
              <div>
                <Menu.Button className="relative flex rounded-full h-9 w-9 overflow-hidden ring-1 ring-white/20" aria-label="Open profile menu">
                  <img src={pfp || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} alt="profile" className="object-cover h-full w-full" />
                </Menu.Button>
              </div>
              <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="absolute right-0 z-50 mt-3 w-48 rounded-2xl py-1 text-white/90"
                  style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(10px)", boxShadow: "0 8px 30px rgba(0,0,0,0.5)" }}>
                  <Menu.Item>{({ active }) => (<Link to="/profile" className={classNames("flex items-center gap-2 px-4 py-2 text-sm", active && "bg-white/5")}><Person fontSize="small" /> Your Profile</Link>)}</Menu.Item>
                  <Menu.Item>{({ active }) => (<Link to="/leaderboard" className={classNames("flex items-center gap-2 px-4 py-2 text-sm", active && "bg-white/5")}><Leaderboard fontSize="small" /> Leaderboard</Link>)}</Menu.Item>
                  <Menu.Item>{({ active }) => (<button onClick={openNewPage} className={classNames("w-full text-left flex items-center gap-2 px-4 py-2 text-sm", active && "bg-white/5")}><Stream fontSize="small" /> Stream</button>)}</Menu.Item>
                  <Menu.Item>{({ active }) => (<button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} className={classNames("w-full text-left flex items-center gap-2 px-4 py-2 text-sm", active && "bg-white/5")}><Logout fontSize="small" /> Sign out</button>)}</Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden mt-3 px-2">
          <Disclosure>
            <div className="flex items-center justify-between">
              <div />
              <Disclosure.Button className="p-2 rounded-lg bg-white/6 hover:bg-white/8" aria-label="Open mobile menu">
                <Bars3Icon className="h-6 w-6 text-white" />
              </Disclosure.Button>
            </div>

            <Transition as={Fragment} enter="transition ease-out duration-180" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Disclosure.Panel className="mt-1 rounded-2xl p-4 space-y-3" style={{ background: "linear-gradient(180deg, rgba(10,11,15,0.9), rgba(10,11,15,0.85))", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.04)" }}>
                {navigation.map((item) => (
                  <Link key={item.name} to={item.href} className="block text-white/85 text-base hover:text-white px-2 py-2 rounded-md">{item.name}</Link>
                ))}

                <div className="pt-2">
                  <Button variant="contained" fullWidth sx={{ background: "linear-gradient(90deg, rgba(99,102,241,1) 0%, rgba(139,92,246,1) 100%)", color: "white", borderRadius: "12px", textTransform: "none", fontWeight: 700, px: 2, py: 1 }}>Start Tracking</Button>
                </div>
              </Disclosure.Panel>
            </Transition>
          </Disclosure>
        </div>

        {/* Modals */}
        {mopen && <DailyModal open={mopen} handleClose={handleClose} />}
        {nopen && <NotiModal open={nopen} handleClose={() => setNOpen(false)} userInfo={user} />}
      </motion.div>
    </div>
  );
}

/* -------------------------
   Inline Footer Component
   ------------------------- */
function FooterInline() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="footer-inner">
        <div className="footer-left">
          <span className="text-gradient font-semibold text-lg">Aura</span>
          <p className="text-xs opacity-80">© {year} All rights reserved.</p>
        </div>

        <div className="footer-links">
          <a href="#" className="footer-link">Privacy</a>
          <a href="#" className="footer-link">Terms</a>
          <a href="#" className="footer-link">Security</a>
          <a href="#" className="footer-link">Cookies</a>
        </div>

        <div className="footer-social">
          <a href="https://youtube.com" target="_blank" rel="noreferrer"><motion.span whileHover={{ scale: 1.1 }}><svg style={{ width: 22, height: 22 }} /></motion.span></a>
          <a href="https://github.com" target="_blank" rel="noreferrer"><motion.span whileHover={{ scale: 1.1 }}><svg style={{ width: 22, height: 22 }} /></motion.span></a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer"><motion.span whileHover={{ scale: 1.1 }}><svg style={{ width: 22, height: 22 }} /></motion.span></a>
          <a href="https://x.com" target="_blank" rel="noreferrer"><motion.span whileHover={{ scale: 1.1 }}><svg style={{ width: 22, height: 22 }} /></motion.span></a>
          <a href="#" target="_blank" rel="noreferrer"><motion.span whileHover={{ scale: 1.1 }}><svg style={{ width: 22, height: 22 }} /></motion.span></a>
        </div>
      </motion.div>
    </footer>
  );
}

/* -------------------------
   Main App
   ------------------------- */
function App() {
  const token = localStorage.getItem("token");
  const isNavBarOpen = useSelector((state) => state.ui.isNavBarOpen);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <ToastContainer
            position="top-center"
            autoClose={1500}
            limit={2}
            hideProgressBar={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
            theme="dark"
          />

          {/* Inlined NavBar */}
          {token && <NavBarInline />}

          {/* Page content */}
          <main className="app-main">
            <Outlet />

            {/* Chatbot floating */}
            {token && <div className="chatbot-container"><StaggeredDropDown /></div>}
          </main>

          {/* Inlined Footer */}
          {token && <FooterInline />}
        </>
      ),
      children: [
        { path: "/", element: <Redirect /> },
        { path: "/login", element: <Login /> },
        { path: "/home", element: <Home /> },
        { path: "/learning", element: <Learning /> },
        { path: "/blog", element: <BlogHome /> },
        { path: "/blog/:id", element: <Blog /> },
        { path: "/profile", element: <Profile /> },
        { path: "/party", element: <Party /> },
        { path: "/stock", element: <StockGame /> },
        { path: "/savings", element: <Savings /> },
        { path: "/tasks", element: <TaskPages /> },
        { path: "/leaderboard", element: <LeaderBoard /> },
        { path: "/monetary", element: <Monetary /> },
        { path: "/budgeting", element: <Budgeting /> },
        { path: "/budgeting/qanda", element: <BudgetingQAndA /> },
        { path: "/investing", element: <Investing /> },
        { path: "/investing/qanda", element: <InvestingQAndA /> },
        { path: "/financing", element: <Financing /> },
        { path: "/financing/qanda", element: <FinancingQAndA /> },
        { path: "/expense-tracker", element: <Tracker /> },
        { path: "/investment-portfolio", element: <InvestPortfolio /> },
      ],
    },
  ]);

  return (
    <AnimatePresence>
      <div className="app-container">
        <RouterProvider router={router} />
      </div>
    </AnimatePresence>
  );
}

export default App;