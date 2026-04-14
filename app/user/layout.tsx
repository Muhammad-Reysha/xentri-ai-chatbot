export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07122C] overflow-x-hidden flex justify-center">
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}