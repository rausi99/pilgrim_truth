import {
  ArrowRight,
  BookOpen,
  Heart,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

function ChristianLiving() {
  const categories = [
    {
      icon: Heart,
      title: "Faith & Character",
      description:
        "Explore how biblical principles can shape character, choices, habits, and everyday life.",
    },
    {
      icon: Users,
      title: "Relationships",
      description:
        "Discover biblical principles for family, friendship, community, forgiveness, and love.",
    },
    {
      icon: Lightbulb,
      title: "Wisdom for Life",
      description:
        "Find practical biblical wisdom for decisions, challenges, work, and personal growth.",
    },
    {
      icon: ShieldCheck,
      title: "Faith Under Pressure",
      description:
        "Learn how Scripture speaks to perseverance, trials, temptation, courage, and hope.",
    },
  ];

  const studies = [
    {
      category: "FAITH",
      title: "What Does It Mean to Live by Faith?",
      description:
        "Explore what Scripture teaches about trusting God and putting faith into practice.",
      duration: "12 min read",
    },
    {
      category: "CHARACTER",
      title: "Building a Christ-Centered Character",
      description:
        "Discover biblical principles for developing integrity, humility, patience, and love.",
      duration: "15 min read",
    },
    {
      category: "DAILY LIFE",
      title: "Finding Purpose in Everyday Life",
      description:
        "Consider how biblical principles can bring meaning and purpose to ordinary responsibilities.",
      duration: "14 min read",
    },
  ];

  const practicalTopics = [
    "Prayer & Spiritual Growth",
    "Faith & Work",
    "Family & Relationships",
    "Forgiveness",
    "Temptation & Self-Control",
    "Hope & Perseverance",
  ];

  return (
    <div className="inner-page christian-living-page">
      <Navbar />

      <main>
        <section className="christian-living-hero">
          <div className="container christian-living-hero-grid">
            <div className="christian-living-hero-content">
              <span className="section-label">CHRISTIAN LIVING</span>

              <h1>
                Faith that shapes
                <em>everyday life.</em>
              </h1>

              <p>
                Explore practical biblical principles for faith, character,
                relationships, purpose, and the everyday journey of following
                Christ.
              </p>

              <div className="christian-living-actions">
                <a
                  href="#living-categories"
                  className="btn btn-primary"
                >
                  Explore Topics
                  <ArrowRight size={16} />
                </a>

                <a
                  href="#living-studies"
                  className="btn btn-secondary"
                >
                  <BookOpen size={16} />
                  Start a Study
                </a>
              </div>
            </div>

            <div className="christian-living-hero-card">
              <div className="christian-living-hero-icon">
                <Sparkles size={24} />
              </div>

              <span>DAILY REMINDER</span>

              <blockquote>
                “Let your light shine before others.”
              </blockquote>

              <cite>Matthew 5:16</cite>
            </div>
          </div>
        </section>

        <section className="section christian-living-intro">
          <div className="container christian-living-intro-grid">
            <div>
              <span className="section-label">FAITH IN PRACTICE</span>

              <h2>
                Christianity is not only
                <span> what we believe.</span>
              </h2>
            </div>

            <div className="christian-living-intro-text">
              <p>
                Scripture speaks not only about belief, but also about how
                those beliefs influence the way we live, treat others, make
                decisions, and respond to life's challenges.
              </p>

              <p>
                Pilgrim Truth explores practical biblical principles that can
                help connect Scripture with everyday life.
              </p>
            </div>
          </div>
        </section>

        <section
          className="section christian-living-categories"
          id="living-categories"
        >
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-label">EXPLORE CHRISTIAN LIVING</span>

                <h2>Where would you like to begin?</h2>

                <p>
                  Explore practical areas of Christian life and spiritual
                  growth.
                </p>
              </div>
            </div>

            <div className="christian-living-category-grid">
              {categories.map((category) => {
                const Icon = category.icon;

                return (
                  <a
                    href="#living-studies"
                    className="christian-living-category-card"
                    key={category.title}
                  >
                    <div className="christian-living-category-icon">
                      <Icon size={21} />
                    </div>

                    <h3>{category.title}</h3>

                    <p>{category.description}</p>

                    <span>
                      Explore
                      <ArrowRight size={15} />
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="section christian-living-studies"
          id="living-studies"
        >
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-label">FEATURED STUDIES</span>

                <h2>Practical truth for everyday life.</h2>

                <p>
                  Explore studies that connect biblical principles with
                  everyday Christian living.
                </p>
              </div>

              <a
                href="#living-studies"
                className="section-heading-link"
              >
                View all studies
                <ArrowRight size={16} />
              </a>
            </div>

            <div className="christian-living-study-grid">
              {studies.map((study) => (
                <article
                  className="christian-living-study-card"
                  key={study.title}
                >
                  <div className="christian-living-study-top">
                    <BookOpen size={20} />
                    <span>{study.category}</span>
                  </div>

                  <h3>{study.title}</h3>

                  <p>{study.description}</p>

                  <div className="christian-living-study-bottom">
                    <span>{study.duration}</span>

                    <a href="#living-studies">
                      Read study
                      <ArrowRight size={15} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section christian-living-topics">
          <div className="container christian-living-topics-grid">
            <div className="christian-living-topics-heading">
              <span className="section-label">PRACTICAL TOPICS</span>

              <h2>
                Biblical wisdom for
                <em>real life.</em>
              </h2>

              <p>
                Explore practical questions and everyday challenges through a
                biblical perspective.
              </p>
            </div>

            <div className="christian-living-topic-list">
              {practicalTopics.map((topic, index) => (
                <a
                  href="#living-studies"
                  className="christian-living-topic"
                  key={topic}
                >
                  <span>0{index + 1}</span>

                  <strong>{topic}</strong>

                  <ArrowRight size={17} />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section christian-living-quote">
          <div className="container christian-living-quote-content">
            <div className="christian-living-quote-icon">
              <Heart size={20} />
            </div>

            <span className="section-label">LIVE WITH PURPOSE</span>

            <h2>
              “Whatever you do,
              <em>do it all for the glory of God.”</em>
            </h2>

            <p>1 Corinthians 10:31</p>
          </div>
        </section>

        <section className="section christian-living-final">
          <div className="container christian-living-final-content">
            <span className="section-label">KEEP GROWING</span>

            <h2>
              Search Scripture.
              <em>Live the truth.</em>
            </h2>

            <p>
              Continue exploring Scripture through Bible studies and biblical
              prophecy.
            </p>

            <div className="christian-living-final-actions">
              <a href="/bible-studies" className="btn btn-primary">
                Bible Studies
                <ArrowRight size={16} />
              </a>

              <a href="/prophecy" className="btn btn-secondary">
                Explore Prophecy
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ChristianLiving;