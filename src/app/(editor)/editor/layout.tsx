export const metadata = {
  title: "Editor",
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
