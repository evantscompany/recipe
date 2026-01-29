import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Main from './pages/Main';
import RecipeDetail from './pages/RecipeDetail';
import Write from './pages/Write';
import LoginPage from './pages/Login';
import Signup from './pages/Signup';

// ✅ 정확한 경로: src/styles/main.scss
import './styles/main.scss'; 

function App() {
  return (
    <Router>
      <div className="App">
        {/* 모든 페이지 공통 네비게이션 */}
        <Navbar /> 

        {/* main.scss의 .container 설정을 따름 */}
        <main className="container">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/write" element={<Write />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path='/signup' element={<Signup/>}/>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;