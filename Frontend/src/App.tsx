// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import HomePage from "./pages/HomePage";
import ReelsPage from './pages/ReelsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ExplorePage } from './pages/ExplorPage';

function App() {
  return (
    <Router>
      <div className="App bg-black min-h-screen text-white">
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Default route */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reels" element={<ReelsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
           <Route path="/explore" element={<ExplorePage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;