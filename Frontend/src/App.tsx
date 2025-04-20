// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
// import HomePage from "./pages/HomePage"; // Import the new HomePage
// import ReelsPage from './pages/ReelsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* <Route path="/" element={<HomePage />} /> Default route */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* <Route path="/reels" element={<ReelsPage />} /> */}

        </Routes>
      </div>
    </Router>
  );
}

export default App;
