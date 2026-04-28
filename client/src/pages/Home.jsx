import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiBatteryCharging, FiWifi, FiBook, FiX, FiSend } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Left from "../animated-components/Left";
import Center from "../animated-components/Center";
import Right from "../animated-components/Right";
import logo from "../assets/logo-hck.svg";
import Api from "../api";

const Home = () => {
  const [user, setUser] = useState();
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [loading, setLoading] = useState(true);

  // Journal States
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [journals, setJournals] = useState([]);
  const [newJournal, setNewJournal] = useState("");
  const [loadingJournals, setLoadingJournals] = useState(false);

  useEffect(() => {
    if (showJournalModal && userInfo?.email) {
      fetchJournals();
    }
  }, [showJournalModal, userInfo?.email]);

  const fetchJournals = async () => {
    setLoadingJournals(true);
    try {
      const res = await Api.getJournals({ email: userInfo.email });
      if (res.data?.journals) {
        setJournals(res.data.journals);
      }
    } catch (err) {
      console.error("Error fetching journals:", err);
    } finally {
      setLoadingJournals(false);
    }
  };

  const handleAddJournal = async () => {
    if (!newJournal.trim()) return;
    try {
      const res = await Api.addJournal({ email: userInfo.email, content: newJournal });
      if (res.data?.journal) {
        // Add newest journal to top
        setJournals([res.data.journal, ...journals]);
        setNewJournal("");
      }
    } catch (err) {
      console.error("Error adding journal:", err);
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetchUser = async () => {
      if (!userInfo?.email) {
        if (mounted) setLoading(false);
        return;
      }
      try {
        const res = await Api.getUser({ email: userInfo.email });
        console.log("User:", res.data);
        const level = res?.data?.user?.gaming?.level ?? localStorage.getItem("level") ?? 1;
        localStorage.setItem("level", level);
        if (mounted) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUser();
    return () => {
      mounted = false;
    };
  }, [userInfo?.email]);

  return (
    <>
      <section
        className="
           w-screen h-screen 
        text-white flex flex-col md:flex-row items-center justify-between
        bg-gradient-to-br from-[#0e0e1a] via-[#171429] to-[#0b0b1a]
        relative overflow-hidden px-6 md:px-12 pt-24 
        "
      >
        {/* Floating gradient background circles */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-purple-600/30 to-cyan-500/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-gradient-to-tl from-indigo-500/20 to-cyan-400/20 blur-3xl animate-pulse" />

        {/* LEFT SECTION */}
        <div className="flex flex-col items-start justify-start gap-10 md:px-4 mt-8 z-10">
          <Left>
            <h2 className="max-w-lg text-4xl md:text-5xl font-bold leading-tight">
              Understand yourself through your{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                moods and dreams
              </span>
            </h2>
          </Left>

          <Right>
            <p className="text-lg md:text-xl font-medium text-gray-300 max-w-md">
              Don’t just track your mind,{" "}
              <span className="text-white font-semibold">transform it.</span>
            </p>
          </Right>

          <Center>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="mt-2 px-6 py-3 text-lg font-semibold rounded-full 
                         bg-gradient-to-r from-blue-500 to-purple-600 
                         shadow-lg shadow-blue-700/30 transition-transform"
              onClick={() => (window.location.href = "/tasks")}
            >
              Get Started
            </motion.button>
          </Center>
        </div>

        {/* RIGHT SECTION: FLOATING PHONE */}
        <section className="grid place-content-center p-8 z-10">
          <Center>
            <FloatingPhone />
          </Center>
        </section>
      </section>

      {/* Floating Journal Icon */}
      {userInfo?.email && (
        <button
          onClick={() => setShowJournalModal(prev => !prev)}
          style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 99999, pointerEvents: 'auto' }}
          className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-lg hover:scale-110 transition-transform shadow-purple-500/50 cursor-pointer"
        >
          <FiBook className="text-2xl text-white" />
        </button>
      )}

        {/* Journal Modal */}
        {showJournalModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-[#121225] border border-purple-500/30 rounded-2xl w-full max-w-md h-[80vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-purple-500/20 flex justify-between items-center bg-[#171429]">
                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Daily Journal
                </h3>
                <button onClick={() => setShowJournalModal(false)} className="text-gray-400 hover:text-white transition">
                  <FiX className="text-2xl" />
                </button>
              </div>

              {/* Previous Journals (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {loadingJournals ? (
                  <div className="text-center text-gray-400 py-4">Loading...</div>
                ) : journals.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No journal entries yet. Start writing!</div>
                ) : (
                  journals.map((j, i) => (
                    <div key={i} className="bg-[#1e1b36] p-3 rounded-lg border border-purple-500/10">
                      <div className="text-xs text-purple-300 mb-1 font-medium">
                        {new Date(j.date).toLocaleString()}
                      </div>
                      <div className="text-gray-200 text-sm whitespace-pre-wrap">{j.content}</div>
                    </div>
                  ))
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-[#171429] border-t border-purple-500/20">
                <div className="flex gap-2">
                  <textarea
                    value={newJournal}
                    onChange={(e) => setNewJournal(e.target.value)}
                    placeholder="Write your day to day thoughts..."
                    className="flex-1 bg-[#121225] text-white text-sm rounded-lg p-3 border border-purple-500/30 focus:outline-none focus:border-purple-400 resize-none h-20"
                  />
                  <button
                    onClick={handleAddJournal}
                    disabled={!newJournal.trim()}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-lg self-end disabled:opacity-50 hover:bg-purple-500 transition cursor-pointer"
                  >
                    <FiSend className="text-white text-xl" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
    </>
  );
};

// Floating phone mockup (dark themed)
const FloatingPhone = () => {
  return (
    <div
      style={{
        transformStyle: "preserve-3d",
        transform: "rotateY(-25deg) rotateX(15deg)",
      }}
      className="rounded-[24px] bg-transparent"
    >
      <motion.div
        initial={{
          transform: "translateZ(8px) translateY(-2px)",
        }}
        animate={{
          transform: "translateZ(32px) translateY(-8px)",
        }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 2.2,
          ease: "easeInOut",
        }}
        className="relative h-96 w-56 rounded-[24px] border border-white/20 bg-gradient-to-br from-[#0f0f1e] via-[#161b2f] to-[#6c6ca8] p-1"
      >
        <HeaderBar />
        <Screen />
      </motion.div>
    </div>
  );
};

// Status bar at the top of the phone
const HeaderBar = () => {
  return (
    <>
      <div className="absolute left-[50%] top-2.5 z-10 h-2 w-16 -translate-x-[50%] rounded-md bg-gray-700"></div>
      <div className="absolute right-3 top-2 z-10 flex gap-2 text-gray-400">
        <FiWifi />
        <FiBatteryCharging />
      </div>
    </>
  );
};

// Phone screen content
const Screen = () => {
  const navigate = useNavigate();

  return (
    <div className="relative z-0 grid h-full w-full place-content-center overflow-hidden rounded-[20px] bg-gradient-to-b from-[#121225] to-[#080812]">
      <motion.img
        src={logo}
        alt="Aura logo"
        className="w-20 mx-auto drop-shadow-[0_0_20px_rgba(139,92,246,0.6)]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate("/home")}
        className="absolute bottom-4 left-4 right-4 rounded-lg 
                   border border-purple-400/40 text-sm font-semibold 
                   text-white py-2 bg-gradient-to-r from-indigo-600/70 to-purple-700/70
                   backdrop-blur-md hover:shadow-[0_0_15px_rgba(139,92,246,0.6)]"
      >
        Enter Aura
      </motion.button>
    </div>
  );
};

export default Home;
