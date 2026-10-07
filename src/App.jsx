import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/layout/ScrollToTop";

// =========================================================
// PUBLIC PAGES
// =========================================================

import Home from "./pages/Home/Home";
import BibleStudies from "./pages/BibleStudies/BibleStudies";
import Prophecy from "./pages/Prophecy/Prophecy";
import History from "./pages/History/History";
import ChristianLiving from "./pages/ChristianLiving/ChristianLiving";
import Health from "./pages/Health/Health";
import Articles from "./pages/Articles/Articles";
import Videos from "./pages/Videos/Videos";
import Resources from "./pages/Resources/Resources";
import Discussions from "./pages/Discussions/Discussions";

import ArticleDetail from "./pages/ArticleDetail/ArticleDetail";
import BibleStudyDetail from "./pages/BibleStudyDetail/BibleStudyDetail";
import ProphecyDetail from "./pages/ProphecyDetail/ProphecyDetail";
import HistoryDetail from "./pages/HistoryDetail/HistoryDetail";
import VideoDetail from "./pages/VideoDetail/VideoDetail";

import DailyInspirations from "./pages/DailyInspirations/DailyInspirations";
import DailyInspirationDetail from "./pages/DailyInspirationDetail/DailyInspirationDetail";

import CreateDiscussion from "./pages/CreateDiscussion/CreateDiscussion";
import DiscussionDetail from "./pages/DiscussionDetail/DiscussionDetail";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

// =========================================================
// ADMIN AUTH + LAYOUT
// =========================================================

import AdminRoute from "./components/navigation/AdminRoute";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminHomepage from "./pages/Admin/Homepage/AdminHomepage";

// =========================================================
// ADMIN — ARTICLES
// =========================================================

import AdminArticles from "./pages/AdminArticles/AdminArticles";
import AdminArticleForm from "./pages/AdminArticleForm/AdminArticleForm";

// =========================================================
// ADMIN — DAILY INSPIRATIONS
// =========================================================

import AdminDailyInspirations from "./pages/AdminDailyInspirations/AdminDailyInspirations";
import AdminDailyInspirationForm from "./pages/AdminDailyInspirationForm/AdminDailyInspirationForm";

// =========================================================
// ADMIN — BIBLE STUDIES
// =========================================================

import AdminBibleStudies from "./pages/AdminBibleStudies/AdminBibleStudies";
import AdminBibleStudyForm from "./pages/AdminBibleStudyForm/AdminBibleStudyForm";

// =========================================================
// ADMIN — CHRISTIAN LIVING
// =========================================================

import AdminChristianLiving from "./pages/Admin/ChristianLiving/AdminChristianLiving";
import AdminChristianLivingForm from "./pages/Admin/ChristianLiving/AdminChristianLivingForm";

// =========================================================
// ADMIN — HEALTH
// =========================================================

import AdminHealth from "./pages/Admin/Health/AdminHealth";
import AdminHealthForm from "./pages/Admin/Health/AdminHealthForm";

// =========================================================
// ADMIN — PROPHECY
// =========================================================

import AdminProphecies from "./pages/AdminProphecies/AdminProphecies";
import AdminProphecyForm from "./pages/AdminProphecyForm/AdminProphecyForm";

// =========================================================
// ADMIN — HISTORY
// =========================================================

import AdminHistory from "./pages/AdminHistory/AdminHistory";
import AdminHistoryForm from "./pages/AdminHistoryForm/AdminHistoryForm";

// =========================================================
// ADMIN — VIDEOS
// =========================================================

import AdminVideos from "./pages/AdminVideos/AdminVideos";
import AdminVideoForm from "./pages/AdminVideoForm/AdminVideoForm";

// =========================================================
// ADMIN — RESOURCES
// =========================================================

import AdminResources from "./pages/AdminResources/AdminResources";
import AdminResourceForm from "./pages/AdminResourceForm/AdminResourceForm";

// =========================================================
// ADMIN — COMMUNITY
// =========================================================

import AdminDiscussions from "./pages/AdminDiscussions/AdminDiscussions";
import AdminUsers from "./pages/AdminUsers/AdminUsers";
import AdminReports from "./pages/AdminReports/AdminReports";

// =========================================================
// ADMIN — SYSTEM
// =========================================================

import AdminSettings from "./pages/AdminSettings/AdminSettings";


function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <Routes>

        {/* =====================================================
            PUBLIC ROUTES
            ===================================================== */}

        <Route path="/" element={<Home />} />

        {/* Bible Studies */}
        <Route
          path="/bible-studies"
          element={<BibleStudies />}
        />

        <Route
          path="/bible-studies/:slug"
          element={<BibleStudyDetail />}
        />

        {/* Prophecy */}
        <Route
          path="/prophecy"
          element={<Prophecy />}
        />

        <Route
          path="/prophecy/:slug"
          element={<ProphecyDetail />}
        />

        {/* History */}
        <Route
          path="/history"
          element={<History />}
        />

        <Route
          path="/history/:slug"
          element={<HistoryDetail />}
        />

        {/* Christian Living */}
        <Route
          path="/christian-living"
          element={<ChristianLiving />}
        />

        {/* Health */}
        <Route
          path="/health"
          element={<Health />}
        />

        {/* Articles */}
        <Route
          path="/articles"
          element={<Articles />}
        />

        <Route
          path="/articles/:slug"
          element={<ArticleDetail />}
        />

        {/* Videos */}
        <Route
          path="/videos"
          element={<Videos />}
        />

        <Route
          path="/videos/:slug"
          element={<VideoDetail />}
        />

        {/* Resources */}
        <Route
          path="/resources"
          element={<Resources />}
        />

        {/* Daily Inspirations */}
        <Route
          path="/daily-inspirations"
          element={<DailyInspirations />}
        />

        <Route
          path="/daily-inspirations/:id"
          element={<DailyInspirationDetail />}
        />

        {/* Discussions */}
        <Route
          path="/discussions"
          element={<Discussions />}
        />

        <Route
          path="/discussions/new"
          element={<CreateDiscussion />}
        />

        <Route
          path="/discussions/:id"
          element={<DiscussionDetail />}
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =====================================================
            PROTECTED ADMIN ROUTES
            ===================================================== */}

        <Route element={<AdminRoute />}>

          {/* ===================================================
              SHARED ADMIN LAYOUT
              =================================================== */}

          <Route
            path="/admin"
            element={<AdminLayout />}
          >

            {/* =================================================
                DASHBOARD
                ================================================= */}

            <Route
              index
              element={<AdminDashboard />}
            />


            {/* =================================================
                HOMEPAGE MANAGEMENT
                ================================================= */}

            <Route
              path="homepage"
              element={<AdminHomepage />}
            />


            {/* =================================================
                ARTICLES
                ================================================= */}

            <Route
              path="articles"
              element={<AdminArticles />}
            />

            <Route
              path="articles/new"
              element={<AdminArticleForm />}
            />

            <Route
              path="articles/:id/edit"
              element={<AdminArticleForm />}
            />


            {/* =================================================
                DAILY INSPIRATIONS
                ================================================= */}

            <Route
              path="daily-inspirations"
              element={<AdminDailyInspirations />}
            />

            <Route
              path="daily-inspirations/new"
              element={<AdminDailyInspirationForm />}
            />

            <Route
              path="daily-inspirations/:id/edit"
              element={<AdminDailyInspirationForm />}
            />


            {/* =================================================
                BIBLE STUDIES
                ================================================= */}

            <Route
              path="bible-studies"
              element={<AdminBibleStudies />}
            />

            <Route
              path="bible-studies/new"
              element={<AdminBibleStudyForm />}
            />

            <Route
              path="bible-studies/:id/edit"
              element={<AdminBibleStudyForm />}
            />


            {/* =================================================
                CHRISTIAN LIVING
                ================================================= */}

            <Route
              path="christian-living"
              element={<AdminChristianLiving />}
            />

            <Route
              path="christian-living/new"
              element={<AdminChristianLivingForm />}
            />

            <Route
              path="christian-living/:id/edit"
              element={<AdminChristianLivingForm />}
            />


            {/* =================================================
                HEALTH
                ================================================= */}

            <Route
              path="health"
              element={<AdminHealth />}
            />

            <Route
              path="health/new"
              element={<AdminHealthForm />}
            />

            <Route
              path="health/:id/edit"
              element={<AdminHealthForm />}
            />


            {/* =================================================
                PROPHECY
                ================================================= */}

            <Route
              path="prophecy"
              element={<AdminProphecies />}
            />

            <Route
              path="prophecy/new"
              element={<AdminProphecyForm />}
            />

            <Route
              path="prophecy/:id/edit"
              element={<AdminProphecyForm />}
            />


            {/* =================================================
                HISTORY
                ================================================= */}

            <Route
              path="history"
              element={<AdminHistory />}
            />

            <Route
              path="history/new"
              element={<AdminHistoryForm />}
            />

            <Route
              path="history/:id/edit"
              element={<AdminHistoryForm />}
            />


            {/* =================================================
                VIDEOS
                ================================================= */}

            <Route
              path="videos"
              element={<AdminVideos />}
            />

            <Route
              path="videos/new"
              element={<AdminVideoForm />}
            />

            <Route
              path="videos/:id/edit"
              element={<AdminVideoForm />}
            />


            {/* =================================================
                RESOURCES
                ================================================= */}

            <Route
              path="resources"
              element={<AdminResources />}
            />

            <Route
              path="resources/new"
              element={<AdminResourceForm />}
            />

            <Route
              path="resources/:id/edit"
              element={<AdminResourceForm />}
            />


            {/* =================================================
                DISCUSSIONS
                ================================================= */}

            <Route
              path="discussions"
              element={<AdminDiscussions />}
            />


            {/* =================================================
                USERS
                ================================================= */}

            <Route
              path="users"
              element={<AdminUsers />}
            />


            {/* =================================================
                REPORTS
                ================================================= */}

            <Route
              path="reports"
              element={<AdminReports />}
            />


            {/* =================================================
                SETTINGS
                ================================================= */}

            <Route
              path="settings"
              element={<AdminSettings />}
            />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
