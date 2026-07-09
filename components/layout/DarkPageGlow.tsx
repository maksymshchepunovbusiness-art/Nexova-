/**
 * Single full-page background layer for both light and dark mode.
 * position:fixed + z-index:-1 keeps it behind all content and the cursor trail.
 * The class "page-glow" is targeted in globals.css with theme-specific radial
 * gradients — light mode gets a soft indigo ambient; dark mode gets the wide
 * indigo radial on the #0D0D1A base.
 */
export default function DarkPageGlow() {
  return (
    <div
      aria-hidden
      className="page-glow fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}
