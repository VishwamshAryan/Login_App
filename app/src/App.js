import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InstagramLogin from './InstagramLogin';
import AuthRedirect from './AuthRedirect';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InstagramLogin />} />
        <Route path="/auth/redirect" element={<AuthRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;
