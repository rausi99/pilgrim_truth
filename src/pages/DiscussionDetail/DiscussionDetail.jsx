import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Lock,
  MessageCircle,
  Send,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import {
  createReply,
  getDiscussion,
} from "../../services/discussions";
import { useAuth } from "../../context/AuthContext";
import "./DiscussionDetail.css";

function DiscussionDetail() {
  const { id } = useParams();
  const { user, token, isAuthenticated } = useAuth();

  const [discussion, setDiscussion] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyContent, setReplyContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [replyLoading, setReplyLoading] = useState(false);
  const [error, setError] = useState("");
  const [replyError, setReplyError] = useState("");

  useEffect(() => {
    const loadDiscussion = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDiscussion(id);

        setDiscussion(data.discussion);
        setReplies(data.replies || []);
      } catch (error) {
        console.error(
          "Discussion detail error:",
          error
        );

        setError(
          error.message ||
            "Unable to load this discussion."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDiscussion();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  const handleReply = async (event) => {
    event.preventDefault();

    setReplyError("");

    if (!replyContent.trim()) {
      setReplyError("Please write a reply.");
      return;
    }

    if (!isAuthenticated) {
      setReplyError(
        "Please sign in to join the conversation."
      );
      return;
    }

    setReplyLoading(true);

    try {
      const data = await createReply(
        id,
        replyContent.trim(),
        token
      );

      setReplies((previous) => [
        ...previous,
        {
          ...data.reply,
          author: user?.name || "You",
          user_id: user?.id,
        },
      ]);

      setReplyContent("");
    } catch (error) {
      console.error(
        "Reply error:",
        error
      );

      setReplyError(
        error.message ||
          "Unable to add your reply."
      );
    } finally {
      setReplyLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="discussion-detail-page">
          <div className="container discussion-detail-message">
            <p>Loading discussion...</p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  if (error || !discussion) {
    return (
      <>
        <Navbar />

        <main className="discussion-detail-page">
          <div className="container discussion-detail-message">

            <MessageCircle size={34} />

            <h1>
              Discussion unavailable
            </h1>

            <p>
              {error ||
                "This discussion could not be found."}
            </p>

            <Link
              to="/discussions"
              className="primary-button"
            >
              <ArrowLeft size={17} />
              Back to Discussions
            </Link>

          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="discussion-detail-page">

        {/* HERO */}
        <section className="discussion-detail-hero">
          <div className="container">

            <Link
              to="/discussions"
              className="back-link"
            >
              <ArrowLeft size={16} />
              Back to Discussions
            </Link>

            <div className="discussion-detail-category">
              <BookOpen size={15} />
              {discussion.category}
            </div>

            <h1>
              {discussion.title}
            </h1>

            <div className="discussion-detail-meta">
              <span>
                Started by{" "}
                <strong>
                  {discussion.author}
                </strong>
              </span>

              <span>
                {formatDate(
                  discussion.created_at
                )}
              </span>

              <span>
                {replies.length}{" "}
                {replies.length === 1
                  ? "reply"
                  : "replies"}
              </span>
            </div>

          </div>
        </section>

        {/* DISCUSSION */}
        <section className="section discussion-detail-content">
          <div className="container">

            <div className="discussion-detail-layout">

              <article className="discussion-original">

                <div className="discussion-original-label">
                  ORIGINAL DISCUSSION
                </div>

                <div className="discussion-original-body">
                  {discussion.content}
                </div>

                {discussion.is_locked && (
                  <div className="discussion-locked">
                    <Lock size={17} />
                    This discussion is locked.
                  </div>
                )}

              </article>

              <section className="discussion-replies">

                <div className="discussion-replies-heading">
                  <div>
                    <span className="section-label">
                      COMMUNITY
                    </span>

                    <h2>
                      Join the
                      <em> conversation.</em>
                    </h2>
                  </div>

                  <span className="reply-count">
                    {replies.length}{" "}
                    {replies.length === 1
                      ? "Reply"
                      : "Replies"}
                  </span>
                </div>

                {replies.length === 0 ? (
                  <div className="no-replies">
                    <MessageCircle size={28} />

                    <h3>
                      No replies yet.
                    </h3>

                    <p>
                      Be the first to contribute
                      to this conversation.
                    </p>
                  </div>
                ) : (
                  <div className="replies-list">
                    {replies.map((reply) => (
                      <article
                        key={reply.id}
                        className="reply-card"
                      >
                        <div className="reply-avatar">
                          {reply.author
                            ?.charAt(0)
                            ?.toUpperCase() || "P"}
                        </div>

                        <div className="reply-content">

                          <div className="reply-header">
                            <strong>
                              {reply.author}
                            </strong>

                            <span>
                              {formatDate(
                                reply.created_at
                              )}
                            </span>
                          </div>

                          <p>
                            {reply.content}
                          </p>

                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {!discussion.is_locked && (
                  <div className="reply-form-wrapper">

                    {isAuthenticated ? (
                      <form
                        className="reply-form"
                        onSubmit={handleReply}
                      >

                        <div className="reply-form-heading">
                          <div className="reply-avatar">
                            {user?.name
                              ?.charAt(0)
                              ?.toUpperCase() || "P"}
                          </div>

                          <div>
                            <strong>
                              {user?.name}
                            </strong>

                            <span>
                              Add your perspective
                            </span>
                          </div>
                        </div>

                        {replyError && (
                          <div className="discussion-form-error">
                            {replyError}
                          </div>
                        )}

                        <textarea
                          value={replyContent}
                          onChange={(event) =>
                            setReplyContent(
                              event.target.value
                            )
                          }
                          placeholder="Share your thoughts..."
                          rows={6}
                        />

                        <div className="reply-form-footer">
                          <span>
                            Keep the conversation
                            respectful and thoughtful.
                          </span>

                          <button
                            type="submit"
                            className="primary-button"
                            disabled={replyLoading}
                          >
                            {replyLoading
                              ? "Posting..."
                              : "Post Reply"}

                            {!replyLoading && (
                              <Send size={16} />
                            )}
                          </button>
                        </div>

                      </form>
                    ) : (
                      <div className="reply-signin">

                        <MessageCircle size={22} />

                        <div>
                          <strong>
                            Want to join the
                            conversation?
                          </strong>

                          <p>
                            Sign in to share your
                            thoughts and reply to
                            this discussion.
                          </p>
                        </div>

                        <Link
                          to="/login"
                          className="secondary-button"
                        >
                          Sign In
                          <ArrowRight size={16} />
                        </Link>

                      </div>
                    )}

                  </div>
                )}

              </section>

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

export default DiscussionDetail;