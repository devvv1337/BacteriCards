import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HardLearning from './components/HardLearning';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#121212]">
        <nav className="bg-[#1E1E1E] shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex items-center px-2 py-2 text-[#BB86FC] font-semibold">
                  BacteriCards
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="py-4">
          <Routes>
            <Route path="/" element={<Navigate to="/hardlearning" replace />} />
            <Route path="/hardlearning" element={<HardLearning />} />
            <Route path="*" element={<Navigate to="/hardlearning" replace />} />
          </Routes>
        </main>

        <footer className="bg-[#1E1E1E] border-t border-[rgba(187,134,252,0.2)] mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-[rgba(255,255,255,0.6)] text-sm">
            <p>
              BacteriCards - Votre outil d'apprentissage des bactéries
              <a 
                href="https://www.linkedin.com/in/julien-1ee7/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="ml-2 text-[#BB86FC] hover:text-[#03DAC6] transition-colors"
              >
                par Julien
              </a>
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
