import {
  Activity,
  Apple,
  ArrowRight,
  BookOpen,
  HeartPulse,
  Moon,
  ShieldCheck,
  Sun,
  Utensils,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

function Health() {
  const categories = [
    {
      icon: Utensils,
      title: "Nutrition",
      description:
        "Learn practical principles for balanced eating, healthy choices, and responsible nutrition.",
    },
    {
      icon: Activity,
      title: "Movement",
      description:
        "Explore the role of regular physical activity in maintaining strength, energy, and wellbeing.",
    },
    {
      icon: Moon,
      title: "Rest & Sleep",
      description:
        "Discover why healthy rest matters and explore practical habits for better recovery.",
    },
    {
      icon: HeartPulse,
      title: "Whole-Person Wellness",
      description:
        "Consider physical, emotional, social, and spiritual dimensions of a healthy lifestyle.",
    },
  ];

  const articles = [
    {
      category: "NUTRITION",
      title: "Building a Balanced Approach to Nutrition",
      description:
        "Explore practical principles for making thoughtful and sustainable food choices.",
      duration: "10 min read",
    },
    {
      category: "LIFESTYLE",
      title: "Why Movement Matters",
      description:
        "Learn how regular physical activity can support everyday health and wellbeing.",
      duration: "8 min read",
    },
    {
      category: "REST",
      title: "The Importance of Healthy Rest",
      description:
        "Understand the role of sleep, recovery, and healthy rhythms in daily life.",
      duration: "9 min read",
    },
  ];

  const wellnessTopics = [
    "Healthy Eating",
    "Physical Activity",
    "Sleep & Recovery",
    "Stress & Emotional Wellbeing",
    "Healthy Habits",
    "Preventive Health",
  ];

  return (
    <div className="inner-page health-page">
      <Navbar />

      <main>
        <section className="health-page-hero">
          <div className="container health-hero-grid">
            <div className="health-hero-content">
              <span className="section-label">HEALTH & WELLNESS</span>

              <h1>
                Caring for the body,
                <em>living with purpose.</em>
              </h1>

              <p>
                Explore practical principles for healthy living, nutrition,
                movement, rest, wellbeing, and responsible lifestyle choices.
              </p>

              <div className="health-hero-actions">
                <a href="#health-categories" className="btn btn-primary">
                  Explore Health
                  <ArrowRight size={16} />
                </a>

                <a href="#health-articles" className="btn btn-secondary">
                  <BookOpen size={16} />
                  Read Articles
                </a>
              </div>
            </div>

            <div className="health-hero-card">
              <div className="health-hero-icon">
                <Sun size={24} />
              </div>

              <span>HEALTHY LIVING</span>

              <blockquote>
                “Your body is a temple of the Holy Spirit.”
              </blockquote>

              <cite>1 Corinthians 6:19</cite>
            </div>
          </div>
        </section>

        <section className="section health-intro">
          <div className="container health-intro-grid">
            <div>
              <span className="section-label">A WHOLE-PERSON APPROACH</span>

              <h2>
                Healthy living is about
                <span> more than one thing.</span>
              </h2>
            </div>

            <div className="health-intro-text">
              <p>
                Health involves many connected areas of life. Nutrition,
                physical activity, rest, emotional wellbeing, relationships,
                and healthy habits can all contribute to overall wellbeing.
              </p>

              <p>
                Pilgrim Truth provides educational health content designed to
                encourage informed, balanced, and responsible lifestyle
                choices.
              </p>
            </div>
          </div>
        </section>

        <section
          className="section health-categories"
          id="health-categories"
        >
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-label">EXPLORE HEALTH</span>

                <h2>Start with an area of wellness.</h2>

                <p>
                  Explore practical topics that support a balanced approach to
                  healthy living.
                </p>
              </div>
            </div>

            <div className="health-category-grid">
              {categories.map((category) => {
                const Icon = category.icon;

                return (
                  <a
                    href="#health-articles"
                    className="health-category-card"
                    key={category.title}
                  >
                    <div className="health-category-icon">
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

        <section className="section health-principles">
          <div className="container health-principles-grid">
            <div className="health-principles-heading">
              <span className="section-label">HEALTH PRINCIPLES</span>

              <h2>
                Small habits can shape
                <em>everyday wellbeing.</em>
              </h2>

              <p>
                Healthy living is often built through consistent choices
                rather than extreme changes.
              </p>
            </div>

            <div className="health-principle-list">
              <div className="health-principle">
                <div className="health-principle-number">01</div>

                <div>
                  <h3>Eat thoughtfully</h3>
                  <p>
                    Aim for balanced and varied meals while developing
                    sustainable eating habits.
                  </p>
                </div>
              </div>

              <div className="health-principle">
                <div className="health-principle-number">02</div>

                <div>
                  <h3>Stay active</h3>
                  <p>
                    Make appropriate physical movement part of your regular
                    routine.
                  </p>
                </div>
              </div>

              <div className="health-principle">
                <div className="health-principle-number">03</div>

                <div>
                  <h3>Make room for rest</h3>
                  <p>
                    Give the body and mind enough time for sleep and recovery.
                  </p>
                </div>
              </div>

              <div className="health-principle">
                <div className="health-principle-number">04</div>

                <div>
                  <h3>Seek reliable information</h3>
                  <p>
                    Make health decisions using trustworthy information and
                    appropriate professional guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="section health-articles"
          id="health-articles"
        >
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-label">FEATURED ARTICLES</span>

                <h2>Learn. Apply. Live well.</h2>

                <p>
                  Educational articles covering practical aspects of healthy
                  living.
                </p>
              </div>

              <a href="#health-articles" className="section-heading-link">
                View all articles
                <ArrowRight size={16} />
              </a>
            </div>

            <div className="health-article-grid">
              {articles.map((article) => (
                <article className="health-article-card" key={article.title}>
                  <div className="health-article-top">
                    <BookOpen size={20} />
                    <span>{article.category}</span>
                  </div>

                  <h3>{article.title}</h3>

                  <p>{article.description}</p>

                  <div className="health-article-bottom">
                    <span>{article.duration}</span>

                    <a href="#health-articles">
                      Read article
                      <ArrowRight size={15} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section health-topics">
          <div className="container health-topics-grid">
            <div>
              <span className="section-label">WELLNESS TOPICS</span>

              <h2>
                Explore practical
                <em>health topics.</em>
              </h2>

              <p>
                Discover simple educational resources covering different
                aspects of healthy living.
              </p>
            </div>

            <div className="health-topic-list">
              {wellnessTopics.map((topic, index) => (
                <a
                  href="#health-articles"
                  className="health-topic"
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

        <section className="section health-note">
          <div className="container health-note-content">
            <div className="health-note-icon">
              <ShieldCheck size={21} />
            </div>

            <span className="section-label">RESPONSIBLE HEALTH CONTENT</span>

            <h2>
              Learn from reliable information.
              <em>Make informed choices.</em>
            </h2>

            <p>
              Health information on Pilgrim Truth is educational in nature and
              is not a substitute for diagnosis, treatment, or personalized
              medical advice from a qualified healthcare professional.
            </p>
          </div>
        </section>

        <section className="section health-final">
          <div className="container health-final-content">
            <span className="section-label">KEEP EXPLORING</span>

            <h2>
              Care for your wellbeing.
              <em>Keep seeking truth.</em>
            </h2>

            <p>
              Continue exploring biblical studies, Christian living, and
              thoughtful resources at Pilgrim Truth.
            </p>

            <div className="health-final-actions">
              <a href="/christian-living" className="btn btn-primary">
                Christian Living
                <ArrowRight size={16} />
              </a>

              <a href="/bible-studies" className="btn btn-secondary">
                Bible Studies
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Health;