export const metadata = {
  title: "Personal AI API",
  description: "API service for the Personal AI chat application.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}