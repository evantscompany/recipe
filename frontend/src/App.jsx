import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Main from './pages/Main';
import RecipeDetail from './pages/RecipeDetail';
import Write from './pages/Write';
import LoginPage from './pages/Login';
import Signup from './pages/Signup';
import './styles/main.scss'; 
import MyRecipes from './pages/MyRecipes';

function App() {
  return (
    <Router>
      <div className="App app-layout">
        <Navbar /> 
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/write" element={<Write />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path='/signup' element={<Signup/>}/>
            <Route path="/my-recipes" element={<MyRecipes />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;