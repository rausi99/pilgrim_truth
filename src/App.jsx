import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import VideoDetail from "./pages/VideoDetail/VideoDetail";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/bible-studies"
          element={<BibleStudies />}
        />

        <Route
          path="/prophecy"
          element={<Prophecy />}
        />

        <Route
          path="/history"
          element={<History />}
        />

        <Route
          path="/christian-living"
          element={<ChristianLiving />}
        />

        <Route
          path="/health"
          element={<Health />}
        />

        <Route
          path="/articles"
          element={<Articles />}
        />

        <Route
          path="/articles/:slug"
          element={<ArticleDetail />}
        />

        <Route
          path="/videos"
          element={<Videos />}
        />

        <Route
          path="/videos/:slug"
          element={<VideoDetail />}
        />

        <Route
          path="/resources"
          element={<Resources />}
        />

        <Route
          path="/discussions"
          element={<Discussions />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;