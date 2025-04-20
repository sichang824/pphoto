import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the current path is /editor exactly
  if (request.nextUrl.pathname === '/editor') {
    // Get the user agent
    const userAgent = request.headers.get('user-agent') || '';
    
    // Simple mobile detection - can be more sophisticated if needed
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    // Redirect to the appropriate editor
    if (isMobile) {
      return NextResponse.redirect(new URL('/editor/mobile', request.url));
    } else {
      // Keep the same URL for desktop (PC) users
      return NextResponse.next();
    }
  }
  
  return NextResponse.next();
}

// Match only on the /editor path
export const config = {
  matcher: ['/editor'],
};
