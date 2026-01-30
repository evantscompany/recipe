import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RecipeItem.scss'

const RecipeItem = ({ recipe }) => {
  const navigate = useNavigate();

  // 1. 서버 주소 결정
  const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:8000' 
    : 'https://recipe-production-39ae.up.railway.app';

  // 2. 이미지 URL 생성
  const imageUrl = recipe.image_url 
    ? (recipe.image_url.startsWith('http') 
        ? recipe.image_url 
        : `${API_BASE_URL}${recipe.image_url}`)
    : 'https://picsum.photos/300/200'; 
    
  return (
    <div className="recipe-item-card" onClick={() => navigate(`/recipe/${recipe.id}`)}>
      <div className="card-image">
        <img 
          src={imageUrl} 
          alt={recipe.title} 
          // ✅ 배포 환경에서 CORS 문제를 방지하기 위해 추가
          crossOrigin="anonymous" 
          // ✅ 이미지가 깨졌을 경우(로컬 사진 등) 기본 이미지로 교체하는 보험
          onError={(e) => {
            e.target.src = 'https://picsum.photos/300/200';
          }}
        />
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