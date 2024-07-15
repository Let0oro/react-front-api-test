import "./App.css";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";

function App() {
  const { pathname } = useLocation();

  const handleEnter = (event) => {
    const linkPath = new URL(event.target.href).pathname
      .split("/")[1]
      .toLocaleLowerCase();
    console.log(linkPath);

    const allImgs = [...document.querySelectorAll(".cut_title > a > img")];
    const filteredUrl = allImgs.find((el) =>
      el.alt.toLowerCase().includes(linkPath)
    );
    console.log(filteredUrl);
    allImgs.forEach((img) => (img.parentElement.style.display = "none"));
    filteredUrl.parentElement.style.display = "block";

    const links = document.querySelectorAll(".link_main");
    // links.forEach(a => a.)
  };

  return (
    <>
      <Header style={{ display: pathname != "/" ? "flex" : "none" }}>
        <nav>
          <NavLink to={"metropolitan"}>METROPOLITAN MUSEUM</NavLink>
          <NavLink><NavLandscape src="../assets/marcocuadropixel.webp" /></NavLink>
          <NavLink to={"hardvar"}>HARDVAR ART MUSEUM</NavLink>
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
        <NavLink
          onMouseEnter={handleEnter}
          className="link_main right"
          to={"hardvar"}
        >
          HARDVAR ART MUSEUM
        </NavLink>

        <ImageMain>
          <CutTitle className="cut_title">
            <NavLink to={"metropolitan"}>
              <img
                src="../assets/metmuseum.svg"
                alt="Metropolitan Museum icon"
              />
            </NavLink>

            <NavLink to={"hardvar"}>
              <img
                src="https://harvardartmuseums.org/favicon.ico"
                alt="Hardvar Art Museum icon"
              />
            </NavLink>
          </CutTitle>
          <Arrow src="../assets/hoverme.svg" />
          <Landscape src="../assets/marcocuadropixel.webp" />
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
  padding: 1.9rem 8.6rem;
  transition: padding 0.25s ease-out;

  &:has(.bottom:hover) {
    padding: 3rem 8.6rem;
  }
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

const NavLandscape = styled.img`
  width: 50px;
  position: relative;
  shape-rendering: crispedges;
  object-fit: cover;
  filter: sepia(1);
  transition: filter .25s linear;
  
  &:hover {
    filter: sepia(0);
  }
`;

const CutTitle = styled.div`
  position: absolute;
  width: 42.4%;
  height: 42%;
  z-index: 100;
  background-color: #fff2;
  top: 18%;
  left: 21.3%;
  display: grid;
  place-items: center;

  & a {
    display: none;
    width: 80%;

    & img {
    opacity: .9;
    width: 100%;
        background-image: radial-gradient(#fff2 20%, transparent 50%, transparent 100%);
    // filter: invert(1);

    }
  }
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
