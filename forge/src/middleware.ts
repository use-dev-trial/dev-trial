import { NextResponse } from 'next/server';

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

import { ROUTES } from '@/lib/constants';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  // Add any other specific public routes here (e.g., landing page '/')
]);

const isHomeRoute = createRouteMatcher([
  '/challenges(.*)',
  '/settings(.*)',
  // Add any other routes inside (home) that need this protection
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }
  const { userId, orgId } = await auth();

  if (!userId) {
    await auth.protect();
  }

  if (!orgId && isHomeRoute(req)) {
    const selectionUrl = new URL(ROUTES.SELECT_ORGANIZATION, req.url);
    selectionUrl.searchParams.set('redirect_url', req.nextUrl.pathname);
    return NextResponse.redirect(selectionUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
