import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CardDashboard } from './pages/CardDashboard';
import { CardView } from './pages/CardView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CardDashboard />} />
        <Route path="/card/:id" element={<CardView />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;