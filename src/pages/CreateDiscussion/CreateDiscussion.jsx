import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Flame,
  Heart,
  History,
  Send,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import {
  createDiscussion,
  getDiscussionCategories,
} from "../../services/discussions";
import { useAuth } from "../../context/AuthContext";

function CreateDiscussion() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, loading: authLoading } =
    useAuth();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] =
    useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getDiscussionCategories();

        setCategories(data.categories || []);
      } catch (error) {
        console.error(
          "Category loading error:",
          error
        );

        setError(
          error.message ||
            "Unable to load discussion categories."
        );
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.title.trim()) {
      setError("Please enter a discussion title.");
      return;
    }

    if (!formData.category_id) {
      setError("Please choose a discussion category.");
      return;
    }

    if (!formData.content.trim()) {
      setError("Please write something for your discussion.");
      return;
    }

    setLoading(true);

    try {
      const data = await createDiscussion(
        {
          title: formData.title.trim(),
          category_id: Number(formData.category_id),
          content: formData.content.trim(),
        },
        token
      );

      navigate(
        `/discussions/${data.discussion.id}`
      );
    } catch (error) {
      console.error(
        "Create discussion error:",
        error
      );

      setError(
        error.message ||
          "Unable to create discussion."
      );
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Prophecy":
        return Flame;

      case "Bible History":
        return History;

      case "Christian Living":
      case "Health":
        return Heart;

      case "Bible Study":
      default:
        return BookOpen;
    }
  };

  if (authLoading) {
    return (
      <>
        <Navbar />

        <main className="create-discussion-page">
          <div className="container create-discussion-loading">
            Loading...
          </div>
        </main>

        <Footer />
      </>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />

      <main className="create-discussion-page">

        <section className="create-discussion-hero">
          <div className="container">

            <Link
              to="/discussions"
              className="back-link"
            >
              <ArrowLeft size={16} />
              Back to Discussions
            </Link>

            <span className="section-label">
              COMMUNITY
            </span>

            <h1>
              Start a
              <em> discussion.</em>
            </h1>

            <p>
              Ask a meaningful question, share an
              insight, or open a conversation around
              Scripture.
            </p>

          </div>
        </section>

        <section className="section create-discussion-section">
          <div className="container">

            <div className="create-discussion-layout">

              <div className="create-discussion-main">

                <div className="create-discussion-heading">
                  <span className="section-label">
                    NEW DISCUSSION
                  </span>

                  <h2>
                    What would you like
                    <em> to explore?</em>
                  </h2>

                  <p>
                    Write clearly and give other
                    readers enough context to join
                    the conversation.
                  </p>
                </div>

                {error && (
                  <div className="discussion-form-error">
                    {error}
                  </div>
                )}

                <form
                  className="create-discussion-form"
                  onSubmit={handleSubmit}
                >

                  <div className="form-group">
                    <label htmlFor="discussion-title">
                      Discussion title
                    </label>

                    <input
                      id="discussion-title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="What would you like to discuss?"
                      maxLength={255}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="discussion-category">
                      Category
                    </label>

                    <select
                      id="discussion-category"
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                      disabled={categoriesLoading}
                      required
                    >
                      <option value="">
                        {categoriesLoading
                          ? "Loading categories..."
                          : "Choose a category"}
                      </option>

                      {categories.map(
                        (category) => (
                          <option
                            key={category.id}
                            value={category.id}
                          >
                            {category.name}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="discussion-content">
                      Your discussion
                    </label>

                    <textarea
                      id="discussion-content"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      placeholder="Share your question, thoughts, or insight..."
                      rows={10}
                      required
                    />
                  </div>

                  <div className="discussion-form-footer">

                    <span>
                      Posting as{" "}
                      <strong>
                        {user?.name}
                      </strong>
                    </span>

                    <button
                      type="submit"
                      className="auth-submit create-discussion-submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <span>
                          Publishing...
                        </span>
                      ) : (
                        <>
                          <span>
                            Publish Discussion
                          </span>

                          <Send size={17} />
                        </>
                      )}
                    </button>

                  </div>

                </form>

              </div>

              <aside className="create-discussion-sidebar">

                <div className="discussion-sidebar-card">

                  <span className="section-label">
                    BEFORE YOU POST
                  </span>

                  <h3>
                    Start with a thoughtful
                    question.
                  </h3>

                  <p>
                    Good discussions make it easy for
                    others to understand the question
                    and contribute meaningfully.
                  </p>

                  <div className="posting-tips">

                    <div>
                      <strong>01</strong>
                      <span>
                        Be clear about what you are
                        asking.
                      </span>
                    </div>

                    <div>
                      <strong>02</strong>
                      <span>
                        Give enough context for others
                        to respond.
                      </span>
                    </div>

                    <div>
                      <strong>03</strong>
                      <span>
                        Keep the conversation respectful.
                      </span>
                    </div>

                  </div>

                </div>

                <div className="discussion-sidebar-note">
                  <BookOpen size={18} />

                  <div>
                    <strong>
                      Scripture first
                    </strong>

                    <p>
                      When discussing biblical topics,
                      consider supporting your thoughts
                      with relevant Scripture.
                    </p>
                  </div>
                </div>

              </aside>

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

export default CreateDiscussion;