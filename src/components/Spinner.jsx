import styled, { keyframes } from "styled-components";

const animSpinner = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  display: inline-block;
  position: relative;

  &::after,
  &::before {
    content: "";
    box-sizing: border-box;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid #fff;
    position: absolute;
    left: 0;
    top: 0;
    animation: ${animSpinner} 2s linear infinite;
  }
  &::after {
    animation-delay: 1s;
  }
`;

export default Spinner;