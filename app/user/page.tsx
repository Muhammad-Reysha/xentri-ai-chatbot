"use client";

import Image from "next/image";
import { FaPaperPlane, FaCamera, FaTimes } from "react-icons/fa"; 
import { motion, AnimatePresence } from "framer-motion"; 
import { useEffect, useState, useRef } from "react"; 

const fullText = `Halo Telyutizen! Butuh informasi apa? Aku siap membantu lohh!`;

export default function Home() {
  const [typedText, setTypedText] = useState("");
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

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 35);

    return () => clearInterval(interval);
  }, []);

  return (
    // FIX 1: Pake items-center di main biar seluruh isi web bener-bener terpusat
    <main className="h-[100dvh] w-full bg-[#07122C] text-white relative overflow-hidden flex flex-col items-center">
      
      {/* FIX 2: BUNGKUSAN UTAMA (Wajib max-w biar atas dan bawah punya batas pinggir yang sama persis) */}
      <div className="w-full max-w-[1000px] h-full flex flex-col px-5 sm:px-10 lg:px-0">

        {/* 1. AREA ATAS (Teks Kiri & Logo Kanan) */}
        {/* FIX 3: Pake flex justify-between biar teks mentok kiri, logo mentok kanan secara simetris */}
        <div className="flex-1 flex items-center justify-between w-full z-10 gap-4">
          
          <div className="flex flex-col w-full max-w-[650px]">
            <h1 className="text-left text-[32px] sm:text-5xl md:text-[60px] font-semibold leading-[1.2] md:leading-[66px] mb-6 md:mb-10">
              Selamat Datang <br />
              di{" "}
              <span className="bg-gradient-to-r from-[#68E6A8] via-[#5A72B5] to-[#2AA0B6] bg-clip-text text-transparent">
                XertiAI
              </span>
            </h1>

            <div className="flex flex-col gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block bg-gradient-to-br from-[#0a193a] to-[#071125] border border-[#1e3a68] shadow-[0_4px_20px_rgba(42,160,182,0.15)] px-4 sm:px-5 py-3 sm:py-4 rounded-2xl rounded-tl-sm w-fit max-w-full break-words"
              >
                <p className="text-gray-100 text-[13px] sm:text-[15px] leading-relaxed flex items-center flex-wrap">
                  {typedText}
                  <span className="inline-block w-1.5 h-4 ml-1 bg-[#2AA0B6] animate-pulse"></span>
                </p>
              </motion.div>
            </div>
          </div>

          {/* FIX 4: Margin negatif dihapus biar ukuran logonya konsisten & ga merusak centering */}
          <div className="hidden md:block w-[250px] h-[250px] lg:w-[350px] lg:h-[350px] shrink-0 opacity-90 z-0 relative">
            <Image
              src="/cancer/logo/logo.png"
              alt="Logo"
              fill
              className="object-contain select-none"
              priority
            />
          </div>

        </div>

        {/* 2. AREA BAWAH (INPUT) */}
        {/* FIX 5: Nggak perlu flex-col aneh-aneh lagi karena udah dibungkus div max-w-[1000px] di atas */}
        <div className="w-full pb-6 md:pb-8 pt-2 shrink-0 z-20 relative">

          <AnimatePresence>
            {selectedImage && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.2 } }}
                className="absolute bottom-full mb-3 sm:mb-4 left-0 bg-[#0a193a]/60 backdrop-blur-md border border-[#1e3a68] p-2 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50"
              >
                <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-lg overflow-hidden">
                  <Image src={selectedImage} alt="Preview" fill className="object-cover" />
                </div>
                <button 
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-red-500 text-white rounded-full p-1 sm:p-1.5 hover:bg-red-600 transition-colors shadow-lg border border-white/20"
                >
                  <FaTimes size={10} className="sm:w-3 sm:h-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-[#0b1b3d] border border-gray-600 focus-within:border-[#2AA0B6] focus-within:shadow-[0_0_15px_rgba(42,160,182,0.2)] transition-all duration-300 rounded-[2rem] w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 z-10 relative">
            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="mr-2 sm:mr-3 p-2 shrink-0 text-gray-400 hover:text-[#2AA0B6] transition-colors rounded-full hover:bg-[#1e3a68]/50"
              title="Upload Foto"
            >
              <FaCamera size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <input
              type="text"
              placeholder="Butuh informasi apa?"
              className="flex-1 min-w-0 bg-transparent border-none outline-none text-gray-100 placeholder-gray-400 text-[13px] sm:text-[15px] px-1 sm:px-3"
            />
            <motion.button
              initial={{ scale: 0.85 }}
              whileHover={{ scale: 1.05, backgroundColor: "#2AA0B6" }}
              whileTap={{ scale: 0.95 }}
              className="ml-1 sm:ml-2 shrink-0 bg-[#1e3a68] text-white p-2.5 sm:p-3 rounded-full flex items-center justify-center transition-colors shadow-lg"
            >
              <FaPaperPlane size={14} className="sm:w-[16px] sm:h-[16px]" />
            </motion.button>
          </div>

        </div>

      </div>
    </main> 
  );
}