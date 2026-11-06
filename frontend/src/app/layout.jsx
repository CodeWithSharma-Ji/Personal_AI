import "./globals.css";

export const metadata = {
  title: "Studio — Intelligence & Architecture",
  description: "Next-generation intelligence interface engineered with clean decoupled architecture and high-throughput inference.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth bg-[#f5f5f7]">
      <body className="min-h-full flex flex-col bg-[#f5f5f7] text-[#1d1d1f] antialiased selection:bg-black/10 selection:text-black">
        {children}
      </body>
    </html>
  );
}
