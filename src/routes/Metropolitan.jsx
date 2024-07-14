import React, { Suspense, useEffect, useMemo, useState } from "react";
import { Await, NavLink, Outlet, useLoaderData, useLocation, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";

const Metropolitan = () => {
  const { data } = useLoaderData();
  const [depSelect, setDepSelect] = useState("American Decorative Arts");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {if (location?.pathname == "/metropolitan") navigate('1')}, [location?.pathname])

  const handleChange = (ev) => {
    const selectedOptEl = [...ev.target.querySelectorAll('option')].find(el => el.value == `${ev.target.value}`);
    setDepSelect(selectedOptEl.textContent.split(' -')[0]);
    navigate(`${ev.target.value}`, {replace: true})
  };

  return (
    <>
      <SideBar onChange={handleChange} defaultValue={1}>
        <optgroup label="Metropolitan departaments">
          <Suspense fallback={<Spinner />}>
            <Await
              resolve={data.departments}
              errorElement={<div>Could not load data 😬</div>}
              children={(resolvedPictures) =>
                resolvedPictures.map(({ displayName, departmentId }) => (
                  <option key={departmentId} value={departmentId}>{displayName} - (id: {departmentId})</option>
                ))
              }
            />
          </Suspense>
        </optgroup>
      </SideBar>

      <Outlet context={depSelect} />
    </>
  );
};

const SideBar = styled.select`
  position: fixed;
  left: 2rem;
  bottom: 2rem;
  height: 2rem;
  width: auto;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  max-width: 20%;

  & option {
    padding: 5px;
    text-transform: capitalize;
    border: 1px solid transparent;
  }
`;

export default Metropolitan;
