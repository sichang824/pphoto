import localFont from "next/font/local";

export const geistSans = localFont({
  src: "./GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
export const geistMono = localFont({
  src: "./GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
export const vt323Font = localFont({
  src: "./VT323-Regular.ttf",
  variable: "--font-vt323",
  weight: "400",
});

export const pixelFont = vt323Font;
