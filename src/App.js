import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FirstPage from './FirstPage';
import EndPage from './EndPage';
import './App.css';
import Board from './Board';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/simu" element={<Board />} /> 
        <Route path="/Credits" element={<EndPage />} />
      </Routes>
    </Router>
  );
}

export default App;
