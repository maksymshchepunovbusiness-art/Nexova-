import { PageContent } from '@/components/ui/auto-pro-device';

// Internal, non-localized route used only to capture the high-res AutoPro
// "device screen" asset for the S2 dive scene (see scripts/capture-dive-screen.mjs).
// Excluded from i18n routing in proxy.ts. Not linked from anywhere in the app.
export default function DiveCapturePage() {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <title>dive-capture</title>
      </head>
      <body style={{ margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ width: 1280 }}>
          <PageContent />
        </div>
      </body>
    </html>
  );
}
