import React, { useEffect, useState } from 'react';
import { recipeApi } from '../../api/recipeApi';
import RecipeItem from '../../components/RecipeItem';
import './MyRecipes.scss';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const response = await recipeApi.getMyRecipes();
        setRecipes(response.data);
      } catch (error) {
        console.error("내 레시피 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyRecipes();
  }, []);

  if (loading) return <div className="loading">레시피를 가져오는 중...</div>;

  return (
    <div className="my-recipes-page">
      <header className="page-header">
        <h1>👩‍🍳 {username}님의 주방</h1>
        <p>지금까지 총 <strong>{recipes.length}개</strong>의 레시피를 공유하셨어요!</p>
      </header>

      {recipes.length > 0 ? (
        <div className="recipe-grid">
          {recipes.map(recipe => (
            <RecipeItem key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="empty-box">
          <p>아직 등록된 레시피가 없네요.</p>
          <p>나만의 특별한 요리법을 세상에 알려보세요!</p>
        </div>
      )}
    </div>
  );
};

export default MyRecipes;