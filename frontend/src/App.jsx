// App.jsx
import { Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import Skill_Analysis from './screens/Skill_Analysis.jsx';
import LearningPathsPage from './screens/Learning_Path.jsx';
import JobMatchingPage from './screens/Job_Matching.jsx';
import CredentialsPage from './screens/Credentials.jsx';
import Profile from './screens/User_Profile.jsx';

function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Home Page</h1>
      <p className="mt-2 text-gray-600">Welcome to the Home Page!</p>
    </div>
  );
}

function About() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">About Page</h1>
      <p className="mt-2 text-gray-600">Learn more about us here.</p>
    </div>
  );
}

function NotFound() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-red-500">404 - Not Found</h1>
      <p className="mt-2 text-gray-600">Sorry, page not found!</p>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100">
     

      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/skill-analysis" element={<Skill_Analysis />} />
          <Route path="/learning-path" element={<LearningPathsPage />} />
          <Route path="/job-matching" element={<JobMatchingPage />} />
          <Route path="/credentials" element={<CredentialsPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>

        
      </main>
    </div>
  );
}

export default App;
