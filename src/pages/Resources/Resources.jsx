
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Download,
  Flame,
  Heart,
  Library,
  Map,
  Search,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import "./Resources.css";

const API_URL = "https://pilgrim-truth.onrender.com/api";
const BACKEND_URL = "https://pilgrim-truth.onrender.com";

const DEFAULT_CATEGORIES = [
  "Study Guides",
  "Bible Maps",
  "Timelines",
  "Reference",
  "Prophecy",
  "Christian Living",
];

const iconMap = {
  book: BookOpen,
  library: Library,
  clock: Clock3,
  map: Map,
  flame: Flame,
  heart: Heart,
};

function getResourceIcon(resource) {
  const category = (resource.category || "").toLowerCase();

  if (category.includes("map")) return Map;
  if (category.includes("timeline") || category.includes("history")) {
    return Clock3;
  }
  if (category.includes("prophecy")) return Flame;
  if (category.includes("living") || category.includes("devotion")) {
    return Heart;
  }
  if (category.includes("reference") || category.includes("library")) {
    return Library;
  }

  return iconMap[resource.icon] || BookOpen;
}

function getFileUrl(fileUrl) {
  if (!fileUrl) return "";

  if (/^https?:\/\//i.test(fileUrl)) {
    return fileUrl;
  }

  return `${BACKEND_URL}${fileUrl.startsWith("/") ? "" : "/"}${fileUrl}`;
}

function getFormat(resource) {
  if (resource.file_type) {
    return String(resource.file_type).toUpperCase();
  }

  if (resource.file_url) {
    const filename = resource.file_url.split("?")[0];
    const extension = filename.split(".").pop();

    if (extension && extension !== filename) {
      return extension.toUpperCase();
    }
  }

  return "RESOURCE";
}

function getSize(resource) {
  if (resource.file_size === null || resource.file_size === undefined) {
    return "";
  }

  return String(resource.file_size);
}

function Resources() {
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchResources() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/content/public/resources`
      );

      if (!response.ok) {
        throw new Error(
          `Unable to load resources (HTTP ${response.status}).`
        );
      }

      const data = await response.json();

      if (data.success !== true || !Array.isArray(data.resources)) {
        throw new Error("The server returned an unexpected response.");
      }

      setResources(data.resources);
    } catch (err) {
      console.error("Public resources error:", err);
      setError(
        err.message || "Unable to load resources. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchResources();
  }, []);

  const categories = useMemo(() => {
    const availableCategories = resources
      .map((resource) => resource.category)
      .filter((category) => typeof category === "string" && category.trim());

    return [
      "All",
      ...new Set([...DEFAULT_CATEGORIES, ...availableCategories]),
    ];
  }, [resources]);

  const filteredResources = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesCategory =
        activeCategory === "All" ||
        resource.category === activeCategory;

      const matchesSearch =
        !query ||
        (resource.title || "").toLowerCase().includes(query) ||
        (resource.description || "").toLowerCase().includes(query) ||
        (resource.category || "").toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [resources, searchQuery, activeCategory]);

  const featuredResource =
    resources.find((resource) => resource.is_featured) ||
    resources[0] ||
    null;

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
  };

  const handleDownload = (resource) => {
    const fileUrl = getFileUrl(resource.file_url);

    if (!fileUrl) {
      window.alert("This resource does not have a file available yet.");
      return;
    }

    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const renderResourceMeta = (resource) => (
    <div className="resource-card-meta">
      <span>{getFormat(resource)}</span>
      {getSize(resource) && <span>{getSize(resource)}</span>}
    </div>
  );

  return (
    <div className="inner-page resources-page">
      <Navbar />

      <main>
        {/* HERO */}
        <section className="page-hero resources-hero">
          <div className="container">
            <span className="section-label">
              PILGRIM TRUTH RESOURCES
            </span>

            <h1>
              Tools for deeper study.
              <em>Resources for the journey.</em>
            </h1>

            <p>
              Find practical study guides, Bible maps, timelines,
              reference materials, and helpful resources for
              exploring Scripture.
            </p>

            <div className="resources-search-wrapper">
              <div className="page-search">
                <Search size={19} />

                <input
                  id="resource-search"
                  name="resourceSearch"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search resources..."
                  aria-label="Search resources"
                  autoComplete="off"
                />

                {searchQuery && (
                  <button
                    type="button"
                    className="resource-search-clear"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear resource search"
                  >
                    ×
                  </button>
                )}
              </div>

              {searchQuery.trim() && !loading && !error && (
                <p className="resource-search-results">
                  {filteredResources.length}{" "}
                  {filteredResources.length === 1
                    ? "resource"
                    : "resources"}{" "}
                  found for <strong>"{searchQuery}"</strong>
                </p>
              )}
            </div>
          </div>
        </section>

        {/* FEATURED RESOURCE */}
        <section className="section resources-featured-section">
          <div className="container">
            <div className="section-heading-row">
              <div>
                <span className="section-label">FEATURED RESOURCE</span>
                <h2>Start with a strong foundation.</h2>
              </div>
            </div>

            {loading ? (
              <p role="status">Loading featured resource...</p>
            ) : featuredResource ? (
              <div className="resource-featured-card">
                <div className="resource-featured-icon">
                  {(() => {
                    const FeaturedIcon = getResourceIcon(featuredResource);
                    return <FeaturedIcon size={42} />;
                  })()}
                </div>

                <div className="resource-featured-content">
                  <span className="resource-category">
                    {featuredResource.category || "Resource"}
                  </span>

                  <h3>{featuredResource.title}</h3>
                  <p>{featuredResource.description}</p>

                  <div className="resource-meta">
                    <span>{getFormat(featuredResource)}</span>
                    {getSize(featuredResource) && (
                      <span>{getSize(featuredResource)}</span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleDownload(featuredResource)}
                    disabled={!featuredResource.file_url}
                  >
                    <Download size={16} />
                    Download Resource
                  </button>
                </div>
              </div>
            ) : (
              !error && (
                <p>
                  No featured resource is available yet. Check the
                  resource library below for new materials.
                </p>
              )
            )}
          </div>
        </section>

        {/* RESOURCE LIBRARY */}
        <section className="section resources-library-section">
          <div className="container">
            <div className="section-heading-row">
              <div>
                <span className="section-label">RESOURCE LIBRARY</span>
                <h2>Explore the collection.</h2>
              </div>

              <span className="resources-count">
                {loading ? "Loading..." : `${filteredResources.length} resources`}
              </span>
            </div>

            {!loading && !error && (
              <div className="resource-filters">
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category}
                    className={
                      activeCategory === category
                        ? "resource-filter active"
                        : "resource-filter"
                    }
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            {loading ? (
              <div className="resources-empty-state" role="status">
                <p>Loading resources...</p>
              </div>
            ) : error ? (
              <div className="resources-empty-state" role="alert">
                <h3>Resources could not be loaded.</h3>
                <p>{error}</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={fetchResources}
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
              </div>
            ) : filteredResources.length > 0 ? (
              <div className="resources-grid">
                {filteredResources.map((resource) => {
                  const ResourceIcon = getResourceIcon(resource);

                  return (
                    <article
                      className="resource-card"
                      key={resource.id || resource.slug}
                    >
                      <div className="resource-card-icon">
                        <ResourceIcon size={24} />
                      </div>

                      <div className="resource-card-content">
                        <span className="resource-card-category">
                          {resource.category || "Resource"}
                        </span>

                        <h3>{resource.title}</h3>
                        <p>{resource.description}</p>

                        {renderResourceMeta(resource)}

                        <button
                          type="button"
                          className="resource-download-link"
                          onClick={() => handleDownload(resource)}
                          disabled={!resource.file_url}
                        >
                          Download
                          <Download size={15} />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="resources-empty-state">
                <h3>No resources found.</h3>
                <p>
                  Try another search term or choose another category.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={clearFilters}
                >
                  View All Resources
                </button>
              </div>
            )}
          </div>
        </section>

        {/* STUDY NOTE */}
        <section className="section resources-note-section">
          <div className="container">
            <div className="resources-note">
              <BookOpen size={28} />

              <div>
                <span className="section-label">A SIMPLE REMINDER</span>

                <h2>
                  Resources support study.
                  Scripture remains the foundation.
                </h2>

                <p>
                  Use guides, maps, timelines, and reference materials
                  to understand the biblical world more clearly while
                  allowing Scripture itself to remain central to your study.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section resources-cta">
          <div className="container">
            <span className="section-label">KEEP EXPLORING</span>

            <h2>
              Study carefully.
              <em>Discover deeply.</em>
            </h2>

            <p>
              Continue exploring Pilgrim Truth through Bible studies,
              articles, prophecy, history, and video.
            </p>

            <Link to="/bible-studies" className="btn btn-primary">
              Explore Bible Studies
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Resources;
