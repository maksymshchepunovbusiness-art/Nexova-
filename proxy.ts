import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // dive-capture is an internal, non-localized screenshot-capture route (see
  // app/dive-capture) used to generate the S2 dive-scene asset — excluded from
  // i18n routing so it can render standalone.
  matcher: ['/((?!_next|_vercel|api|dive-capture|.*\\..*).*)'],
};
