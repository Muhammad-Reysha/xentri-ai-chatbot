import Sidebar from "@/components/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#07142A]">
      
      {/* SIDEBAR */}
      {/* Biarin sidebar lo tetep kayak gini, ga usah diubah */}
      <Sidebar />

      {/* MAIN CONTENT */}
      {/* KUNCINYA DI SINI: Tambahin pl-20 (buat mobile/layar kecil) dan md:pl-24 (buat PC) */}
      <main className="flex-1 bg-[#07142A] overflow-hidden pl-20 md:pl-24">
        
        {/* Gua ubah px-6 jadi px-4 md:px-6 biar di HP ga terlalu sempit */}
        <div className="h-full w-full flex justify-center items-center px-4 md:px-6">
          {children}
        </div>
        
      </main>
    </div>
  );
}