import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Home } from '@/pages/Home';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isDarkMode } = useAppStore();
  useAuth(); // Verify authentication on app load

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;