import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { recipeApi } from '../../api/recipeApi';
import './Main.scss'; // ✅ SCSS 연결

const Main = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await recipeApi.getRecipes();
        
        if (Array.isArray(response.data)) {
          setRecipes(response.data);
        } else if (response.data && Array.isArray(response.data.items)) {
          setRecipes(response.data.items);
        } else {
          setRecipes([]); 
        }
      } catch (err) {
        setError("레시피를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  if (loading) return <div className="main-status">레시피를 불러오는 중...</div>;
  if (error) return <div className="main-status error">{error}</div>;

  return (
    <div className="main-page">
      <header className="main-header">
        <h2>🔥 최신 레시피 목록</h2>
      </header>

      {recipes.length === 0 ? (
        <div className="empty-state">
          등록된 레시피가 없습니다. 첫 레시피를 작성해보세요!
        </div>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <article key={recipe.id} className="recipe-item-card">
              <div className="card-image-wrapper">
                <img 
                  src={
                    recipe.image_url?.startsWith('http') 
                    ? recipe.image_url 
                    : `http://localhost:8000${recipe.image_url}` 
                  } 
                  alt={recipe.title} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://picsum.photos/300/180';
                  }} 
                />
              </div>

              <div className="card-content">
                <h3 className="card-title">{recipe.title}</h3>
                <div className="card-info">
                  <span className="author">👤 {recipe.owner_email?.split('@')[0]}</span>
                  <span className="likes">❤️ {recipe.like_count || 0}</span>
                </div>
                <hr className="divider" />
                <Link to={`/recipe/${recipe.id}`} className="detail-link">
                  상세보기
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Main;