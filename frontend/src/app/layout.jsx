import "./globals.css";

export const metadata = {
  title: "Chat",
  description: "Intelligent conversational workspace.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth bg-[#f5f5f7]">
      <body className="h-full flex flex-col bg-[#fbfbfd] text-[#1d1d1f] antialiased selection:bg-black/10 selection:text-black">
        {children}
      </body>
    </html>
  );
}
