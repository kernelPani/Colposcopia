import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PatientList from './pages/PatientList';
import PatientDetail from './pages/PatientDetail';
import NewExam from './pages/NewExam';
import ExamDetail from './pages/ExamDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="patients" element={<PatientList />} />
          <Route path="patients/:id" element={<PatientDetail />} />
          <Route path="patients/:id/new-exam" element={<NewExam />} />
          <Route path="exams/:examId" element={<ExamDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
