import {
  ArrowRight,
  BookOpen,
  FileText,
  Flame,
  Heart,
  MessageCircle,
  Play,
  Plus,
  Users,
} from "lucide-react";


import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { getDashboardStats } from "../../services/admin";
import "./AdminDashboard.css";

function AdminDashboard() {
  const { token } = useAuth();

  const [statistics, setStatistics] = useState({
    articles: 0,
    dailyInspirations: 0,
    discussions: 0,
    users: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    const loadStatistics = async () => {
      if (!token) {
        setLoadingStats(false);
        return;
      }

      try {
        setStatsError("");

        const data = await getDashboardStats(token);

        setStatistics(data.statistics);
      } catch (error) {
        console.error(
          "Dashboard statistics error:",
          error
        );

        setStatsError(
          error.message ||
            "Unable to load dashboard statistics."
        );
      } finally {
        setLoadingStats(false);
      }
    };

    loadStatistics();
  }, [token]);

  const statisticsCards = [
    {
      label: "Articles",
      value: statistics.articles,
      icon: FileText,
      path: "/admin/articles",
    },
    {
      label: "Daily Inspirations",
      value: statistics.dailyInspirations,
      icon: Heart,
      path: "/admin/daily-inspirations",
    },
    {
      label: "Discussions",
      value: statistics.discussions,
      icon: MessageCircle,
      path: "/admin/discussions",
    },
    {
      label: "Registered Users",
      value: statistics.users,
      icon: Users,
      path: "/admin/users",
    },
  ];

  const quickActions = [
    {
      label: "New Article",
      description: "Publish a new Pilgrim Truth article.",
      icon: FileText,
      path: "/admin/articles/new",
    },
    {
      label: "New Inspiration",
      description: "Create or schedule a Daily Inspiration.",
      icon: Heart,
      path: "/admin/daily-inspirations/new",
    },
    {
      label: "Add Video",
      description: "Add a YouTube lesson or study.",
      icon: Play,
      path: "/admin/videos/new",
    },
    {
      label: "Upload Resource",
      description: "Add a PDF study resource.",
      icon: BookOpen,
      path: "/admin/resources/new",
    },
  ];

  return (
    <div className="admin-dashboard">

      <section className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">
            PILGRIM TRUTH ADMINISTRATION
          </span>

          <h1>Dashboard</h1>

          <p>
            Manage content, resources, community, and the
            public Pilgrim Truth experience.
          </p>
        </div>
      </section>

      <section className="admin-stat-grid">
        {statisticsCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              to={stat.path}
              className="admin-stat-card"
              key={stat.label}
            >
              <div className="admin-stat-icon">
                <Icon size={20} />
              </div>

              <div className="admin-stat-info">
                <span>{stat.label}</span>

                <strong>
                  {loadingStats ? "..." : stat.value}
                </strong>
              </div>

              <ArrowRight size={17} />
            </Link>
          );
        })}
      </section>

      {statsError && (
        <div className="admin-stats-error">
          {statsError}
        </div>
      )}

      <section className="admin-dashboard-grid">

        <div className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-eyebrow">
                QUICK ACTIONS
              </span>

              <h2>Create content</h2>
            </div>

            <Plus size={20} />
          </div>

          <div className="admin-action-list">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  to={action.path}
                  className="admin-action-item"
                  key={action.label}
                >
                  <div className="admin-action-icon">
                    <Icon size={18} />
                  </div>

                  <div>
                    <strong>{action.label}</strong>
                    <span>{action.description}</span>
                  </div>

                  <ArrowRight size={16} />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-eyebrow">
                COMMUNITY
              </span>

              <h2>Community activity</h2>
            </div>

            <MessageCircle size={20} />
          </div>

          <div className="admin-community-list">

            <Link
              to="/admin/discussions"
              className="admin-community-item"
            >
              <MessageCircle size={18} />

              <div>
                <strong>Discussions</strong>

                <span>
                  Manage community conversations.
                </span>
              </div>

              <ArrowRight size={16} />
            </Link>

            <Link
              to="/admin/users"
              className="admin-community-item"
            >
              <Users size={18} />

              <div>
                <strong>Users</strong>

                <span>
                  View and manage registered users.
                </span>
              </div>

              <ArrowRight size={16} />
            </Link>

            <Link
              to="/admin/reports"
              className="admin-community-item"
            >
              <Flame size={18} />

              <div>
                <strong>Reports</strong>

                <span>
                  Review reported community content.
                </span>
              </div>

              <ArrowRight size={16} />
            </Link>

          </div>
        </div>

      </section>

      <section className="admin-panel admin-dashboard-note">
        <div>
          <span className="admin-eyebrow">
            CONTENT MANAGEMENT
          </span>

          <h2>Your content workspace</h2>

          <p>
            Articles, Daily Inspirations, videos, resources,
            and other public content will be managed from
            this administration area.
          </p>
        </div>

        <Link
          to="/admin/articles"
          className="admin-primary-button"
        >
          Manage Articles
          <ArrowRight size={16} />
        </Link>
      </section>

    </div>
  );
}

export default AdminDashboard;