import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipeApi } from '../../api/recipeApi'; 
import * as S from './Write.style';

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

    // 서버에 전송할 FormData 객체 생성
    const data = new FormData();
    
    // 현재 코드 상단의 useState 변수명인 title, content를 직접 사용해야 합니다.
    data.append('title', title);     // formData.title (X) -> title (O)
    data.append('content', content); // formData.content (X) -> content (O)
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
    <S.WriteWrapper>
      <S.Container>
        <S.Header>
          <h1>새 레시피 작성</h1>
          <p>나만의 특별한 요리 비법을 알려주세요!</p>
        </S.Header>

        <S.Form onSubmit={handleSubmit}>
          <S.ImageSection>
            <label htmlFor="image-input">
              {preview ? (
                <S.PreviewImage src={preview} alt="미리보기" />
              ) : (
                <S.Placeholder>
                  <span className="icon">📷</span>
                  <span>요리 완성 사진을 등록하세요</span>
                </S.Placeholder>
              )}
            </label>
            <input 
              id="image-input"
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              hidden 
            />
          </S.ImageSection>

          <S.InputGroup>
            <S.Label>제목</S.Label>
            <S.Input 
              placeholder="예: 백종원표 제육볶음" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </S.InputGroup>

          <S.InputGroup>
            <S.Label>설명</S.Label>
            <S.TextArea 
              placeholder="요리 순서와 팁을 자세히 적어주세요." 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </S.InputGroup>

          <S.BtnGroup>
            <S.CancelBtn type="button" onClick={() => navigate(-1)}>취소</S.CancelBtn>
            <S.SubmitBtn type="submit">등록하기</S.SubmitBtn>
          </S.BtnGroup>
        </S.Form>
      </S.Container>
    </S.WriteWrapper>
  );
};

export default Write;