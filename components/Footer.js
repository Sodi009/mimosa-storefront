export default function Footer() {
  return (
    <footer className="site-footer wrap">
      <span>© {new Date().getFullYear()} Mimosa BKK</span>
      <div className="footer-right">
        <span>Bangkok → Dubai</span>
        <a
          href="https://www.facebook.com/people/Mimosa-BKK-Collection/61571651470942/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Mimosa BKK on Facebook"
          className="footer-social"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M22 12.06C22 6.53 17.52 2.04 12 2.04S2 6.53 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34v7.03c4.78-.79 8.44-4.94 8.44-9.94z" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
