import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import BottomNav from './components/BottomNav'
import Footer from './components/Footer'
import Work from './pages/Work'
import ProjectDetail from './pages/ProjectDetail'
import Resume from './pages/Resume'
import Hobby from './pages/Hobby'

function AppContent() {
  const location = useLocation()

  return (
    <div
      className="font-['Inter',system-ui,sans-serif] min-h-screen transition-colors duration-500"
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--text-primary)',
        backgroundImage: 'radial-gradient(circle, var(--dot-color) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Work />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/hobby" element={<Hobby />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <BottomNav />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
