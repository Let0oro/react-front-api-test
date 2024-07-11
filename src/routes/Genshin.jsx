import React, { Suspense } from "react";
import { Await, NavLink, Outlet, useLoaderData } from "react-router-dom";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import Spinner from "../components/Spinner";

const Genshin = () => {
  const { data: dataList } = useLoaderData();

  return (
    <>
      Genshin
      <Sidebar>
        <Suspense fallback={<Spinner />}>
          <Await
            resolve={dataList}
            children={({ types }) =>
              types?.map((item) => (
                <NavLink key={uuidv4()} to={`${item}`.toLowerCase()}>
                  {item}
                </NavLink>
              ))
            }
          ></Await>
        </Suspense>
      </Sidebar>


      <Main>
        <Suspense fallback={<Spinner />}>
          <Await>
            <Outlet />
          </Await>
        </Suspense>
      </Main>
    </>
  );
};

const Sidebar = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  top: 0;
  margin: auto 0;
  height: 80lvh;
  width: 30lvw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid #888;
  overflow: scroll-y;  

  & a:is(.active, .active:hover) {
    color: white;
  }
`;

const Main = styled.main`
  position: relative;
    & a:is(.active, .active:hover) {
    color: white;
  }
`

export default Genshin;
