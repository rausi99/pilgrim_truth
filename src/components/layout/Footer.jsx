import { Mail, MapPin, Play, Send } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">

        <div>
          <div className="footer-brand">PILGRIM TRUTH</div>
          <p>
            Seeking truth, studying Scripture, and living with purpose.
          </p>
        </div>

        <div>
          <h4>Explore</h4>
          <Link to="/bible-studies">Bible Studies</Link>
          <Link to="/prophecy">Prophecy</Link>
          <Link to="/history">Bible History</Link>
          <Link to="/christian-living">Christian Living</Link>
        </div>

        <div>
          <h4>Resources</h4>
          <Link to="/articles">Articles</Link>
          <Link to="/videos">Videos</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/discussions">Discussions</Link>
        </div>

        <div>
          <h4>Connect</h4>

          <div className="footer-contact">
            <a href="#contact">
              <Mail size={16} />
              Contact Us
            </a>

            <a href="#location">
              <MapPin size={16} />
              Our Community
            </a>

            <Link to="/videos">
              <Play size={16} />
              Watch Videos
            </Link>

            <a href="#newsletter">
              <Send size={16} />
              Newsletter
            </a>
          </div>
        </div>

      </div>

      <div className="container footer-bottom">
        <span>© 2026 Pilgrim Truth. All rights reserved.</span>
        <span>Built for seekers of truth.</span>
      </div>
    </footer>
  );
}

export default Footer;