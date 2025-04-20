"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { detectMobileClient } from "@/lib/utils/device";

interface DeviceRedirectProps {
  mobilePathPrefix?: string;
  desktopPathPrefix?: string;
}

/**
 * Component that handles client-side redirection based on device type
 * Use this as a fallback for when middleware detection isn't sufficient
 */
export default function DeviceRedirect({
  mobilePathPrefix = "/editor/mobile",
  desktopPathPrefix = "/editor",
}: DeviceRedirectProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Only run this on specific paths where we want device detection
    if (pathname !== "/editor" && 
        !pathname.startsWith("/editor/mobile") && 
        pathname !== desktopPathPrefix) {
      return;
    }
    
    const isMobile = detectMobileClient();
    const isMobilePath = pathname.startsWith("/editor/mobile");
    
    // Redirect mobile users to mobile path
    if (isMobile && !isMobilePath && pathname === "/editor") {
      router.replace(mobilePathPrefix);
    }
    
    // Redirect desktop users to desktop path
    if (!isMobile && isMobilePath) {
      router.replace(desktopPathPrefix);
    }
  }, [pathname, router, mobilePathPrefix, desktopPathPrefix]);
  
  // This component doesn't render anything
  return null;
}
