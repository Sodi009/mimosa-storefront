export default function Footer() {
  return (
    <footer className="site-footer wrap">
      <span>© {new Date().getFullYear()} Mimosa BKK</span>
      <div className="footer-social-group">
        <a
          href="https://www.facebook.com/people/Mimosa-BKK-Collection/61571651470942/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Mimosa BKK on Facebook"
          className="footer-social"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
            <path d="M22 12.06C22 6.53 17.52 2.04 12 2.04S2 6.53 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34v7.03c4.78-.79 8.44-4.94 8.44-9.94z" />
          </svg>
        </a>
        <a
          href="https://www.tiktok.com/@mimosa1872"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Mimosa BKK on TikTok"
          className="footer-social"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
            <path d="M16.5 2h-3.2v13.6a2.9 2.9 0 1 1-2.06-2.78v-3.3a6.2 6.2 0 1 0 5.26 6.13V9.1a7.9 7.9 0 0 0 4.5 1.4V7.3a4.6 4.6 0 0 1-4.5-4.6V2Z" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
