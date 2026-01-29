import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipeApi } from '../../api/recipeApi'; 
import './Write.scss'; // ✅ SCSS 연결

const Write = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("레시피 사진을 등록해주세요!");

    const data = new FormData();
    data.append('title', title);
    data.append('content', content);
    data.append('image', imageFile);

    try {
      await recipeApi.createRecipe(data); 
      alert("✨ 레시피가 성공적으로 등록되었습니다!");
      navigate('/');
    } catch (err) {
      console.error("등록 에러:", err);
      alert("등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="write-page">
      <div className="write-container">
        <header className="write-header">
          <h1>새 레시피 작성</h1>
          <p>나만의 특별한 요리 비법을 알려주세요!</p>
        </header>

        <form className="write-form" onSubmit={handleSubmit}>
          {/* 이미지 섹션 */}
          <div className="image-upload-section">
            <label htmlFor="image-input" className="image-label">
              {preview ? (
                <img src={preview} alt="미리보기" className="preview-image" />
              ) : (
                <div className="placeholder">
                  <span className="icon">📷</span>
                  <span>요리 완성 사진을 등록하세요</span>
                </div>
              )}
            </label>
            <input 
              id="image-input"
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              hidden 
            />
          </div>

          <div className="input-group">
            <label className="label">제목</label>
            <input 
              className="input-field"
              placeholder="예: 백종원표 제육볶음" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="label">설명</label>
            <textarea 
              className="textarea-field"
              placeholder="요리 순서와 팁을 자세히 적어주세요." 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="btn-group">
            <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
              취소
            </button>
            <button type="submit" className="submit-btn">
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Write;