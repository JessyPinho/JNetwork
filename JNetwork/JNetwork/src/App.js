import "./App.css";

// react-router. To create routes and be able to redirect
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Import all pages/screens components
import LoginScreen from "./screens/auth/login_screen";
import RegisterScreen from "./screens/auth/register_screen";
import ResetScreen from "./screens/auth/reset_screen";
import Feed from "./screens/feed"
import FeedDetail from "./screens/feed_detail"
import AskQuestion from "./screens/ask_question";
import VideoDetail from "./screens/video_detail"
import Response from './screens/response'
import Profile from "./screens/profile"
import ProfileSettings from "./screens/profile_settings"
import ProfileDetail from "./screens/profile_detail"
import ProForm from "./screens/pro_form"
import MyVideos from "./screens/my_videos"
import Community from "./screens/community"
import CommunityDetail from "./screens/community_detail"
// unused
import CoinsScreen from "./screens/coins_screen"
// unused
import Match from "./screens/match";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<LoginScreen />} />
          <Route exact path="/register" element={<RegisterScreen />} />
          <Route exact path="/reset" element={<ResetScreen />} />

          <Route path="/feed" element={<Feed />} />
          <Route path="/feed/:id" element={<FeedDetail />} />

          <Route path="/askquestion" element={<AskQuestion />} />
          <Route path="/video/:id" element={<VideoDetail />} />

          <Route path="/response/:id" element={<Response />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<ProfileSettings />} />
          <Route path="/match" element={<Match />} />

          <Route path="/profile/:id" element={<ProfileDetail />} />

          <Route path="/proform" element={<ProForm />} />

          <Route path="/community" element={<Community />} />
          <Route path="/community/:id" element={<CommunityDetail />} />

          <Route path="/my-videos" element={<MyVideos />} />

          <Route path="/coins" element={<CoinsScreen />} />

        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="colored"
      />
    </div>
  );
}
export default App;
   

