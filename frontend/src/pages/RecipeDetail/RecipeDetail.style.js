import styled from 'styled-components';

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
`;

export const RecipeCard = styled.div`
  background: #fff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
`;

export const RecipeImage = styled.img`
  width: 100%;
  max-height: 500px;
  object-fit: cover;
`;

export const ContentArea = styled.div`
  padding: 30px;
`;

export const CategoryTag = styled.span`
  background-color: #ff6b6b;
  color: #fff;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
`;

export const CommentSection = styled.div`
  margin-top: 40px;
  border-top: 2px solid #eee;
  padding-top: 30px;
`;

// before: isEditing -> after: $isEditing
export const CommentWrapper = styled.div`
  padding: 15px;
  background-color: ${props => props.$isEditing ? '#f0fdfa' : '#f9f9f9'}; // $ 추가
  border-radius: 10px;
  margin-bottom: 15px;
  border: 1px solid ${props => props.$isEditing ? '#4ecdc4' : 'transparent'}; // $ 추가
  transition: all 0.2s;
`;

export const ActionButton = styled.button`
  color: ${props => props.color || '#888'};
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.85rem;
  &:hover { text-decoration: underline; }
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  &:focus { border-color: #4ecdc4; outline: none; }
`;

export const ReactionSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
`;

export const ReactionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 25px;
  border: 2px solid ${props => props.$active ? props.$color : '#ddd'};
  background-color: ${props => props.$active ? props.$color : '#fff'};
  color: ${props => props.$active ? '#fff' : '#555'};
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }

  svg {
    font-size: 1.2rem;
  }
`;