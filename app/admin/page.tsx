"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { FaPaperPlane, FaCamera, FaTimes } from "react-icons/fa";

// Dipindahin ke sini biar aman dari error React useEffect
const fullText = `Halo Telyutizen! Butuh informasi apa? Aku siap membantu lohh!`;

export default function AdminPage() {
  // STATE ANIMASI TYPING
  const [typedText, setTypedText] = useState("");

  // STATE FITUR CAPTURE GAMBAR
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // LOGIC TYPING ANIMATION
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
            <span className="inline-block w-1.5 h-4 ml-1 bg-[#2AA0B6] animate-pulse"></span>
          </motion.div>

          {/* 3. INPUT BAR + FITUR KAMERA MENGAPUNG */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-6 md:mt-8 w-full max-w-xl relative flex flex-col items-center text-left"
          >
            
            {/* PREVIEW GAMBAR (Ngambang di atas input bar) */}
            <AnimatePresence>
              {selectedImage && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.2 } }}
                  className="absolute bottom-full mb-4 left-0 bg-[#0a193a]/60 backdrop-blur-md border border-[#1e3a68] p-2 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50"
                >
                  <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-lg overflow-hidden">
                    <Image src={selectedImage} alt="Preview" fill className="object-cover" />
                  </div>
                  <button 
                    onClick={removeImage}
                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg border border-white/20"
                  >
                    <FaTimes size={12} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* BAR INPUT UTAMA DENGAN ICON */}
            <div className="bg-[#0b1b3d] border border-gray-600 focus-within:border-[#2AA0B6] focus-within:shadow-[0_0_15px_rgba(42,160,182,0.2)] transition-all duration-300 rounded-full w-full flex items-center px-4 py-2 sm:py-3 z-10 relative">
              
              {/* HIDDEN INPUT BUAT FILE GAMBAR */}
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden" 
              />
              
              {/* TOMBOL KAMERA */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="mr-3 p-2 text-gray-400 hover:text-[#2AA0B6] transition-colors rounded-full hover:bg-[#1e3a68]/50"
                title="Upload Foto"
              >
                <FaCamera size={18} />
              </button>
              
              <input
                type="text"
                placeholder="Butuh informasi apa?"
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 text-sm sm:text-[15px] px-3"
              />
              
              {/* TOMBOL SEND */}
              <motion.button
                initial={{ scale: 0.85 }}
                whileHover={{ scale: 1.05, backgroundColor: "#2AA0B6" }}
                whileTap={{ scale: 0.95 }}
                className="ml-2 bg-[#1e3a68] text-white p-3 rounded-full flex items-center justify-center transition-colors shadow-lg"
              >
                <FaPaperPlane size={16} />
              </motion.button>
            </div>

          </motion.div>
          
        </div>
      </div>
    </div>
  );
}