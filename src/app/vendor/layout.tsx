export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {children}
    </div>
  );
}
