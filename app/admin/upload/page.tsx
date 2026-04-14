"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const MAX_SIZE = 300 * 1024 * 1024; // 300MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    // cek format file
    if (selectedFile.type !== "application/pdf") {
      alert("Hanya file PDF yang diperbolehkan!");
      return;
    }

    // cek ukuran file
    if (selectedFile.size > MAX_SIZE) {
      alert("Ukuran file maksimal 300MB!");
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !title || !category) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("category", category);

      const res = await fetch("http://localhost:8000/api/upload-dataset/", {
  method: "POST",
  body: formData,
});

      if (!res.ok) throw new Error("Upload gagal");

      alert("Dataset berhasil diupload!");

      // reset form
      setFile(null);
      setTitle("");
      setCategory("");

    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat upload");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-semibold mb-8">
        Upload Dataset AI
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        
        {/* Upload File */}
        <div>
          <label className="block mb-2">Upload PDF</label>

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full bg-[#0f2547] p-3 rounded-lg"
          />

          {/* Preview File */}
          {file && (
            <p className="mt-2 text-sm text-green-400">
              File dipilih: {file.name}
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block mb-2">Judul</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#0f2547] p-3 rounded-lg"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-2">Kategori</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#0f2547] p-3 rounded-lg"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#68E6A8] to-[#2AA0B6] text-black font-semibold"
        >
          {loading ? "Uploading..." : "Submit Dataset"}
        </button>

      </form>
    </div>
  );
}