import { Nunito } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "TaskTracker",
  description: "An internal TaskTracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-sans antialiased`}>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
