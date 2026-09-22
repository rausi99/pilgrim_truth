import {
ArrowRight,
BookOpen,
Clock3,
Flame,
Play,
ScrollText,
Star,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

function Prophecy() {
const studies = [
{
icon: ScrollText,
category: "DANIEL",
title: "Understanding the Book of Daniel",
description:
"Explore the major visions, themes, symbols, and messages found throughout Daniel.",
duration: "20 min read",
},
{
icon: Flame,
category: "REVELATION",
title: "An Introduction to Revelation",
description:
"Discover principles that can help you approach the symbolism and message of Revelation.",
duration: "22 min read",
},
{
icon: BookOpen,
category: "PROPHECY",
title: "How to Study Biblical Prophecy",
description:
"Learn foundational principles for reading prophetic passages carefully and in context.",
duration: "15 min read",
},
];

const themes = [
"Hope & Promise",
"Prophetic Symbols",
"Kingdoms & History",
"The Second Coming",
];

return ( <div className="inner-page prophecy-page"> <Navbar />
  <main>
    {/* HERO */}
    <section className="prophecy-page-hero">
      <div className="container prophecy-page-hero-grid">
        <div className="prophecy-page-hero-content">
          <span className="section-label">BIBLICAL PROPHECY</span>

          <h1>
            Discover the message
            <em>within the prophecy.</em>
          </h1>

          <p>
            Explore Daniel, Revelation, prophetic symbols, biblical
            history, and the promises of Scripture through thoughtful,
            Christ-centered study.
          </p>

          <div className="prophecy-page-actions">
            <a href="#prophecy-studies" className="btn btn-primary">
              Start Exploring
              <ArrowRight size={16} />
            </a>

            <a href="#prophecy-video" className="btn btn-secondary">
              <Play size={16} />
              Watch a Study
            </a>
          </div>
        </div>

        <div className="prophecy-hero-card">
          <div className="prophecy-hero-icon">
            <Flame size={25} />
          </div>

          <span>KEY PRINCIPLE</span>

          <blockquote>
            “The testimony of Jesus is the spirit of prophecy.”
          </blockquote>

          <cite>Revelation 19:10</cite>
        </div>
      </div>
    </section>

    {/* INTRO */}
    <section className="section prophecy-page-intro">
      <div className="container prophecy-intro-grid">
        <div>
          <span className="section-label">WHY STUDY PROPHECY?</span>

          <h2>
            Prophecy is more than
            <span> predicting the future.</span>
          </h2>
        </div>

        <div className="prophecy-intro-text">
          <p>
            Biblical prophecy contains messages about God, humanity,
            history, hope, judgment, redemption, and the future.
          </p>

          <p>
            Understanding prophecy begins with Scripture itself. Rather
            than approaching prophetic passages through speculation, we
            can examine their context, symbols, themes, and connections
            throughout the Bible.
          </p>
        </div>
      </div>
    </section>

    {/* FEATURED STUDIES */}
    <section
      className="section prophecy-studies-section"
      id="prophecy-studies"
    >
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="section-label">FEATURED STUDIES</span>

            <h2>Begin your prophecy journey.</h2>

            <p>
              Start with foundational studies before exploring deeper
              prophetic themes.
            </p>
          </div>
        </div>

        <div className="prophecy-study-grid">
          {studies.map((study) => {
            const Icon = study.icon;

            return (
              <article
                className="prophecy-study-card"
                key={study.title}
              >
                <div className="prophecy-study-icon">
                  <Icon size={21} />
                </div>

                <span className="prophecy-study-category">
                  {study.category}
                </span>

                <h3>{study.title}</h3>

                <p>{study.description}</p>

                <div className="prophecy-study-bottom">
                  <span>
                    <Clock3 size={14} />
                    {study.duration}
                  </span>

                  <a href="#prophecy-studies">
                    Explore
                    <ArrowRight size={15} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>

    {/* THEMES */}
    <section className="section prophecy-themes-section">
      <div className="container">
        <div className="prophecy-themes-heading">
          <span className="section-label">EXPLORE TOPICS</span>

          <h2>
            Where would you
            <em>like to begin?</em>
          </h2>

          <p>
            Explore major themes that appear throughout biblical
            prophecy.
          </p>
        </div>

        <div className="prophecy-themes-grid">
          {themes.map((theme, index) => (
            <a
              href="#prophecy-studies"
              className="prophecy-theme-card"
              key={theme}
            >
              <span>0{index + 1}</span>

              <h3>{theme}</h3>

              <ArrowRight size={18} />
            </a>
          ))}
        </div>
      </div>
    </section>

    {/* VIDEO */}
    <section className="section prophecy-video-section" id="prophecy-video">
      <div className="container">
        <div className="prophecy-video-card">
          <div className="prophecy-video-content">
            <span className="section-label">WATCH & LEARN</span>

            <h2>
              Understanding prophecy
              <em>through Scripture.</em>
            </h2>

            <p>
              Explore biblical prophecy through visual lessons designed
              to make complex ideas easier to understand.
            </p>

            <button className="btn btn-primary">
              <Play size={16} fill="currentColor" />
              Play Featured Study
            </button>
          </div>

          <div className="prophecy-video-visual">
            <div className="prophecy-video-play">
              <Play size={24} fill="currentColor" />
            </div>

            <span>FEATURED PROPHECY STUDY</span>
          </div>
        </div>
      </div>
    </section>

    {/* SCRIPTURE CTA */}
    <section className="section prophecy-final-section">
      <div className="container prophecy-final-content">
        <div className="prophecy-final-icon">
          <Star size={20} />
        </div>

        <span className="section-label">KEEP SEARCHING</span>

        <h2>
          “Blessed is the one who reads
          <em>and those who hear.”</em>
        </h2>

        <p>
          Continue studying, asking questions, and searching Scripture
          with an open heart and a thoughtful mind.
        </p>

        <a href="/bible-studies" className="btn btn-primary">
          Explore Bible Studies
          <ArrowRight size={16} />
        </a>
      </div>
    </section>
  </main>

  <Footer />
</div>
);
}

export default Prophecy;
