import type { Metadata } from "next";
import "@/styles/globals.css";
import { ReduxProvider } from "./providers";
import AppInit from "@/components/layout/AppInit";

export const metadata: Metadata = {
  title: "Vipoe - Vietnamese Poetry",
  description: "Thả hồn vào thơ ca Việt Nam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="mdl-js">
      <body>
        <ReduxProvider>
          <AppInit />
          { children }
        </ReduxProvider>
      </body>
    </html>
  );
}
