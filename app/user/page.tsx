"use client";

import Image from "next/image";
import { FaPaperPlane, FaCamera, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import remarkGfm from "remark-gfm";

const fullText = `Halo Telyutizen! Butuh informasi apa? Aku siap membantu lohh!`;

// Normalisasi: pastikan single \n jadi double \n agar markdown render paragraf
const normalizeResponse = (text: string) => {
  const decoded = text.replace(/\\n/g, "\n");

  // Step 1: Ubah semua unicode bullet jadi "- "
  const bulleted = decoded.replace(/^[•·●▪▸◆]\s*/gm, "- ");

  // Step 2: Merge baris yang HANYA berisi "-" dengan baris teks berikutnya
  const lines = bulleted.split("\n");
  const merged: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (trimmed === "-") {
      // Cari baris non-kosong berikutnya
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === "") j++;

      if (j < lines.length) {
        merged.push("- " + lines[j].trim());
        i = j; // skip baris yang sudah digabung
      }
      continue;
    }

    merged.push(lines[i]);
  }

  // Step 3: Hapus blank line di antara list item yang berurutan
  const result: string[] = [];
  for (let i = 0; i < merged.length; i++) {
    const isEmpty = merged[i].trim() === "";
    const prevIsList = merged[i - 1]?.trim().startsWith("- ") ?? false;
    const nextIsList = merged[i + 1]?.trim().startsWith("- ") ?? false;

    if (isEmpty && prevIsList && nextIsList) continue; // buang blank antar list

    result.push(merged[i]);
  }

  return result.join("\n").replace(/\n{3,}/g, "\n\n");
};

export default function Home() {
  const [typedText, setTypedText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
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

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setAiResponse("");
    setMessage("");
    removeImage();

    try {
      const response = await fetch("http://localhost:8000/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed, model: "model1" }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Akumulasi buffer dulu, jangan langsung split
        buffer += decoder.decode(value, { stream: true });

        // SSE events dipisahkan oleh "\n\n"
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? ""; // Simpan event yang belum lengkap

        for (const event of events) {
          for (const line of event.split("\n")) {
            if (line.startsWith("data: ")) {
              const text = line.slice(6);
              if (text === "[DONE]") continue;
              setAiResponse((prev) => prev + text);
            }
          }
        }
      }

      // Proses sisa buffer
      if (buffer.startsWith("data: ")) {
        const text = buffer.slice(6);
        if (text !== "[DONE]") {
          setAiResponse((prev) => prev + text);
        }
      }
    } catch (error) {
      console.error("Failed to send:", error);
      setAiResponse("Terjadi kesalahan, coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
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
    <main className="h-screen w-full md:pl-20 bg-[#07122C] text-white relative overflow-hidden flex flex-col">

      {/* 1. AREA ATAS */}
      <div className="flex-1 overflow-hidden w-full pl-6 md:pl-16 lg:pl-24 pr-6 flex flex-col justify-center z-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-10 lg:gap-20 max-w-[1100px] mb-8">

          <div className="flex flex-col w-full max-w-[700px]">
            <h1 className="text-left text-4xl sm:text-5xl md:text-[60px] font-semibold leading-snug md:leading-[66px] mb-10 mt-10">
              Selamat Datang <br />
              di{" "}
              <span className="bg-gradient-to-r from-[#68E6A8] via-[#5A72B5] to-[#2AA0B6] bg-clip-text text-transparent">
                XertiAI
              </span>
            </h1>

            <div className="flex flex-col gap-4 mb-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block bg-gradient-to-br from-[#0a193a] to-[#071125] border border-[#1e3a68] shadow-[0_4px_20px_rgba(42,160,182,0.15)] px-5 py-4 rounded-2xl rounded-tl-sm max-w-[100%] sm:max-w-[95%] break-words"
              >
                <div className="text-gray-100 text-[14px] sm:text-[15px] leading-relaxed">
                  {aiResponse ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkMath, remarkGfm]}
                      rehypePlugins={[rehypeKatex, rehypeRaw]}
                      components={{
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-3">
                            <table className="w-full text-sm border-collapse">
                              {children}
                            </table>
                          </div>
                        ),
                        thead: ({ children }) => (
                          <thead className="bg-[#1e3a68] text-[#68E6A8]">{children}</thead>
                        ),
                        th: ({ children }) => (
                          <th className="border border-[#2a4a7f] px-3 py-2 text-left font-semibold">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="border border-[#1e3a68] px-3 py-2 text-gray-200">
                            {children}
                          </td>
                        ),
                        tr: ({ children }) => (
                          <tr className="even:bg-[#0a193a]/50">{children}</tr>
                        ),
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0">{children}</p>
                        ),
                        strong: ({ children }) => (
                          <strong className="text-white font-semibold">{children}</strong>
                        ),
                        sub: ({ children }) => (
                          <sub className="text-[#68E6A8]">{children}</sub>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-gray-100">{children}</li>
                        ),
                        code: ({ children }) => (
                          <code className="bg-[#1e3a68] px-1.5 py-0.5 rounded text-[#68E6A8] font-mono text-xs">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-[#1e3a68] p-3 rounded-lg overflow-x-auto my-2 text-xs font-mono">
                            {children}
                          </pre>
                        ),
                      }}
                    >
                      {normalizeResponse(aiResponse)}
                    </ReactMarkdown>
                  ) : (
                    <span>{typedText}</span>
                  )}
                  {(isLoading || (!aiResponse && typedText.length < fullText.length)) && (
                    <span className="inline-block w-1.5 h-4 ml-1 bg-[#2AA0B6] animate-pulse" />
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          <div className="hidden md:block -ml-120 w-[250px] h-[250px] md:w-[450px] md:h-[450px] shrink-0 opacity-90 z-0 relative">
            <Image
              src="/cancer/logo/logo.png"
              alt="Logo"
              fill
              className="object-contain select-none"
              priority
            />
          </div>

        </div>
      </div>

      {/* 2. AREA BAWAH (INPUT) */}
      <div className="w-full pl-6 md:pl-16 lg:pl-24 pr-6 pb-8 pt-4 shrink-0 z-20 flex justify-start">
        <div className="w-full max-w-[900px] flex flex-col relative">

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

          <div className="bg-[#0b1b3d] border border-gray-600 focus-within:border-[#2AA0B6] focus-within:shadow-[0_0_15px_rgba(42,160,182,0.2)] transition-all duration-300 rounded-full w-full flex items-center px-4 py-2 sm:py-3 z-10 relative">
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
              className="mr-3 p-2 text-gray-400 hover:text-[#2AA0B6] transition-colors rounded-full hover:bg-[#1e3a68]/50"
              title="Upload Foto"
            >
              <FaCamera size={18} />
            </button>
            <input
              type="text"
              placeholder="Butuh informasi apa?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-1 bg-transparent border-none outline-none text-gray-100 placeholder-gray-400 text-sm sm:text-[15px] px-3 disabled:opacity-50"
            />
            <motion.button
              onClick={handleSend}
              disabled={isLoading || !message.trim()}
              initial={{ scale: 0.85 }}
              whileHover={{ scale: 1.05, backgroundColor: "#2AA0B6" }}
              whileTap={{ scale: 0.95 }}
              className="ml-2 bg-[#1e3a68] text-white p-3 rounded-full flex items-center justify-center transition-colors shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FaPaperPlane size={16} />
              )}
            </motion.button>
          </div>

        </div>
      </div>

    </main>
  );
}