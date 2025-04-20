/**
 * Detects if the user agent string indicates a mobile device
 */
export function isMobileDevice(userAgent: string): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

/**
 * Client-side detection of mobile devices
 * Can be used with useEffect to detect device type on the client
 */
export function detectMobileClient(): boolean {
  if (typeof window === 'undefined') return false;
  
  return isMobileDevice(window.navigator.userAgent);
}
