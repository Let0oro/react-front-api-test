import React, { memo, Suspense } from "react";
import {
  Await,
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
} from "react-router-dom";
import Spinner from "../Spinner";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";

const GenshinApi = memo(() => {
  const { data } = useLoaderData();

  return (
    <>
      <p>
        <i>GenshinApi</i>
      </p>
      <ul>
        <Suspense fallback={<Spinner />}>
          <Await
            resolve={data}
            errorElement={<i>Data not founded</i>}
            children={(listItems) =>
              listItems?.map((item) => (
                <li key={uuidv4()}>
                  <NavLink to={`${item}`}>{item}</NavLink>
                </li>
              ))
            }
          ></Await>
        </Suspense>
      </ul>


      <Sidebar>
        <Outlet />
      </Sidebar>
    </>
  );
});

const Sidebar = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto 0;
  height: 80lvh;
  width: 30lvw;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 10px;
  border: 1px solid #888;
  overflow: auto;

  & > * {
    position: relative;
  }
`;

export default GenshinApi;
