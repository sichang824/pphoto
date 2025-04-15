export const metadata = {
  title: 'Editor',
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <html lang="en">
    <body>
      <main>{children}</main>
    </body>
  </html>;
}
