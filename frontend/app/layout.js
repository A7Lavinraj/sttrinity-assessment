import "./globals.css";

export const metadata = {
  title: "Idea Board - Share Your Ideas",
  description: "A collaborative platform for sharing and voting on ideas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
