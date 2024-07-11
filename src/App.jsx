import { Suspense, useEffect, useMemo, useRef } from "react";
import "./App.css";
import { NavLink, Outlet, useLoaderData, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";

function App() {
  const { pathname } = useLocation();

  const handleEnter = (event) => {};

  return (
    <>
      <Header style={{ display: pathname != "/" ? "flex" : "none" }}>
        <nav>
          <NavLink to={"metropolitan"}>METROPOLITAN MUSEUM</NavLink>
          <NavLink to={"hardvar"}>HARDVAR ART MUSEUM</NavLink>
          <NavLink to={"chicago"}>ART INSTITUTE OF CHICAGO</NavLink>
        </nav>
      </Header>
      <Main style={{ display: pathname == "/" ? "flex" : "none" }}>
        <h2>Visit the museums</h2>

        <NavLink
          onMouseEnter={handleEnter}
          className="link_main left"
          to={"metropolitan"}
        >
          METROPOLITAN MUSEUM
        </NavLink>
        <NavLink className="link_main bottom" to={"hardvar"}>
          HARDVAR ART MUSEUM
        </NavLink>
        <NavLink className="link_main right" to={"chicago"}>
          ART INSTITUTE OF CHICAGO
        </NavLink>

        <ImageMain>
          <CutTitle>
            <img
              src="../public/assets/metmuseum.svg"
              alt="Metropolitan Museum icon"
            />
            <img
              src="https://api.artic.edu/docs/assets/logo.svg"
              alt="Art Institute of Chicago icon"
            />
            <img
              src="https://harvardartmuseums.org/favicon.ico"
              alt="Hardvar Art Museum icon"
            />
          </CutTitle>
          <Arrow src="../public/assets/hoverme.svg" />
          <Landscape src="../public/assets/marcocuadropixel.webp" />
        </ImageMain>
      </Main>
      <Outlet />
    </>
  );
}

const Main = styled.main`
  flex-direction: column;
  position: relative;
  justify-content: flex-end;
  align-items: center;
  height: 70lvh;
  margin-top: 2rem;
  padding: 2.9rem 8.2rem;
`;

const ImageMain = styled.div`
  box-shadow: 0 -5px 10px 5px #232957, 0 5px 10px 5px #8e4e85aa,
    5px 0 5px 5px #232957, 5px 0 5px 5px #232957;
  display: block;
  width: 70lvh;
  aspect-ratio: 1;
  position: relative;
`;

const Arrow = styled.img`
  position: absolute;
  width: 30px;
`;

const Landscape = styled.img`
  width: 100%;
  position: relative;
  shape-rendering: crispedges;
  object-fit: cover;
`;

const CutTitle = styled.div`
  position: absolute;
  width: 42.4%;
  height: 42%;
  z-index: 100;
  background-color: #fff2;
  top: 18%;
  left: 21.3%;
`;

const Header = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  padding: 20px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10lvh;

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
