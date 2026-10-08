import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  Trash2,
} from "lucide-react";

import { useAuth } from "../../../../context/AuthContext";
import "./FeaturedStudies.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

function FeaturedStudies() {
  const { user } = useAuth();

  const [studies, setStudies] = useState([]);
  const [selectedStudies, setSelectedStudies] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  
const getToken = () => {
  return (
    user?.token ||
    localStorage.getItem("pilgrim_truth_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken")
  );
};
  const getHeaders = () => {
    const token = getToken();

    return {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    };
  };

  const loadStudies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/admin/homepage/featured-studies/available`,
        {
          headers: getHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to load Bible Studies."
        );
      }

      const availableStudies =
        Array.isArray(data?.studies)
          ? data.studies
          : [];

      setStudies(availableStudies);

      const currentlySelected =
        availableStudies
          .filter((study) => study.featured)
          .sort(
            (a, b) =>
              Number(a.display_order) -
              Number(b.display_order)
          );

      setSelectedStudies(currentlySelected);
    } catch (loadError) {
      console.error(loadError);

      setError(
        loadError.message ||
          "Unable to load featured studies."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudies();
  }, []);

  const filteredStudies = useMemo(() => {
    const query = searchTerm
      .trim()
      .toLowerCase();

    if (!query) {
      return studies;
    }

    return studies.filter((study) =>
      [
        study.title,
        study.excerpt,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query)
        )
    );
  }, [studies, searchTerm]);

  const isSelected = (studyId) => {
    return selectedStudies.some(
      (study) =>
        Number(study.id) === Number(studyId)
    );
  };

  const handleSelect = (study) => {
    setSuccess("");
    setError("");

    if (isSelected(study.id)) {
      setSelectedStudies((current) =>
        current.filter(
          (item) =>
            Number(item.id) !==
            Number(study.id)
        )
      );

      return;
    }

    if (selectedStudies.length >= 3) {
      setError(
        "You can feature a maximum of three Bible Studies."
      );

      return;
    }

    setSelectedStudies((current) => [
      ...current,
      study,
    ]);
  };

  const removeSelected = (studyId) => {
    setSuccess("");
    setError("");

    setSelectedStudies((current) =>
      current.filter(
        (study) =>
          Number(study.id) !==
          Number(studyId)
      )
    );
  };

  const moveSelected = (index, direction) => {
    setSuccess("");
    setError("");

    const newIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      newIndex < 0 ||
      newIndex >= selectedStudies.length
    ) {
      return;
    }

    setSelectedStudies((current) => {
      const updated = [...current];

      [
        updated[index],
        updated[newIndex],
      ] = [
        updated[newIndex],
        updated[index],
      ];

      return updated;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        studies: selectedStudies.map(
          (study, index) => ({
            bible_study_id: Number(study.id),
            display_order: index + 1,
          })
        ),
      };

      const response = await fetch(
        `${API_URL}/admin/homepage/featured-studies`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to save featured studies."
        );
      }

      const savedStudies =
        Array.isArray(data?.studies)
          ? data.studies
          : [];

      /*
       * Convert the API response back into
       * the full study objects used by the UI.
       */
      const orderedStudies =
        savedStudies
          .map((saved) => {
            return (
              studies.find(
                (study) =>
                  Number(study.id) ===
                  Number(saved.bible_study_id)
              ) || saved
            );
          })
          .filter(Boolean);

      setSelectedStudies(orderedStudies);

      setSuccess(
        "Featured studies updated successfully."
      );
    } catch (saveError) {
      console.error(saveError);

      setError(
        saveError.message ||
          "Unable to save featured studies."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="featured-studies-manager">
      <div className="featured-studies-heading">
        <div>
          <span className="featured-studies-eyebrow">
            HOMEPAGE CONTENT
          </span>

          <h2>Featured Bible Studies</h2>

          <p>
            Choose up to three published Bible
            Studies to display on the homepage.
          </p>
        </div>

        <div className="featured-studies-count">
          <strong>
            {selectedStudies.length}
          </strong>

          <span>/ 3 selected</span>
        </div>
      </div>

      {error && (
        <div
          className="featured-studies-alert error"
          role="alert"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="featured-studies-alert success"
          role="status"
        >
          {success}
        </div>
      )}

      <div className="featured-studies-layout">
        {/* =================================================
            SELECTED STUDIES
            ================================================= */}

        <div className="featured-studies-selected">
          <div className="featured-studies-panel-header">
            <div>
              <h3>Selected Studies</h3>

              <p>
                These will appear in homepage
                order.
              </p>
            </div>
          </div>

          {selectedStudies.length === 0 ? (
            <div className="featured-studies-empty">
              <div className="featured-studies-empty-icon">
                <Check size={20} />
              </div>

              <strong>
                No studies selected
              </strong>

              <p>
                Select published Bible Studies
                from the list.
              </p>
            </div>
          ) : (
            <div className="featured-studies-selected-list">
              {selectedStudies.map(
                (study, index) => (
                  <article
                    className="featured-study-selected-card"
                    key={study.id}
                  >
                    <div className="featured-study-number">
                      {index + 1}
                    </div>

                    <div className="featured-study-selected-content">
                      <h4>{study.title}</h4>

                      {study.excerpt && (
                        <p>
                          {study.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="featured-study-actions">
                      <button
                        type="button"
                        onClick={() =>
                          moveSelected(
                            index,
                            "up"
                          )
                        }
                        disabled={index === 0}
                        aria-label={`Move ${study.title} up`}
                        title="Move up"
                      >
                        <ChevronUp size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          moveSelected(
                            index,
                            "down"
                          )
                        }
                        disabled={
                          index ===
                          selectedStudies.length -
                            1
                        }
                        aria-label={`Move ${study.title} down`}
                        title="Move down"
                      >
                        <ChevronDown
                          size={17}
                        />
                      </button>

                      <button
                        type="button"
                        className="remove"
                        onClick={() =>
                          removeSelected(
                            study.id
                          )
                        }
                        aria-label={`Remove ${study.title}`}
                        title="Remove"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </article>
                )
              )}
            </div>
          )}

          <button
            type="button"
            className="featured-studies-save"
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Featured Studies"}
          </button>
        </div>

        {/* =================================================
            AVAILABLE STUDIES
            ================================================= */}

        <div className="featured-studies-available">
          <div className="featured-studies-panel-header">
            <div>
              <h3>Published Bible Studies</h3>

              <p>
                Select the studies you want to
                feature.
              </p>
            </div>
          </div>

          <div className="featured-studies-search">
            <Search size={18} />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Search Bible Studies..."
              aria-label="Search Bible Studies"
            />
          </div>

          {loading ? (
            <div className="featured-studies-loading">
              Loading Bible Studies...
            </div>
          ) : filteredStudies.length ===
            0 ? (
            <div className="featured-studies-empty">
              <strong>
                No published studies found
              </strong>

              <p>
                Try another search or publish
                a Bible Study first.
              </p>
            </div>
          ) : (
            <div className="featured-studies-list">
              {filteredStudies.map(
                (study) => {
                  const selected =
                    isSelected(study.id);

                  return (
                    <button
                      type="button"
                      key={study.id}
                      className={
                        selected
                          ? "featured-study-option selected"
                          : "featured-study-option"
                      }
                      onClick={() =>
                        handleSelect(study)
                      }
                    >
                      <span className="featured-study-option-check">
                        {selected && (
                          <Check size={15} />
                        )}
                      </span>

                      <span className="featured-study-option-content">
                        <strong>
                          {study.title}
                        </strong>

                        {study.excerpt && (
                          <small>
                            {study.excerpt}
                          </small>
                        )}
                      </span>

                      <span className="featured-study-option-status">
                        {selected
                          ? "Selected"
                          : "Select"}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default FeaturedStudies;
