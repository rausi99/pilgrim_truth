import {
ArrowRight,
BookOpen,
Clock3,
Cross,
Flame,
History,
Search,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

function BibleStudies() {
const studies = [
{
category: "FOUNDATIONS",
title: "How to Study the Bible",
description:
"Learn simple and practical principles for reading, understanding, and applying Scripture.",
icon: BookOpen,
duration: "12 min read",
},
{
category: "PROPHECY",
title: "Understanding Biblical Prophecy",
description:
"Explore the language, symbols, themes, and principles that help us approach biblical prophecy.",
icon: Flame,
duration: "18 min read",
},
{
category: "BIBLE HISTORY",
title: "The World Behind Scripture",
description:
"Discover the people, places, cultures, and historical setting that shaped the biblical story.",
icon: History,
duration: "15 min read",
},
{
category: "CHRISTIAN LIVING",
title: "Faith That Shapes Daily Life",
description:
"Explore how biblical faith can influence character, decisions, relationships, and purpose.",
icon: Cross,
duration: "10 min read",
},
];

return ( <div className="inner-page"> <Navbar />

```
  <main>
    {/* PAGE HERO */}
    <section className="page-hero">
      <div className="container page-hero-content">
        <span className="section-label">BIBLE STUDIES</span>

        <h1>
          Explore Scripture.
          <em>Understand the Word.</em>
        </h1>

        <p>
          Thoughtful Bible studies designed to help you discover biblical
          truth, understand Scripture in context, and grow in your
          knowledge and faith.
        </p>

        <div className="page-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search Bible studies..."
            aria-label="Search Bible studies"
          />
        </div>
      </div>
    </section>

    {/* INTRO */}
    <section className="section studies-intro">
      <div className="container studies-intro-grid">
        <div>
          <span className="section-label">START HERE</span>

          <h2>
            A clearer path to
            <span> deeper study.</span>
          </h2>
        </div>

        <div>
          <p>
            Scripture invites us to search, question, learn, and grow.
            Pilgrim Truth provides structured studies that make important
            biblical topics easier to explore.
          </p>

          <p>
            Whether you are beginning your Bible journey or looking deeper
            into a familiar subject, start with a study that interests you.
          </p>
        </div>
      </div>
    </section>

    {/* STUDY GRID */}
    <section className="section study-library">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="section-label">STUDY LIBRARY</span>

            <h2>Choose a study.</h2>

            <p>
              Explore biblical foundations, prophecy, history, and
              Christian living.
            </p>
          </div>
        </div>

        <div className="study-library-grid">
          {studies.map((study) => {
            const Icon = study.icon;

            return (
              <article className="library-card" key={study.title}>
                <div className="library-card-top">
                  <div className="library-icon">
                    <Icon size={21} />
                  </div>

                  <span className="library-category">
                    {study.category}
                  </span>
                </div>

                <h3>{study.title}</h3>

                <p>{study.description}</p>

                <div className="library-card-bottom">
                  <span className="study-duration">
                    <Clock3 size={15} />
                    {study.duration}
                  </span>

                  <a href="#study" className="study-open">
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

    {/* FEATURED CTA */}
    <section className="section studies-cta">
      <div className="container studies-cta-content">
        <div>
          <span className="section-label">GO DEEPER</span>

          <h2>
            The more you search,
            <em>the more you discover.</em>
          </h2>

          <p>
            Take time to examine Scripture carefully and allow its message
            to shape your understanding.
          </p>
        </div>

        <a href="#prophecy" className="btn btn-primary">
          Explore Prophecy
          <ArrowRight size={16} />
        </a>
      </div>
    </section>
  </main>

  <Footer />
</div>
);
}

export default BibleStudies;
