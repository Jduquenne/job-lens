import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { DataManagement } from './pages/DataManagement';

function App() {
  return (
    <BrowserRouter basename="/job-lens">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/data" element={<DataManagement />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;