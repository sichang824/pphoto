import MainFooter from "@/components/MainFooter";
import MainHeader from "@/components/MainHeader";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MainHeader />
      {children}
      <MainFooter />
    </>
  );
}
