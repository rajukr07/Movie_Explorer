import { FaGithub, FaHeart, FaLinkedin } from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>Movie Explorer</h2>

          <p>
            Discover, search, and save your favorite movies through a modern
            React application powered by the OMDb API.
          </p>
        </div>

        <div className="footer-links">
          <h3>Connect</h3>

          <a
            href="https://github.com/rajukr07"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Raju Kumar's GitHub profile"
          >
            <FaGithub aria-hidden="true" />
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/rajukumar07"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Raju Kumar's LinkedIn profile"
          >
            <FaLinkedin aria-hidden="true" />
            LinkedIn
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {currentYear} Movie Explorer. Made with{" "}
          <FaHeart className="heart-icon" aria-label="love" /> by{" "}
          <a
            href="https://github.com/rajukr07"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-author"
          >
            Raju Kumar
          </a>
          .
        </p>
      </div>
    </footer>
  );
}

export default Footer;