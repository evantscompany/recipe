import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipeApi } from '../../api/recipeApi';
import { commentApi } from '../../api/comment';
import CommentItem from './CommentItem'; 
import './RecipeDetail.scss'; // ✅ SCSS 연결

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  
  // 현재 로그인한 유저 정보 (localStorage 키값이 'userId'인 것을 확인)
  const currentUserId = Number(localStorage.getItem('userId'));

  const [reactionStats, setReactionStats] = useState({
    likes: 0,
    dislikes: 0,
    myReaction: null 
  });

  // 🆕 레시피 삭제 핸들러 (기존 로직 유지하며 추가)
  const handleRecipeDelete = async () => {
    if (!window.confirm("정말로 이 레시피를 삭제하시겠습니까?")) return;
    
    try {
      await recipeApi.deleteRecipe(id);
      alert("레시피가 성공적으로 삭제되었습니다.");
      navigate('/', { replace: true });
    } catch (error) {
      console.error("삭제 실패:", error);
      alert(error.response?.data?.detail || "삭제 권한이 없거나 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [recipeRes, commentRes] = await Promise.all([
          recipeApi.getRecipeDetail(id),
          commentApi.getComments(id)
        ]);
        
        const recipeData = recipeRes.data;
        setRecipe(recipeData);
        setComments(commentRes.data);
        setReactionStats({
          likes: recipeData.like_count || 0,
          dislikes: recipeData.dislike_count || 0,
          myReaction: recipeData.my_reaction || null
        });
      } catch (error) {
        if (error.response?.status === 404) navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [id, navigate]);

  const handleReaction = async (type) => {
    try {
      const res = await recipeApi.postReaction(id, {reaction_type: type});
      setReactionStats({
        likes: res.data.like_count,
        dislikes: res.data.dislike_count,
        myReaction: res.data.my_reaction
      });
    } catch (error) {
      if (error.response?.status === 401) alert("로그인이 필요한 기능입니다.");
      else alert("처리에 실패했습니다.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const response = await commentApi.createComment(id, newComment);
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      alert("댓글 작성에 실패했습니다.");
    }
  };

  const handleCommentUpdate = async (commentId, content) => {
    try {
      await commentApi.updateComment(commentId, content, id);
      setComments(comments.map(c => c.id === commentId ? { ...c, content } : c));
    } catch (error) {
      alert(error.response?.data?.detail || "수정 권한이 없습니다.");
    }
  };

  const handleCommentDelete = async (commentId) => {
    alert('삭제 확인용')
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await commentApi.deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      alert(error.response?.data?.detail || "삭제 권한이 없습니다.");
    }
  };

  if (loading) return <div className="loading-state">로딩 중...</div>;
  if (!recipe) return <div className="error-state">레시피를 찾을 수 없습니다.</div>;

  return (
    <div className="recipe-detail-page">
      <div className="detail-header-nav">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← 뒤로가기
        </button>

        {/* 🆕 작성자 본인일 때만 노출되는 컨트롤 영역 */}
        {recipe && recipe.user_id === currentUserId && (
          <div className="recipe-admin-controls">
            <button 
              className="edit-btn" 
              onClick={() => navigate(`/recipes/edit/${id}`)}
            >
              수정하기
            </button>
            <button 
              className="delete-btn" 
              onClick={handleRecipeDelete}
            >
              삭제하기
            </button>
          </div>
        )}
      </div>

      <article className="recipe-card">
        <img 
          className="recipe-main-image"
          src={
            recipe.image_url?.startsWith('http') 
              ? recipe.image_url 
              : `${API_BASE_URL}${recipe.image_url}`
          } 
          alt={recipe.title} 
        />

        <div className="recipe-body">
          <span className="category-tag">{recipe.category || '일반'}</span>
          <h1 className="recipe-title">{recipe.title}</h1>
          
          <div className="recipe-meta">
            <span>👤 작성자 ID: {recipe.user_id}</span>
            <span>📅 작성일: {new Date(recipe.created_at).toLocaleDateString()}</span>
          </div>

          <div className="recipe-content">
            {recipe.content}
          </div>

          <div className="reaction-section">
            <button 
              className={`reaction-btn like ${reactionStats.myReaction === 'like' ? 'active' : ''}`}
              onClick={() => handleReaction('like')}
            >
              👍 좋아요 {reactionStats.likes}
            </button>
            <button 
              className={`reaction-btn dislike ${reactionStats.myReaction === 'dislike' ? 'active' : ''}`}
              onClick={() => handleReaction('dislike')}
            >
              👎 별로예요 {reactionStats.dislikes}
            </button>
          </div>

          <section className="comment-section">
            <h3>💬 댓글 {comments.length}개</h3>
            
            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <input 
                className="comment-input"
                type="text" 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 남겨보세요..."
              />
              <button className="comment-submit-btn" type="submit">등록</button>
            </form>

            <div className="comment-list">
              {comments.map((comment) => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  onUpdate={handleCommentUpdate}
                  onDelete={handleCommentDelete}
                />
              ))}
            </div>
          </section>
        </div>
      </article>
    </div>
  );
};

export default RecipeDetail;