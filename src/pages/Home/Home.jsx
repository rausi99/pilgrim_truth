import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Cross,
  Flame,
  Heart,
  History,
  Play,
  Quote,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import "./Home.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BACKEND_URL = API_URL.replace(/\/api\/?$/, "");

const HERO_IMAGE = "/images/bble.jpeg";

const DEFAULT_SCRIPTURE =
  "Your word is a lamp to my feet and a light to my path.";

const DEFAULT_SCRIPTURE_REFERENCE = "Psalm 119:105";

const DEFAULT_HOMEPAGE_SETTINGS = {
  hero_enabled: true,
  daily_inspiration_enabled: true,
  featured_studies_enabled: true,
  prophecy_enabled: true,
  topics_enabled: true,
  articles_enabled: true,
  featured_video_enabled: true,
  newsletter_enabled: true,
  final_cta_enabled: true,

  featured_studies_limit: 3,
  articles_limit: 3,

  newsletter_title: "Continue the journey.",
  newsletter_description:
    "Receive new studies, articles, and reflections from Pilgrim Truth.",

  final_cta_title: "Truth is worth searching for.",
  final_cta_description:
    "Open Scripture. Ask questions. Keep learning.",
};

/*
|--------------------------------------------------------------------------
| EXPLORE SCRIPTURE
|--------------------------------------------------------------------------
| These are the main discovery areas available from the hero.
| Each item has its own route so the user can go directly to that area.
*/
const EXPLORE_ITEMS = [
  {
    title: "Bible Studies",
    description: "Study Scripture and discover its message.",
    path: "/bible-studies",
    icon: BookOpen,
  },
  {
    title: "Prophecy",
    description: "Explore biblical prophecy through Scripture.",
    path: "/prophecy",
    icon: Flame,
  },
  {
    title: "Bible History",
    description: "Understand the people, places and events of the Bible.",
    path: "/bible-history",
    icon: History,
  },
  {
    title: "Christian Living",
    description: "Grow in faith and practical discipleship.",
    path: "/christian-living",
    icon: Heart,
  },
  {
    title: "Health & Wellness",
    description: "Discover balanced principles for healthy living.",
    path: "/health",
    icon: Cross,
  },
  {
    title: "Videos",
    description: "Watch Bible studies, teachings and presentations.",
    path: "/videos",
    icon: Play,
  },
];

/*
|--------------------------------------------------------------------------
| HOMEPAGE TOPIC CARDS
|--------------------------------------------------------------------------
| Kept separate from the hero menu so the page does not feel repetitive.
| These cards are a visual discovery section.
*/
const TOPICS = [
  {
    title: "Bible Studies",
    description:
      "Explore Scripture carefully and discover its message for everyday faith.",
    path: "/bible-studies",
    icon: BookOpen,
  },
  {
    title: "Biblical Prophecy",
    description:
      "Study prophecy through Scripture, history and its message of hope.",
    path: "/prophecy",
    icon: Flame,
  },
  {
    title: "Bible History",
    description:
      "Discover the people, places and historical context behind Scripture.",
    path: "/bible-history",
    icon: History,
  },
  {
    title: "Christian Living",
    description:
      "Practical reflections on faith, character and daily discipleship.",
    path: "/christian-living",
    icon: Heart,
  },
  {
    title: "Health & Wellness",
    description:
      "Explore principles of healthy living from a Christian perspective.",
    path: "/health",
    icon: Cross,
  },
  {
    title: "Videos",
    description:
      "Watch Bible-focused presentations, studies and teachings.",
    path: "/videos",
    icon: Play,
  },
];

function getImageUrl(image) {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:") ||
    image.startsWith("/")
  ) {
    return image;
  }

  return `${BACKEND_URL}/${image.replace(/^\/+/, "")}`;
}

function formatArticleDate(date) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Home() {
  const [siteSettings, setSiteSettings] = useState(null);

  const [homepageSettings, setHomepageSettings] = useState(
    DEFAULT_HOMEPAGE_SETTINGS
  );

  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [featuredStudies, setFeaturedStudies] = useState([]);
  const [bibleStudies, setBibleStudies] = useState([]);
  const [prophecies, setProphecies] = useState([]);
  const [histories, setHistories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [dailyInspiration, setDailyInspiration] = useState(null);

  const [loadingContent, setLoadingContent] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | HERO EXPLORE MENU
  |--------------------------------------------------------------------------
  */
  const [exploreOpen, setExploreOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadHomeContent() {
      setLoadingContent(true);

      try {
        const results = await Promise.allSettled([
          fetch(`${API_URL}/settings`),
          fetch(`${API_URL}/homepage`),
          fetch(`${API_URL}/homepage/featured-studies`),
          fetch(`${API_URL}/content/featured-video`),
          fetch(`${API_URL}/content/public/bible-studies`),
          fetch(`${API_URL}/content/public/prophecy`),
          fetch(`${API_URL}/content/public/history`),
          fetch(`${API_URL}/content/public/articles`),
          fetch(
            `${API_URL}/content/public/daily-inspirations/today`
          ),
        ]);

        if (!mounted) return;

        const [
          settingsResult,
          homepageResult,
          featuredStudiesResult,
          videoResult,
          studiesResult,
          prophecyResult,
          historyResult,
          articlesResult,
          inspirationResult,
        ] = results;

        /*
        |--------------------------------------------------------------------------
        | SITE SETTINGS
        |--------------------------------------------------------------------------
        */
        if (
          settingsResult.status === "fulfilled" &&
          settingsResult.value.ok
        ) {
          const data = await settingsResult.value.json();

          if (mounted) {
            setSiteSettings(data);
          }
        }

        /*
        |--------------------------------------------------------------------------
        | HOMEPAGE SETTINGS
        |--------------------------------------------------------------------------
        */
        if (
          homepageResult.status === "fulfilled" &&
          homepageResult.value.ok
        ) {
          const data = await homepageResult.value.json();

          if (mounted) {
            setHomepageSettings({
              ...DEFAULT_HOMEPAGE_SETTINGS,
              ...(data?.settings || data || {}),
            });
          }
        }

        /*
        |--------------------------------------------------------------------------
        | FEATURED STUDIES
        |--------------------------------------------------------------------------
        */
        if (
          featuredStudiesResult.status === "fulfilled" &&
          featuredStudiesResult.value.ok
        ) {
          const data =
            await featuredStudiesResult.value.json();

          if (mounted) {
            setFeaturedStudies(
              Array.isArray(data)
                ? data
                : data?.studies || []
            );
          }
        } else if (mounted) {
          setFeaturedStudies([]);
        }

        /*
        |--------------------------------------------------------------------------
        | FEATURED VIDEO
        |--------------------------------------------------------------------------
        */
        if (
          videoResult.status === "fulfilled" &&
          videoResult.value.ok
        ) {
          const data = await videoResult.value.json();

          if (mounted) {
            setFeaturedVideo(
              data?.success && data?.video
                ? data.video
                : null
            );
          }
        } else if (mounted) {
          setFeaturedVideo(null);
        }

        /*
        |--------------------------------------------------------------------------
        | ALL BIBLE STUDIES
        |--------------------------------------------------------------------------
        */
        if (
          studiesResult.status === "fulfilled" &&
          studiesResult.value.ok
        ) {
          const data = await studiesResult.value.json();

          if (mounted) {
            setBibleStudies(
              Array.isArray(data)
                ? data
                : data?.items || []
            );
          }
        }

        /*
        |--------------------------------------------------------------------------
        | PROPHECY
        |--------------------------------------------------------------------------
        */
        if (
          prophecyResult.status === "fulfilled" &&
          prophecyResult.value.ok
        ) {
          const data =
            await prophecyResult.value.json();

          if (mounted) {
            setProphecies(
              Array.isArray(data)
                ? data
                : data?.items || []
            );
          }
        }

        /*
        |--------------------------------------------------------------------------
        | HISTORY
        |--------------------------------------------------------------------------
        */
        if (
          historyResult.status === "fulfilled" &&
          historyResult.value.ok
        ) {
          const data =
            await historyResult.value.json();

          if (mounted) {
            setHistories(
              Array.isArray(data)
                ? data
                : data?.items || []
            );
          }
        }

        /*
        |--------------------------------------------------------------------------
        | ARTICLES
        |--------------------------------------------------------------------------
        */
        if (
          articlesResult.status === "fulfilled" &&
          articlesResult.value.ok
        ) {
          const data =
            await articlesResult.value.json();

          if (mounted) {
            setArticles(
              Array.isArray(data)
                ? data
                : data?.items || []
            );
          }
        }

        /*
        |--------------------------------------------------------------------------
        | DAILY INSPIRATION
        |--------------------------------------------------------------------------
        */
        if (
          inspirationResult.status === "fulfilled" &&
          inspirationResult.value.ok
        ) {
          const data =
            await inspirationResult.value.json();

          if (mounted) {
            setDailyInspiration(data);
          }
        }
      } catch (error) {
        console.error(
          "Unable to load home content:",
          error
        );
      } finally {
        if (mounted) {
          setLoadingContent(false);
        }
      }
    }

    loadHomeContent();

    return () => {
      mounted = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | SCRIPTURE
  |--------------------------------------------------------------------------
  */
  const scriptureText =
    dailyInspiration?.scripture_text ||
    DEFAULT_SCRIPTURE;

  const scriptureReference =
    dailyInspiration?.scripture_reference ||
    DEFAULT_SCRIPTURE_REFERENCE;

  /*
  |--------------------------------------------------------------------------
  | LIMITS
  |--------------------------------------------------------------------------
  */
  const featuredStudiesLimit = Math.min(
    3,
    Math.max(
      1,
      Number(
        homepageSettings.featured_studies_limit
      ) || 3
    )
  );

  const displayedFeaturedStudies =
    featuredStudies.slice(
      0,
      featuredStudiesLimit
    );

  const articlesLimit = Math.max(
    1,
    Number(homepageSettings.articles_limit) || 3
  );

  const latestArticles = articles.slice(
    0,
    articlesLimit
  );

  /*
  |--------------------------------------------------------------------------
  | VISIBILITY
  |--------------------------------------------------------------------------
  */
  const showHero =
    homepageSettings.hero_enabled !== false;

  const showDailyInspiration =
    homepageSettings.daily_inspiration_enabled !==
    false;

  const showFeaturedStudies =
    homepageSettings.featured_studies_enabled !==
    false;

  const showProphecy =
    homepageSettings.prophecy_enabled !== false;

  const showTopics =
    homepageSettings.topics_enabled !== false;

  const showArticles =
    homepageSettings.articles_enabled !== false;

  const showFeaturedVideo =
    homepageSettings.featured_video_enabled !==
    false;

  const showNewsletter =
    homepageSettings.newsletter_enabled !== false;

  const showFinalCta =
    homepageSettings.final_cta_enabled !== false;

  /*
  |--------------------------------------------------------------------------
  | CLOSE EXPLORE MENU WHEN ROUTING
  |--------------------------------------------------------------------------
  */
  const handleExploreClick = () => {
    setExploreOpen(false);
  };

  return (
    <div
      id="top"
      className="home-page"
      style={{
        "--home-hero-image": `url("${HERO_IMAGE}")`,
      }}
    >
      <Navbar />

      <main>
        {/* =====================================================
            HERO
        ====================================================== */}
        {showHero && (
          <section className="hero">
            <div
              className="hero-background"
              aria-hidden="true"
            />

            <div className="container hero-container">
              <div className="hero-content">
                <span className="eyebrow">
                  {siteSettings?.site_name ||
                    "PILGRIM TRUTH"}
                </span>

                <h1>
                  {siteSettings?.hero_title ||
                    "Seeking Truth."}

                  <em>
                    {siteSettings?.hero_subtitle ||
                      "Studying Scripture."}
                  </em>
                </h1>

                <div className="hero-introduction">
                  <span className="hero-introduction-label">
                    Welcome to Pilgrim Truth Ministry
                  </span>

                  <p>
                    This is a Christ-centred ministry
                    committed to exploring the Bible,
                    understanding God's Word and sharing
                    timeless truths for spiritual
                    nourishment. Through Scripture,
                    prophecy, faith, and practical
                    Christian living, we seek to inspire
                    people to know Christ more deeply and
                    walk faithfully in His light.
                  </p>
                </div>

                <div className="hero-actions">
                  {/* =================================================
                      EXPLORE SCRIPTURE MENU
                  ================================================== */}
                  <div className="explore-wrapper">
                    <button
                      type="button"
                      className="btn btn-primary explore-button"
                      onClick={() =>
                        setExploreOpen(
                          (previous) => !previous
                        )
                      }
                      aria-expanded={exploreOpen}
                      aria-haspopup="menu"
                    >
                      Explore Scripture

                      {exploreOpen ? (
                        <X size={17} />
                      ) : (
                        <ArrowRight size={17} />
                      )}
                    </button>

                    {exploreOpen && (
                      <div
                        className="explore-menu"
                        role="menu"
                      >
                        <div className="explore-menu-header">
                          <span>
                            EXPLORE PILGRIM TRUTH
                          </span>

                          <p>
                            Choose an area to begin
                            exploring.
                          </p>
                        </div>

                        <div className="explore-menu-grid">
                          {EXPLORE_ITEMS.map(
                            (item) => {
                              const Icon =
                                item.icon;

                              return (
                                <Link
                                  key={item.title}
                                  to={item.path}
                                  className="explore-menu-item"
                                  role="menuitem"
                                  onClick={
                                    handleExploreClick
                                  }
                                >
                                  <span className="explore-menu-icon">
                                    <Icon
                                      size={19}
                                      strokeWidth={1.7}
                                    />
                                  </span>

                                  <span className="explore-menu-content">
                                    <strong>
                                      {item.title}
                                    </strong>

                                    <small>
                                      {
                                        item.description
                                      }
                                    </small>
                                  </span>

                                  <ArrowRight
                                    size={15}
                                    className="explore-menu-arrow"
                                  />
                                </Link>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/videos"
                    className="btn btn-secondary"
                  >
                    <Play size={16} />
                    Watch &amp; Learn
                  </Link>
                </div>
              </div>

              {/* DAILY INSPIRATION */}
              {showDailyInspiration && (
                <div className="hero-inspiration">
                  <div className="hero-inspiration-heading">
                    <span className="hero-inspiration-line" />

                    <span>
                      Daily Inspiration
                    </span>
                  </div>

                  <Quote
                    className="hero-inspiration-quote-icon"
                    size={21}
                    strokeWidth={1.5}
                  />

                  <blockquote>
                    “{scriptureText}”
                  </blockquote>

                  <span className="hero-inspiration-reference">
                    {scriptureReference}
                  </span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* =====================================================
            PURPOSE
        ====================================================== */}
        <section
          className="section intro"
          id="purpose"
        >
          <div className="container intro-grid">
            <div className="intro-heading">
              <span className="section-label">
                OUR PURPOSE
              </span>

              <h2>
                Seeking truth with
                <span> Scripture at the center.</span>
              </h2>
            </div>

            <div className="intro-content">
              <p>
                Pilgrim Truth exists to encourage
                thoughtful Bible study and a deeper
                understanding of God's Word.
              </p>

              <p>
                Through Scripture, history, prophecy,
                and practical Christian living, we seek
                to help people discover truth and apply
                it to everyday life.
              </p>

              <Link
                to="/bible-studies"
                className="text-link"
              >
                Explore our studies
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================
            FEATURED STUDIES
        ====================================================== */}
        {showFeaturedStudies && (
          <section
            className="section featured-studies"
            id="studies"
          >
            <div className="container">
              <div className="section-heading">
                <div>
                  <span className="section-label">
                    FEATURED STUDIES
                  </span>

                  <h2>
                    Explore Scripture deeply.
                  </h2>

                  <p>
                    Start with a study and continue
                    discovering the biblical message.
                  </p>
                </div>

                <Link
                  to="/bible-studies"
                  className="section-heading-link"
                >
                  View all studies
                  <ArrowRight size={16} />
                </Link>
              </div>

              {loadingContent ? (
                <div className="home-state">
                  Loading studies...
                </div>
              ) : displayedFeaturedStudies.length ===
                0 ? (
                <div className="empty-content">
                  <BookOpen size={24} />

                  <p>
                    Featured Bible Studies will appear
                    here soon.
                  </p>
                </div>
              ) : (
                <div className="study-grid">
                  {displayedFeaturedStudies.map(
                    (study, index) => {
                      const image = getImageUrl(
                        study.featured_image ||
                          study.image
                      );

                      const studyId =
                        study.bible_study_id ||
                        study.id;

                      return (
                        <article
                          className="study-card"
                          key={studyId}
                        >
                          {image ? (
                            <div className="study-card-image-wrap">
                              <img
                                src={image}
                                alt={
                                  study.title ||
                                  "Bible Study"
                                }
                                className="study-card-image"
                              />

                              <span className="study-card-number">
                                {String(
                                  index + 1
                                ).padStart(2, "0")}
                              </span>
                            </div>
                          ) : (
                            <div className="study-card-visual">
                              <span className="study-card-number">
                                {String(
                                  index + 1
                                ).padStart(2, "0")}
                              </span>

                              <BookOpen
                                size={42}
                                strokeWidth={1.35}
                              />

                              <span className="study-card-visual-label">
                                Bible Study
                              </span>
                            </div>
                          )}

                          <div className="study-card-content">
                            <span className="card-label">
                              {study.category ||
                                "Bible Study"}
                            </span>

                            <h3>
                              {study.title ||
                                "Bible Study"}
                            </h3>

                            <p>
                              {study.description ||
                                study.excerpt ||
                                "Explore this Bible Study and discover more from Scripture."}
                            </p>

                            <Link
                              to={`/bible-studies/${
                                study.slug || studyId
                              }`}
                              className="study-card-link"
                            >
                              Read study
                              <ArrowRight size={15} />
                            </Link>
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* =====================================================
            PROPHECY
        ====================================================== */}
        {showProphecy && (
          <section
            className="section prophecy-feature"
            id="prophecy"
          >
            <div className="container prophecy-grid">
              <div className="prophecy-content">
                <span className="section-label">
                  BIBLICAL PROPHECY
                </span>

                <h2>
                  Understanding prophecy through
                  <em> Scripture.</em>
                </h2>

                <p>
                  Explore biblical prophecy with
                  attention to Scripture, historical
                  context, and the central message of
                  hope found throughout God's Word.
                </p>

                <div className="prophecy-actions">
                  <Link
                    to="/prophecy"
                    className="btn btn-primary"
                  >
                    Explore Prophecy
                    <ArrowRight size={17} />
                  </Link>

                  <Link
                    to="/bible-studies"
                    className="btn btn-outline-light"
                  >
                    Bible Studies
                  </Link>
                </div>
              </div>

              <div className="prophecy-scripture">
                <div className="prophecy-scripture-top">
                  <span className="prophecy-scripture-icon">
                    <Quote size={19} />
                  </span>

                  <span>
                    THE WORD OF GOD
                  </span>
                </div>

                <blockquote>
                  “Surely the Lord GOD will do nothing,
                  but he revealeth his secret unto his
                  servants the prophets.”
                </blockquote>

                <cite>Amos 3:7</cite>

                <p className="prophecy-scripture-note">
                  Scripture remains the foundation of
                  our study.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            TOPICS
        ====================================================== */}
        {showTopics && (
          <section
            className="section topics-section"
            id="topics"
          >
            <div className="container">
              <div className="section-heading topics-heading">
                <div>
                  <span className="section-label">
                    WHAT WE EXPLORE
                  </span>

                  <h2>
                    Discover more.
                  </h2>

                  <p>
                    Explore the different areas of
                    Pilgrim Truth.
                  </p>
                </div>
              </div>

              <div className="topics-grid">
                {TOPICS.map((topic, index) => {
                  const Icon = topic.icon;

                  return (
                    <Link
                      to={topic.path}
                      className="topic-card"
                      key={topic.title}
                    >
                      <span className="topic-number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <span className="topic-icon">
                        <Icon
                          size={22}
                          strokeWidth={1.6}
                        />
                      </span>

                      <span className="topic-content">
                        <h3>
                          {topic.title}
                        </h3>

                        <p>
                          {topic.description}
                        </p>
                      </span>

                      <span className="topic-arrow">
                        <ArrowRight size={17} />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            ARTICLES
        ====================================================== */}
        {showArticles && (
          <section
            className="section articles-section"
            id="articles"
          >
            <div className="container">
              <div className="section-heading">
                <div>
                  <span className="section-label">
                    LATEST ARTICLES
                  </span>

                  <h2>
                    Read and reflect.
                  </h2>

                  <p>
                    Fresh perspectives and biblical
                    reflections for your journey.
                  </p>
                </div>

                <Link
                  to="/articles"
                  className="section-heading-link"
                >
                  View all articles
                  <ArrowRight size={16} />
                </Link>
              </div>

              {loadingContent ? (
                <div className="home-state">
                  Loading articles...
                </div>
              ) : latestArticles.length === 0 ? (
                <div className="empty-content">
                  <BookOpen size={24} />

                  <p>
                    New articles will appear here soon.
                  </p>
                </div>
              ) : (
                <div className="articles-grid">
                  {latestArticles.map((article) => {
                    const image = getImageUrl(
                      article.featured_image ||
                        article.image
                    );

                    return (
                      <article
                        className="article-card"
                        key={article.id}
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={
                              article.title ||
                              "Article"
                            }
                            className="article-image"
                          />
                        ) : (
                          <div className="article-image article-image-empty">
                            <BookOpen
                              size={32}
                              strokeWidth={1.35}
                            />
                          </div>
                        )}

                        <div className="article-content">
                          <span className="article-category">
                            {article.category ||
                              "Reflection"}
                          </span>

                          <h3>
                            {article.title}
                          </h3>

                          <p>
                            {article.excerpt ||
                              article.description ||
                              "Explore this biblical reflection from Pilgrim Truth."}
                          </p>

                          <div className="article-meta">
                            <span className="article-date">
                              {formatArticleDate(
                                article.published_at ||
                                  article.created_at
                              )}
                            </span>

                            <Link
                              to={`/articles/${
                                article.slug ||
                                article.id
                              }`}
                              className="article-link"
                            >
                              Read
                              <ArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* =====================================================
            VIDEO + SCRIPTURE
        ====================================================== */}
        {showFeaturedVideo && (
          <section
            className="section video-scripture-section"
            id="videos"
          >
            <div className="container video-scripture-grid">
              <div className="video-feature">
                <div className="video-feature-media">
                  {featuredVideo?.thumbnail_url ? (
                    <img
                      src={getImageUrl(
                        featuredVideo.thumbnail_url
                      )}
                      alt={
                        featuredVideo.title ||
                        "Featured video"
                      }
                      className="video-feature-image"
                    />
                  ) : (
                    <div className="video-feature-empty">
                      <span className="video-empty-icon">
                        <Play size={30} />
                      </span>

                      <span>
                        Featured video
                      </span>
                    </div>
                  )}

                  <div className="video-feature-overlay">
                    <Link
                      to="/videos"
                      className="video-action"
                      aria-label="Watch featured video"
                    >
                      <Play
                        size={22}
                        fill="currentColor"
                      />
                    </Link>
                  </div>
                </div>

                <div className="video-feature-content">
                  <span className="video-category">
                    {featuredVideo?.category ||
                      "FEATURED VIDEO"}
                  </span>

                  <h3>
                    {featuredVideo?.title ||
                      "Discover biblical truth through video."}
                  </h3>

                  <p>
                    Explore Bible-focused presentations,
                    teachings and studies.
                  </p>

                  <Link
                    to="/videos"
                    className="video-link"
                  >
                    Browse videos
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>

              <div className="scripture-card">
                <span className="scripture-card-label">
                  SCRIPTURE
                </span>

                <Quote
                  className="scripture-card-quote"
                  size={28}
                  strokeWidth={1.4}
                />

                <blockquote>
                  “{scriptureText}”
                </blockquote>

                <span className="scripture-reference">
                  {scriptureReference}
                </span>

                <div className="scripture-card-footer">
                  <span />
                  <span>
                    THE WORD REMAINS
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            NEWSLETTER
        ====================================================== */}
        {showNewsletter && (
          <section
            className="newsletter-section"
            id="newsletter"
          >
            <div className="container">
              <div className="newsletter-box">
                <div className="newsletter-mark">
                  PT
                </div>

                <div className="newsletter-content">
                  <span className="section-label">
                    STAY CONNECTED
                  </span>

                  <h2>
                    {
                      homepageSettings.newsletter_title
                    }
                  </h2>

                  <p>
                    {
                      homepageSettings.newsletter_description
                    }
                  </p>
                </div>

                <form
                  className="newsletter-form"
                  onSubmit={(event) =>
                    event.preventDefault()
                  }
                >
                  <div className="newsletter-input">
                    <input
                      type="email"
                      placeholder="Your email address"
                      aria-label="Email address"
                    />

                    <button type="submit">
                      Subscribe
                      <ArrowRight size={15} />
                    </button>
                  </div>

                  <span className="newsletter-helper">
                    We respect your inbox. No
                    unnecessary emails.
                  </span>
                </form>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            FINAL CTA
        ====================================================== */}
        {showFinalCta && (
          <section className="cta-section">
            <div className="container cta-content">
              <span className="section-label">
                KEEP SEEKING
              </span>

              <h2>
                {homepageSettings.final_cta_title}
              </h2>

              <p>
                {homepageSettings.final_cta_description}
              </p>

              <div className="cta-actions">
                <Link
                  to="/bible-studies"
                  className="btn btn-primary"
                >
                  Start a Study
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/articles"
                  className="btn btn-secondary"
                >
                  Read Articles
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}