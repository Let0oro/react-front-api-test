import React, { Suspense, useEffect, useReducer } from "react";
import styled from "styled-components";
import { loader } from "../utils/loader";
import Spinner from "../components/Spinner";
import { Await } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const URL_HARDVAR = "https://api.harvardartmuseums.org/";

const apiKey = "?apikey=31536e72-a131-486f-a9a3-77ad4659aa0a";

const initialResource = {
  resource: "gallery",
  list: [],
  nextUrl: "",
  prevUrl: "",
  page: 1,
  totalPages: 1,
  size: 50,
  search: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_PAGE":
      return {
        ...state,
        page: action.page,
        size: action.size ?? state.size,
      };
    case "CHANGE_RESOURCE":
      return {
        ...state,
        page: 1,
        nextUrl: action.nextUrl,
        prevUrl: action.prevUrl,
        size: action.size ?? state.size,
        resource: action.resource,
      };
    case "GET_INFO":
      return {
        ...state,
        list: action.list,
        totalPages: action.totalPages,
        nextUrl: action.nextUrl,
      };
    case "SEARCH":
      return { ...state, search: action.search };
  }
};

const Hardvar = () => {
  const [listItems, dispatch] = useReducer(reducer, initialResource);

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get(
        `${URL_HARDVAR}${listItems.resource}${apiKey}`,
        {
          params: {
            page: listItems.page,
            size: listItems.size,
          },
        }
      );
      const { info, records } = data;
      console.log({ info, records });
      dispatch({
        type: "GET_INFO",
        list: records,
        nextUrl: info.next,
        totalPages: info.pages,
        page: info.page,
      });
    };
    getData();
  }, [listItems?.resource, listItems?.page]);

  const { list } = listItems;

  const handleChangeRes = (res) => {
    dispatch({ type: "CHANGE_RESOURCE", resource: res });
    const allBtns = [...document.querySelectorAll(".sidebar button")];
    const btnActive = allBtns.find((btn) => btn.outerText.toLowerCase() == res);
    console.log(btnActive);
    btnActive.className = 'active';
    // allBtns.forEach((btn) => btn.className = '');
  };

  return (
    <HardvarMenu>
      <SideBar className="sidebar">
        <ul>
          {[
            "person",
            "exhibition",
            "publication",
            "gallery",
            "spectrum",
            "classification",
            "century",
            "color",
            "culture",
            "group",
            "medium",
            "support",
            "period",
            "place",
            "technique",
            "worktype",
            "activity",
            "site",
            "video",
            "image",
            "audio",
            "annotation",
          ].map((el) => (
            <li key={uuidv4()}>
              <button className="" onClick={() => handleChangeRes(el)}>{el}</button>
            </li>
          ))}{" "}
        </ul>
      </SideBar>
      <List>
        <Suspense fallback={<Spinner />}>
          <Await
            children={(list) => {
              const childrenReturned = [];
              for (let i = 0; i < list.length; i++) {
                const work = list[i];
                if (listItems.resource == "gallery") {
                  childrenReturned.push(
                    <Card key={uuidv4()}>
                      <p>
                        <i>
                          {work.name} {work.theme ? `[${work.theme}]` : ""}
                        </i>
                        <b>By {work.donorname ? work.donorname : "Anon."}</b>
                      </p>
                      <p
                        style={{
                          border: "1px solid #888",
                          display: "inline-block",
                          padding: "3px",
                        }}
                      >
                        <strong>Gallery number: </strong>
                        {work.gallerynumber}, <strong>floor: </strong>1
                      </p>
                      <p>
                        {work.labeltext ? (
                          <span>
                            <strong>Description: </strong> {work.labeltext}
                          </span>
                        ) : (
                          ""
                        )}{" "}
                        <a target="_blank" href={work.url}>
                          Ver más
                        </a>
                      </p>
                      <small>
                        Last updated:{" "}
                        {new Intl.DateTimeFormat("es-ES").format(
                          new Date(work.lastupdate)
                        )}
                      </small>
                    </Card>
                  );
                }
              }
              return childrenReturned;
            }}
            resolve={list}
          ></Await>
        </Suspense>
        <ButtonPages>
          <button
            onClick={() => {
              dispatch({
                type: "CHANGE_PAGE",
                page:
                  listItems.page - 1 <= 0
                    ? listItems.totalPages
                    : listItems.page - 1,
              });
            }}
          >
            «
          </button>
          <span>
            {listItems.page} / {listItems.totalPages}
          </span>
          <button
            onClick={() => {
              dispatch({
                type: "CHANGE_PAGE",
                page:
                  listItems.page + 1 > listItems.totalPages
                    ? 1
                    : listItems.page + 1,
              });
            }}
          >
            »
          </button>
        </ButtonPages>
      </List>
    </HardvarMenu>
  );
};

const HardvarMenu = styled.article`
  width: 100%;
  height: 100%;
  padding: 1rem;
  padding-top: 2rem;
  display: grid;
  width: 75%;
  padding-left: 25%;
  gap: 1rem;
`;

const SideBar = styled.section`
  position: fixed;
  left: 0;
  top: 3rem;
  height: 100%;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  max-width: 20%;

  & ul {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  & button {
    padding: 5px;
    text-transform: capitalize;
    border: 1px solid transparent;
  }

  & button.active {
    border: 1px solid #646cff;
  }

  & * {
    list-style: none;
  }
`;

const Card = styled.div``;
const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonPages = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  gap: 10px;
  align-items: center;
`;

export default Hardvar;
