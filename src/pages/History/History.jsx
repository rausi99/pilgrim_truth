import {
ArrowRight,
BookOpen,
Clock3,
Globe2,
Landmark,
Map,
Users,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

function History() {
const categories = [
{
icon: Map,
title: "Biblical Places",
description:
"Explore the cities, regions, and landscapes that form the setting of the biblical story.",
},
{
icon: Users,
title: "People of the Bible",
description:
"Learn about important people whose lives and decisions shaped biblical history.",
},
{
icon: Landmark,
title: "Kingdoms & Empires",
description:
"Understand the kingdoms and empires that interacted with the biblical world.",
},
{
icon: Globe2,
title: "Cultures & Context",
description:
"Discover the customs, traditions, languages, and cultures behind Scripture.",
},
];

const studies = [
{
category: "BIBLICAL PLACES",
title: "Jerusalem: A City at the Heart of Scripture",
description:
"Explore the historical and biblical significance of Jerusalem across Scripture.",
duration: "16 min read",
},
{
category: "ANCIENT KINGDOMS",
title: "Israel and the Kingdoms Around It",
description:
"Discover the historical setting of Israel, Judah, and the surrounding nations.",
duration: "18 min read",
},
{
category: "BIBLICAL CONTEXT",
title: "Understanding the World of the Bible",
description:
"Learn how geography, culture, politics, and daily life help illuminate Scripture.",
duration: "14 min read",
},
];

return ( <div className="inner-page history-page"> <Navbar />

  <main>
    {/* HERO */}
    <section className="history-page-hero">
      <div className="container history-hero-content">
        <span className="section-label">BIBLE HISTORY</span>

        <h1>
          Discover the world
          <em>behind Scripture.</em>
        </h1>

        <p>
          Explore the people, places, cultures, kingdoms, and historical
          events that provide context for understanding the biblical story.
        </p>

        <div className="history-hero-stats">
          <div>
            <strong>Places</strong>
            <span>Biblical geography</span>
          </div>

          <div>
            <strong>People</strong>
            <span>Stories & lives</span>
          </div>

          <div>
            <strong>Context</strong>
            <span>History & culture</span>
          </div>
        </div>
      </div>
    </section>

    {/* INTRO */}
    <section className="section history-intro">
      <div className="container history-intro-grid">
        <div>
          <span className="section-label">WHY HISTORY MATTERS</span>

          <h2>
            Context can help us
            <span> understand Scripture.</span>
          </h2>
        </div>

        <div className="history-intro-text">
          <p>
            The Bible was written within real places, cultures, societies,
            and historical periods. Understanding that setting can give
            greater context to the people and events described in
            Scripture.
          </p>

          <p>
            Pilgrim Truth explores biblical history as a way of providing
            useful background for thoughtful Bible study.
          </p>
        </div>
      </div>
    </section>

    {/* CATEGORIES */}
    <section className="section history-categories">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="section-label">EXPLORE HISTORY</span>

            <h2>Start with a category.</h2>

            <p>
              Explore different aspects of the world surrounding the
              biblical narrative.
            </p>
          </div>
        </div>

        <div className="history-category-grid">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <a
                href="#history-studies"
                className="history-category-card"
                key={category.title}
              >
                <div className="history-category-icon">
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

    {/* FEATURED STUDIES */}
    <section
      className="section history-studies"
      id="history-studies"
    >
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="section-label">FEATURED STUDIES</span>

            <h2>Explore biblical history.</h2>

            <p>
              Discover historical background that can enrich your study of
              Scripture.
            </p>
          </div>

          <a href="#history-studies" className="section-heading-link">
            View all studies
            <ArrowRight size={16} />
          </a>
        </div>

        <div className="history-study-grid">
          {studies.map((study) => (
            <article className="history-study-card" key={study.title}>
              <div className="history-study-top">
                <BookOpen size={20} />

                <span>{study.category}</span>
              </div>

              <h3>{study.title}</h3>

              <p>{study.description}</p>

              <div className="history-study-bottom">
                <span>
                  <Clock3 size={14} />
                  {study.duration}
                </span>

                <a href="#history-studies">
                  Read study
                  <ArrowRight size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* TIMELINE */}
    <section className="section history-timeline">
      <div className="container">
        <div className="history-timeline-heading">
          <span className="section-label">A JOURNEY THROUGH TIME</span>

          <h2>
            See the biblical story
            <em>in its historical setting.</em>
          </h2>

          <p>
            A future interactive timeline can connect major biblical
            events, people, places, and historical periods.
          </p>
        </div>

        <div className="timeline-preview">
          <div className="timeline-line"></div>

          <div className="timeline-item">
            <span>01</span>
            <div>
              <strong>Early Biblical History</strong>
              <p>Origins, patriarchs, and the early biblical narrative.</p>
            </div>
          </div>

          <div className="timeline-item">
            <span>02</span>
            <div>
              <strong>Israel's Kingdoms</strong>
              <p>Israel, Judah, their kings, and surrounding nations.</p>
            </div>
          </div>

          <div className="timeline-item">
            <span>03</span>
            <div>
              <strong>The Time of Jesus</strong>
              <p>The political, cultural, and religious world of the New Testament.</p>
            </div>
          </div>

          <div className="timeline-item">
            <span>04</span>
            <div>
              <strong>The Early Church</strong>
              <p>The historical setting of the first Christian communities.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="section history-final">
      <div className="container history-final-content">
        <span className="section-label">KEEP EXPLORING</span>

        <h2>
          History gives context.
          <em>Scripture gives the message.</em>
        </h2>

        <p>
          Continue your journey through Scripture by exploring Bible
          studies and biblical prophecy.
        </p>

        <div className="history-final-actions">
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

export default History;
