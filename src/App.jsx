import { Suspense, useEffect } from "react";
import "./App.css";
import { NavLink, Outlet, useLoaderData } from "react-router-dom";
import styled, { keyframes } from "styled-components";

function App() {
  return (
    <>
      <Header>
        <nav>
          <NavLink to={"metropolitan"}>Metropolitan Museum</NavLink>
          {/* <NavLink to={"genshin"}>Genshin</NavLink> */}
          <NavLink to={"natural-language"}>Natural Language Understand [IBM]</NavLink>
        </nav>
      </Header>
      <h2>App</h2>
      <Outlet />
    </>
  );
}

const Header = styled.header`
  position: absolute;
  inset: 0;
  padding: 20px 0;
  width: 100lvw;

  & nav {
    display: flex;
    justify-content: center;
    gap: 20px;
    }

  & nav a:is(.active, .active:hover) {
    color: red;
  }
`;

export default App;
