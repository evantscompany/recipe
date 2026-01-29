import styled from 'styled-components';

export const Container = styled.div`
  max-width: 400px;
  margin: 80px auto;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  text-align: center;
`;

export const Title = styled.h2`
  margin-bottom: 30px;
  color: #333;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  &:focus {
    border-color: #4ecdc4;
    outline: none;
  }
`;

export const SubmitButton = styled.button`
  padding: 12px;
  background-color: #4ecdc4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background-color: #45b7ae;
  }
`;