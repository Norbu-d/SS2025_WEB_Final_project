// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
<<<<<<< HEAD
// import HomePage from "./pages/HomePage"; // Import the new HomePage
// import ReelsPage from './pages/ReelsPage';
=======
import HomePage from "./pages/HomePage"; // Import the new HomePage
>>>>>>> ff678ebe110a12db3bf2e860efe21720099fba15

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
<<<<<<< HEAD
          {/* <Route path="/" element={<HomePage />} /> Default route */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* <Route path="/reels" element={<ReelsPage />} /> */}
=======
          <Route path="/" element={<HomePage />} /> {/* Default route */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
>>>>>>> ff678ebe110a12db3bf2e860efe21720099fba15

        </Routes>
      </div>
    </Router>
  );
}

export default App;
