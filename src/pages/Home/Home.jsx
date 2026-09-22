import {
  ArrowRight,
  BookOpen,
  Cross,
  Flame,
  Heart,
  History,
  Play,
  Quote,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

function Home() {
  const topics = [
    {
      title: "Bible Studies",
      description:
        "Build a deeper understanding of Scripture through thoughtful Bible study.",
      icon: BookOpen,
      className: "",
      href: "#studies",
    },
    {
      title: "Prophecy",
      description:
        "Explore biblical prophecy and the messages of hope found throughout Scripture.",
      icon: Flame,
      className: "prophecy-topic",
      href: "#prophecy",
    },
    {
      title: "Bible History",
      description:
        "Discover the people, places, events, and historical setting of Scripture.",
      icon: History,
      className: "history-topic",
      href: "#history",
    },
    {
      title: "Christian Living",
      description:
        "Practical biblical principles for faith, character, purpose, and daily life.",
      icon: Heart,
      className: "living-topic",
      href: "#christian-living",
    },
    {
      title: "Health & Wellness",
      description:
        "Explore practical principles for caring for the body, mind, and whole person.",
      icon: Cross,
      className: "health-topic",
      href: "#health",
    },
    {
      title: "Videos",
      description:
        "Watch lessons, discussions, and biblical content designed to help you learn.",
      icon: Play,
      className: "video-topic",
      href: "#videos",
    },
  ];

  const articles = [
    {
      category: "Prophecy",
      title: "Understanding Biblical Prophecy",
      description:
        "Discover practical principles for reading and understanding prophetic passages in Scripture.",
      date: "Featured Study",
      image:
        "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=85",
      featured: true,
    },
    {
      category: "Bible Study",
      title: "Building a Stronger Bible Study",
      description:
        "Simple approaches that can help you study Scripture with greater purpose and consistency.",
      date: "Bible Study",
      image:
        "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=85",
      featured: false,
    },
    {
      category: "Christian Living",
      title: "Living With Purpose",
      description:
        "Consider how biblical principles can shape everyday decisions, relationships, and character.",
      date: "Christian Living",
      image:
        "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=900&q=85",
      featured: false,
    },
  ];

  return (
    <div id="top">
      <Navbar />

      <main>
        {/* HERO */}

        <section className="hero">
          <div className="container hero-content">
            <span className="eyebrow">PILGRIM TRUTH</span>

            <h1>
              Seeking Truth.
              <em>Studying Scripture.</em>
            </h1>

            <p>
              Explore Scripture, understand prophecy, discover biblical
              history, and grow in a life of faith and purpose.
            </p>

            <div className="hero-actions">
              <a href="#studies" className="btn btn-primary">
                Explore Scripture
                <ArrowRight size={16} />
              </a>

              <a href="#videos" className="btn btn-secondary">
                <Play size={16} />
                Watch & Learn
              </a>
            </div>
          </div>

          <div className="hero-scripture">
            <p>
              “Your word is a lamp to my feet and a light to my path.”
            </p>

            <span>Psalm 119:105</span>
          </div>
        </section>

        {/* INTRO */}

        <section className="section intro">
          <div className="container intro-grid">
            <div>
              <span className="section-label">OUR PURPOSE</span>

              <h2>
                Seeking truth with
                <span> Scripture at the center.</span>
              </h2>
            </div>

            <div className="intro-content">
              <p>
                Pilgrim Truth exists to encourage thoughtful study of the
                Bible and help people discover its message in a clear,
                meaningful, and practical way.
              </p>

              <p>
                From biblical prophecy and history to Christian living and
                health, explore resources created to encourage learning,
                reflection, and purposeful living.
              </p>

              <a href="#studies" className="intro-link">
                Explore our studies
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>

        {/* FEATURED STUDIES */}

        <section className="section featured-studies" id="studies">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-label">FEATURED STUDIES</span>

                <h2>Explore Scripture more deeply.</h2>

                <p>
                  Start with carefully selected topics designed to help you
                  discover biblical truth and develop a stronger foundation
                  in Scripture.
                </p>
              </div>

              <a href="#articles" className="section-heading-link">
                View resources
                <ArrowRight size={16} />
              </a>
            </div>

            <div className="study-grid">
              <article className="study-card">
                <img
                  className="study-card-image"
                  src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=900&q=85"
                  alt="Open Bible"
                />

                <div className="study-card-content">
                  <span className="card-label">Bible Study</span>

                  <h3>Build a stronger foundation in Scripture.</h3>

                  <p>
                    Learn practical approaches for reading, understanding,
                    and applying the Bible.
                  </p>

                  <a href="#articles" className="study-card-link">
                    Start studying
                    <ArrowRight size={15} />
                  </a>
                </div>
              </article>

              <article className="study-card" id="prophecy-study">
                <img
                  className="study-card-image"
                  src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=85"
                  alt="Sky representing biblical prophecy"
                />

                <div className="study-card-content">
                  <span className="card-label">Prophecy</span>

                  <h3>Look deeper. Understand the message.</h3>

                  <p>
                    Explore prophetic passages and the hope they communicate
                    through Scripture.
                  </p>

                  <a href="#prophecy" className="study-card-link">
                    Explore prophecy
                    <ArrowRight size={15} />
                  </a>
                </div>
              </article>

              <article className="study-card" id="history">
                <img
                  className="study-card-image"
                  src="https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=85"
                  alt="Ancient biblical history"
                />

                <div className="study-card-content">
                  <span className="card-label">Bible History</span>

                  <h3>Discover the world behind Scripture.</h3>

                  <p>
                    Learn about the people, places, cultures, and events that
                    shaped the biblical story.
                  </p>

                  <a href="#history" className="study-card-link">
                    Explore history
                    <ArrowRight size={15} />
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* PROPHECY */}

        <section className="section prophecy-feature" id="prophecy">
          <div className="container prophecy-grid">
            <div className="prophecy-content">
              <span className="section-label">BIBLICAL PROPHECY</span>

              <h2>
                Look deeper.
                <em>Understand the message.</em>
              </h2>

              <p>
                Biblical prophecy can seem complex, but Scripture provides a
                foundation for understanding its themes, symbols, warnings,
                and promises.
              </p>

              <div className="prophecy-actions">
                <a href="#articles" className="btn btn-primary">
                  Explore Prophecy
                  <ArrowRight size={16} />
                </a>

                <a href="#videos" className="btn btn-secondary">
                  Watch a Study
                  <Play size={16} />
                </a>
              </div>
            </div>

            <div className="prophecy-scripture">
              <div className="prophecy-scripture-icon">
                <Quote size={20} />
              </div>

              <blockquote>
                “Your word is a lamp to my feet and a light to my path.”
              </blockquote>

              <cite>Psalm 119:105</cite>

              <p className="prophecy-scripture-note">
                Scripture provides the foundation for understanding the
                biblical message.
              </p>
            </div>
          </div>
        </section>

        {/* TOPICS */}

        <section className="section topics-section" id="topics">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-label">EXPLORE</span>

                <h2>Find a place to begin.</h2>

                <p>
                  Explore different areas of biblical learning and practical
                  Christian living.
                </p>
              </div>
            </div>

            <div className="topics-grid">
              {topics.map((topic) => {
                const Icon = topic.icon;

                return (
                  <a
                    href={topic.href}
                    className={`topic-card ${topic.className}`}
                    key={topic.title}
                  >
                    <div className="topic-icon">
                      <Icon size={21} />
                    </div>

                    <div>
                      <h3>{topic.title}</h3>
                      <p>{topic.description}</p>
                    </div>

                    <ArrowRight className="topic-arrow" size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* ARTICLES */}

        <section className="section articles-section" id="articles">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-label">LATEST ARTICLES</span>

                <h2>Ideas worth exploring.</h2>

                <p>
                  Read thoughtful content covering Scripture, prophecy,
                  Christian living, and biblical understanding.
                </p>
              </div>

              <a href="#articles" className="section-heading-link">
                View all articles
                <ArrowRight size={16} />
              </a>
            </div>

            <div className="articles-grid">
              {articles.map((article) => (
                <article
                  className={`article-card ${
                    article.featured ? "featured-article" : ""
                  }`}
                  key={article.title}
                >
                  <div className="article-image">
                    <img src={article.image} alt={article.title} />
                  </div>

                  <div className="article-content">
                    <span className="article-category">
                      {article.category}
                    </span>

                    <h3>{article.title}</h3>

                    <p>{article.description}</p>

                    <div className="article-meta">
                      <span className="article-date">{article.date}</span>

                      <a href="#articles" className="article-link">
                        Read article
                        <ArrowRight size={14} />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* VIDEO + SCRIPTURE */}

        <section
          className="section video-scripture-section"
          id="videos"
        >
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-label">WATCH & LEARN</span>

                <h2>Learn through video.</h2>

                <p>
                  Explore visual lessons and discussions that bring biblical
                  ideas into focus.
                </p>
              </div>
            </div>

            <div className="video-scripture-grid">
              <div className="video-feature">
                <img
                  className="video-feature-image"
                  src="https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=85"
                  alt="Christian study and worship"
                />

                <div className="video-feature-content">
                  <button className="video-action" aria-label="Play video">
                    <Play size={21} fill="currentColor" />
                  </button>

                  <span className="video-category">FEATURED VIDEO</span>

                  <h3>Understanding Biblical Prophecy</h3>

                  <p>
                    A thoughtful introduction to reading prophecy through the
                    broader message of Scripture.
                  </p>
                </div>
              </div>

              <div className="scripture-card">
                <span className="scripture-card-label">
                  Scripture of the Day
                </span>

                <blockquote>
                  “Your word is a lamp to my feet and a light to my path.”
                </blockquote>

                <span className="scripture-reference">
                  Psalm 119:105
                </span>

                <p className="scripture-card-footer">
                  Let Scripture guide the journey toward truth, faith, and
                  purposeful living.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}

        <section className="section newsletter-section" id="newsletter">
          <div className="container">
            <div className="newsletter-box">
              <div className="newsletter-content">
                <span className="section-label">STAY CONNECTED</span>

                <h2>Keep seeking. Keep learning.</h2>

                <p>
                  Receive new Bible studies, articles, videos, and resources
                  from Pilgrim Truth.
                </p>
              </div>

              <form className="newsletter-form">
                <input
                  type="email"
                  placeholder="Your email address"
                  aria-label="Email address"
                />

                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </section>

        {/* CTA */}

        <section className="section cta-section">
          <div className="container cta-content">
            <span className="section-label">THE JOURNEY CONTINUES</span>

            <h2>
              Seek truth.
              <em>Walk with purpose.</em>
            </h2>

            <p>
              Continue exploring Scripture, growing in understanding, and
              discovering practical ways to live with faith and purpose.
            </p>

            <div className="cta-actions">
              <a href="#studies" className="btn btn-primary">
                Explore Scripture
                <ArrowRight size={16} />
              </a>

              <a href="#articles" className="btn btn-secondary">
                Browse Articles
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;