import styled from 'styled-components';

export const WriteWrapper = styled.div`
  background: #fdfdfd;
  min-height: 100vh;
  padding: 60px 20px;
`;

export const Container = styled.div`
  max-width: 750px;
  margin: 0 auto;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  padding: 50px;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  h1 { font-size: 2.2rem; color: #333; margin-bottom: 10px; }
  p { color: #888; font-size: 1.1rem; }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const ImageSection = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 2px dashed #eee;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  &:hover { border-color: #4ecdc4; background: #fafafa; }
`;

export const Placeholder = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #bbb;
  gap: 15px;
  .icon { font-size: 3rem; }
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Label = styled.label`
  font-weight: bold;
  font-size: 1.1rem;
  color: #444;
`;

export const Input = styled.input`
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  &:focus { outline: none; border-color: #4ecdc4; }
`;

export const TextArea = styled.textarea`
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  min-height: 250px;
  resize: none;
  &:focus { outline: none; border-color: #4ecdc4; }
`;

export const BtnGroup = styled.div`
  display: flex;
  gap: 15px;
`;

export const SubmitBtn = styled.button`
  flex: 2;
  padding: 18px;
  background: #4ecdc4;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  &:hover { background: #45b7af; }
`;

export const CancelBtn = styled.button`
  flex: 1;
  padding: 18px;
  background: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
`;