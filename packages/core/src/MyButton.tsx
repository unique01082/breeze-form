import styled from "styled-components";

const MyButton = styled.button`
  border: none;
  border-radius: 0.5rem;
  background-color: #56dcae;
  color: hsl(0deg, 0%, 98%);
  padding: 1rem;
  cursor: pointer;
  &:hover {
    background-color: #0a558c;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #62b0e8;
    background-color: #0a558c;
  }
`;

export default MyButton;
