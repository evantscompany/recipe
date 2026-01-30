import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { recipeApi } from '../../api/recipeApi';
import './Main.scss';

const Main = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- 검색 및 필터 상태 추가 ---
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('전체');
  const categories = ['전체', '한식', '일식', '중식', '양식', '디저트'];
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  // 로직 분리: API 호출 함수
  const fetchRecipes = useCallback(async (searchKeyword, cat) => {
    try {
      setLoading(true);
      // 백엔드 파라미터에 맞춰 인자 전달 (search, category)
      const response = await recipeApi.getRecipes(searchKeyword, cat);
      
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
  }, []);

  // 검색어 입력이나 카테고리 클릭 시 실행 (디바운싱 적용)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchRecipes(search, category);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, fetchRecipes]);

  return (
    <div className="main-page">
      <header className="main-header">
        <h2>RECIPEs</h2>
        
        {/* --- 🔍 검색 및 필터 UI 영역 추가 --- */}
        <div className="filter-container">
          <div className="search-wrapper">
            <input 
              type="text" 
              className="search-input"
              placeholder="레시피 제목이나 내용을 검색해보세요..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="category-wrapper">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-tag ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {loading ? (
        <div className="main-status">레시피를 불러오는 중...</div>
      ) : error ? (
        <div className="main-status error">{error}</div>
      ) : recipes.length === 0 ? (
        <div className="empty-state">
          찾으시는 레시피가 없습니다. 다른 검색어를 입력해보세요!
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
                    : `${API_BASE_URL}${recipe.image_url}` 
                  } 
                  alt={recipe.title} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://picsum.photos/300/180';
                  }} 
                />
                {/* 카드 상단에 카테고리 뱃지 표시 (선택사항) */}
                {recipe.category && <span className="category-badge">{recipe.category}</span>}
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