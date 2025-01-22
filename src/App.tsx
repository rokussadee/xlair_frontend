import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import {
  RecoilRoot,
} from 'recoil';
import ShowsPage from './pages/ShowsPage';
import HomePage from './pages/HomePage';
import ShowDetailPage from './pages/ShowDetailPage';
import Header from './components/Header';
import { ThemeProvider } from './components/ui/theme-provider';
import LiveRadioButton from './components/LiveRadioButton';

function App() {
  return (
    <RecoilRoot>

    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Router>
      <div>
        <div className='flex justify-between'>
          <Header />
          </div>

          <div className='app-container'>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shows" element={<ShowsPage />} />
              <Route path="/shows/:showId" element={<ShowDetailPage />} />
            </Routes>
          </div>
            <LiveRadioButton />
      </div>

    </Router>
    </ThemeProvider>
    </RecoilRoot>
  );
}

export default App;
