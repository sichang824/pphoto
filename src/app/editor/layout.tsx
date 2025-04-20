import { isMobileDevice } from "@/lib/utils/device";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Editor",
};

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This is a server component, so we can check headers
  // This serves as a backup in case middleware fails
  const headersList = await headers();

  // Get the request headers in an async component
  const userAgent = headersList.get("user-agent") || "";

  // Only redirect if we're on the exact /editor path (not in child routes)
  // This check ensures we don't create a redirect loop
  const pathname = headersList.get("x-invoke-path") || "";
  if (pathname === "/editor" && isMobileDevice(userAgent)) {
    redirect("/editor/mobile");
  }

  return <main>{children}</main>;
}
