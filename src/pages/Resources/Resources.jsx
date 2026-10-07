import { useMemo, useState } from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import "./Resources.css";
import resources from "../../data/resources";

function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
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

  const filteredResources = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesCategory =
        activeCategory === "All" ||
        resource.category === activeCategory;

      const matchesSearch =
        !query ||
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const featuredResource =
    resources.find((resource) => resource.featured) ||
    resources[0];

  const FeaturedIcon = iconMap[featuredResource.icon];

  const handleDownload = (resource) => {
    if (!resource.file) {
      alert(
        "This resource is not available for download yet."
      );
      return;
    }

    const link = document.createElement("a");
    link.href = resource.file;
    link.download = resource.file.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
  };

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
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
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

              {searchQuery.trim() && (
                <p className="resource-search-results">
                  {filteredResources.length}{" "}
                  {filteredResources.length === 1
                    ? "resource"
                    : "resources"}{" "}
                  found for{" "}
                  <strong>"{searchQuery}"</strong>
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
                <span className="section-label">
                  FEATURED RESOURCE
                </span>

                <h2>
                  Start with a strong foundation.
                </h2>
              </div>
            </div>

            <div className="resource-featured-card">

              <div className="resource-featured-icon">
                <FeaturedIcon size={42} />
              </div>

              <div className="resource-featured-content">

                <span className="resource-category">
                  {featuredResource.category}
                </span>

                <h3>{featuredResource.title}</h3>

                <p>{featuredResource.description}</p>

                <div className="resource-meta">
                  <span>{featuredResource.type}</span>
                  <span>{featuredResource.format}</span>
                  <span>{featuredResource.size}</span>
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    handleDownload(featuredResource)
                  }
                >
                  <Download size={16} />
                  Download Resource
                </button>

              </div>

            </div>

          </div>
        </section>


        {/* RESOURCE LIBRARY */}
        <section className="section resources-library-section">
          <div className="container">

            <div className="section-heading-row">

              <div>
                <span className="section-label">
                  RESOURCE LIBRARY
                </span>

                <h2>
                  Explore the collection.
                </h2>
              </div>

              <span className="resources-count">
                {filteredResources.length}{" "}
                {filteredResources.length === 1
                  ? "resource"
                  : "resources"}
              </span>

            </div>


            {/* FILTERS */}
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
                  onClick={() =>
                    setActiveCategory(category)
                  }
                >
                  {category}
                </button>
              ))}

            </div>


            {/* GRID */}
            {filteredResources.length > 0 ? (
              <div className="resources-grid">

                {filteredResources.map((resource) => {
                  const ResourceIcon =
                    iconMap[resource.icon];

                  return (
                    <article
                      className="resource-card"
                      key={resource.slug}
                    >

                      <div className="resource-card-icon">
                        <ResourceIcon size={24} />
                      </div>

                      <div className="resource-card-content">

                        <span className="resource-card-category">
                          {resource.category}
                        </span>

                        <h3>{resource.title}</h3>

                        <p>{resource.description}</p>

                        <div className="resource-card-meta">
                          <span>{resource.format}</span>
                          <span>{resource.size}</span>
                        </div>

                        <button
                          type="button"
                          className="resource-download-link"
                          onClick={() =>
                            handleDownload(resource)
                          }
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

                <h3>
                  No resources found.
                </h3>

                <p>
                  Try another search term or choose
                  another category.
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
                <span className="section-label">
                  A SIMPLE REMINDER
                </span>

                <h2>
                  Resources support study.
                  Scripture remains the foundation.
                </h2>

                <p>
                  Use guides, maps, timelines, and reference
                  materials to understand the biblical world
                  more clearly while allowing Scripture itself
                  to remain central to your study.
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* CTA */}
        <section className="section resources-cta">
          <div className="container">

            <span className="section-label">
              KEEP EXPLORING
            </span>

            <h2>
              Study carefully.
              <em>Discover deeply.</em>
            </h2>

            <p>
              Continue exploring Pilgrim Truth through Bible
              studies, articles, prophecy, history, and video.
            </p>

            <Link
              to="/bible-studies"
              className="btn btn-primary"
            >
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