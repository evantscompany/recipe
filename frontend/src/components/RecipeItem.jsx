import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecipeItem = ({ recipe }) => {
  const navigate = useNavigate();

  // 이미지 경로 처리 (서버 주소 포함)
  const imageUrl = recipe.image_url.startsWith('http') 
    ? recipe.image_url 
    : `http://localhost:8000${recipe.image_url}`;

  return (
    <div className="recipe-item-card" onClick={() => navigate(`/recipe/${recipe.id}`)}>
      <div className="card-image">
        <img src={imageUrl} alt={recipe.title} />
        <div className="card-overlay">
          <span>자세히 보기</span>
        </div>
      </div>
      <div className="card-info">
        <h3>{recipe.title}</h3>
        <div className="card-stats">
          <span className="likes">❤️ {recipe.like_count || 0}</span>
          <span className="author">by {recipe.author_name || '익명'}</span>
        </div>
      </div>
    </div>
  );
};

export default RecipeItem;