"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaPalette, FaImage, FaSave, FaPaperPlane, FaRobot } from "react-icons/fa";

export default function AppearanceSettings() {
  // STATE BUAT KUSTOMISASI
  const [botName, setBotName] = useState("Xerti AI");
  const [avatarUrl, setAvatarUrl] = useState("/cancer/logo/logo.png"); // Default logo lo
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // PALET WARNA (Bisa ditambahin sesuka lo)
  const colorThemes = [
    { name: "Tosca Ocean (Default)", from: "#68E6A8", to: "#2AA0B6", bg: "from-[#68E6A8] to-[#2AA0B6]" },
    { name: "Purple Nebula", from: "#A78BFA", to: "#6366F1", bg: "from-[#A78BFA] to-[#6366F1]" },
    { name: "Sunset Orange", from: "#FBBF24", to: "#EA580C", bg: "from-[#FBBF24] to-[#EA580C]" },
    { name: "Emerald City", from: "#34D399", to: "#059669", bg: "from-[#34D399] to-[#059669]" },
  ];
  
  const [activeTheme, setActiveTheme] = useState(colorThemes[0]);

  // FUNGSI GANTI AVATAR
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto flex justify-center py-10 px-4 sm:px-8 bg-[#07122C] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      <div className="max-w-6xl w-full flex flex-col pb-20">
        
        {/* HEADER PAGE */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <FaPalette className="text-[#2AA0B6]" /> Kustomisasi Tampilan
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Ubah identitas visual, warna tema, dan avatar untuk widget chatbot Anda.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ========================================= */}
          {/* BAGIAN KIRI: PANEL KONTROL (Makan 7 Kolom) */}
          {/* ========================================= */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-7 space-y-6"
          >
            
            {/* CARD 1: IDENTITAS */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <FaRobot className="text-gray-400" /> Identitas Utama
              </h2>
              
              <div className="space-y-6">
                {/* Ganti Nama */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nama Tampilan Chatbot</label>
                  <input 
                    type="text" value={botName} onChange={(e) => setBotName(e.target.value)}
                    className="w-full bg-[#0b1b3d] border border-gray-600 focus:border-[#2AA0B6] rounded-xl px-4 py-3 text-white outline-none transition-all"
                  />
                </div>

                {/* Ganti Avatar */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Foto Profil (Avatar)</label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[#0b1b3d] border-2 border-white/20 shrink-0">
                      <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                    </div>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      <FaImage /> Unggah Foto Baru
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: TEMA WARNA */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <FaPalette className="text-gray-400" /> Tema Warna Chat
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {colorThemes.map((theme, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTheme(theme)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      activeTheme.name === theme.name 
                        ? "border-[#2AA0B6] bg-[#2AA0B6]/10" 
                        : "border-white/10 hover:border-white/30 bg-white/5"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${theme.bg} shadow-md`}></div>
                    <span className="text-sm text-white font-medium">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* TOMBOL SIMPAN */}
            <div className="flex justify-start">
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 bg-gradient-to-r ${activeTheme.bg} text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all`}
              >
                <FaSave /> Simpan Tampilan
              </motion.button>
            </div>

          </motion.div>

          {/* ========================================= */}
          {/* BAGIAN KANAN: LIVE PREVIEW (Makan 5 Kolom) */}
          {/* ========================================= */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            {/* MOCKUP HP / WIDGET */}
            <div className="w-full max-w-[350px] h-[600px] bg-[#07122C] border-[8px] border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col">
              
              {/* Header Chat Widget */}
              <div className={`bg-gradient-to-r ${activeTheme.bg} p-4 flex items-center gap-3 shadow-md`}>
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/20 border border-white/50">
                  <Image src={avatarUrl} alt="Preview Avatar" fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">{botName}</h3>
                  <p className="text-white/80 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Online
                  </p>
                </div>
              </div>

              {/* Area Chat */}
              <div className="flex-1 bg-[#0b1b3d] p-4 flex flex-col gap-4 overflow-y-auto">
                {/* Chat Bot */}
                <div className="flex items-start gap-2 max-w-[85%]">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 mt-1">
                    <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                  </div>
                  <div className="bg-white/10 text-white text-sm p-3 rounded-2xl rounded-tl-sm border border-white/5 shadow-sm">
                    Halo! Ada yang bisa {botName} bantu hari ini?
                  </div>
                </div>

                {/* Chat User */}
                <div className="self-end max-w-[85%]">
                  <div className={`bg-gradient-to-r ${activeTheme.bg} text-white text-sm p-3 rounded-2xl rounded-tr-sm shadow-md`}>
                    Wah, tampilannya keren banget min! 🔥
                  </div>
                </div>
              </div>

              {/* Input Bar */}
              <div className="bg-[#07122C] p-3 border-t border-white/10">
                <div className="bg-white/5 border border-white/10 rounded-full flex items-center px-3 py-2">
                  <input type="text" placeholder="Ketik pesan..." disabled className="flex-1 bg-transparent text-sm text-white outline-none" />
                  <button className={`w-8 h-8 rounded-full bg-gradient-to-r ${activeTheme.bg} flex items-center justify-center text-white ml-2`}>
                    <FaPaperPlane size={12} />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}