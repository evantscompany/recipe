import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { recipeApi } from '../../api/recipeApi';

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
          console.error("예상치 못한 데이터 구조입니다:", response.data);
          setRecipes([]); 
        }
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
        setError("레시피를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>레시피를 불러오는 중...</div>;
  if (error) return <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <div className="container" style={{ padding: '20px' }}>
      {/* ✅ 헤더를 제목만 남기고 심플하게 변경 (로그인 버튼 등은 App.js의 nav가 담당) */}
      <header style={{ 
        marginBottom: '30px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #eee',
        paddingBottom: '15px'
      }}>
        <h2>🔥 최신 레시피 목록</h2>
        {/* 우측 버튼들을 삭제하여 App.js의 nav와 겹치지 않게 함 */}
      </header>

      {recipes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
          등록된 레시피가 없습니다. 첫 레시피를 작성해보세요!
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '25px' 
        }}>
          {recipes.map((recipe) => (
            <div key={recipe.id} style={{ 
              border: '1px solid #eee', 
              borderRadius: '12px', 
              overflow: 'hidden', 
              background: '#fff',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
              <div style={{ width: '100%', height: '180px', backgroundColor: '#eee', overflow: 'hidden' }}>
                <img 
                    src={
                        recipe.image_url?.startsWith('http') 
                        ? recipe.image_url 
                        : `http://localhost:8000${recipe.image_url}` 
                    } 
                    alt={recipe.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://picsum.photos/300/180';
                    }} 
                />
              </div>

              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', color: '#333' }}>{recipe.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#666', fontSize: '0.85rem' }}>
                  <span>👤 {recipe.owner_email?.split('@')[0]}</span>
                  <span>❤️ {recipe.like_count || 0}</span>
                </div>
                <hr style={{ margin: '15px 0', border: '0', borderTop: '1px solid #f0f0f0' }} />
                <Link to={`/recipe/${recipe.id}`} style={{ 
                  display: 'block', 
                  textAlign: 'center',
                  color: '#ff6b6b', 
                  fontWeight: 'bold',
                  textDecoration: 'none'
                }}>
                  상세보기
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Main;