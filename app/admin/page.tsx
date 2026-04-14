"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AdminPage() {
  {/* LOGIC TYPING ANIMATION */}
  const fullText = `Halo Telyutizen! Butuh informasi apa? Aku siap membantu lohh!`;
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 35); // Kecepatan ketik (35ms)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center overflow-x-hidden p-4 sm:p-8 bg-[#07122C]">
      
      <div className="max-w-3xl w-full text-center flex flex-col items-center">
        
        {/* 1. ANIMASI PADA JUDUL (Slide Down + Fade In) */}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold text-white leading-tight"
        >
          Selamat Datang <br />
          di <span className="bg-gradient-to-r from-[#68E6A8] to-[#2AA0B6] bg-clip-text text-transparent">
            Xerti AI
          </span>
        </motion.h1>

        <div className="mt-8 md:mt-10 w-full flex flex-col items-center">
          
          {/* 2. BUBBLE CHAT DENGAN TYPING EFFECT */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="border border-white/20 px-6 py-3 md:py-4 rounded-3xl md:rounded-full text-white/90 text-sm md:text-base backdrop-blur-sm bg-white/5 w-fit max-w-full break-words text-center flex items-center justify-center min-h-[50px]"
          >
            {typedText}
            {/* Cursor kedap-kedip biar makin real */}
            <span className="inline-block w-1.5 h-4 ml-1 bg-[#2AA0B6] animate-pulse"></span>
          </motion.div>

          {/* 3. INPUT BAR */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-6 md:mt-8 w-full max-w-xl relative"
          >
            <input
              type="text"
              placeholder="Butuh informasi apa?"
              className="w-full bg-white/5 border border-white/20 rounded-full px-6 py-4 text-white outline-none focus:border-[#68E6A8]/50 focus:ring-1 focus:ring-[#68E6A8]/50 transition-all text-sm md:text-base shadow-lg"
            />
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}