// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import ResultPage from './pages/ResultPage';
import SecretReading from './pages/SecretReading';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LoginPage />} />
        <Route path="main" element={<MainPage />} />
        <Route path="result" element={<ResultPage />} />
        <Route path="secret" element={<SecretReading />} />
      </Route>
    </Routes>
  );
}
export default App;