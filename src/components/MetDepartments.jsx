import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import {
  Await,
  useLoaderData,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { URL_METROPOLITAN } from "../main";
import axios from "axios";
import styled from "styled-components";
import Spinner from "./Spinner";
import { v4 as uuidv4 } from "uuid";

const initialResource = {
  list: [],
  nextUrl: "",
  prevUrl: "",
  page: 1,
  totalPages: 1,
  size: 50,
  search: "cat",
  idList: [],
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
      };
    case "GET_INFO":
      return {
        ...state,
        totalPages: action.totalPages,
        page: action.page,
        idList: action.idList,
      };
    case "SET_INFO":
      return {
        ...state,
        list: action.list,
      };
    case "SEARCH":
      return { ...state, search: action.search };
  }
};

const MetDepartments = () => {
  const [listItems, dispatch] = useReducer(reducer, initialResource);

  const depSelect = useOutletContext();

  const inputMet = useRef(null);
  const data = useLoaderData();
  const params = useParams();

  const deferFunc = useCallback(
    (func, time = 1000) => {
      if (inputMet?.current && inputMet?.current.value.length) {
        let idTimer = null;
        idTimer = setTimeout(() => {
          func.call();
          clearTimeout(idTimer);
        }, time);
      }
    },
    [inputMet?.current]
  );

  useEffect(() => {
    const getData = async () => {
      const { data: response } = await axios.get(
        !listItems?.search.length
          ? `${URL_METROPOLITAN}objects?departmentIds=${params.id}`
          : `${URL_METROPOLITAN}search?hasImages=true&isHighlight=true&isOnView=true&departmentId=${params.id}&q="${listItems?.search}"`
      );
      const data = response;

      dispatch({
        type: "GET_INFO",
        totalPages: Math.floor(data.total / 50) + (data.total % 50 > 0 ? 1 : 0),
        page: 1,
        idList: data.objectIDs,
      });
    };
    getData();
  }, [data, listItems?.page, listItems?.search, depSelect]);

  useMemo(() => {
    const setData = async () => {
      const finaldata = await Promise.all(
        listItems.idList.map(async (id) => {
          const { data: response } = await axios.get(
            `${URL_METROPOLITAN}objects/${id}`
          );
          return response;
        })
      );

      dispatch({
        type: "SET_INFO",
        list: finaldata,
      });
    };
    setData();
  }, [listItems?.search, listItems?.idList.length]);

  const { list } = listItems;

  console.log(list);

  return (
    <MetMenu>
      <h2>{depSelect}</h2>

      <InputMet>
        <label htmlFor="inputMet">
          <input
            ref={inputMet}
            type="text"
            name="inputMet"
            id="inputMet"
            defaultValue={"cat"}
            onChange={(ev) => {
              deferFunc(
                () => dispatch({ type: "SEARCH", search: ev.target.value }),
                1000
              );
            }}
          />
        </label>
      </InputMet>

      <List>
        <Suspense fallback={<Spinner />}>
          <Await
            children={(list) => {
              const childrenReturned = [];
              for (let i = 0; i < list.length; i++) {
                const work = list[i];
                childrenReturned.push(
                  <Card key={uuidv4()}>
                    <i>{work?.title}</i>
                    <div style={{width: "100%", display: 'flex', justifyContent: 'center'}}><img style={{width: "70%"}} src={work?.primaryImage} alt={work?.title} /></div>
                  </Card>
                );
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
              window.scrollTo(0, 0);
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
              window.scrollTo(0, 0);
            }}
          >
            »
          </button>
        </ButtonPages>
      </List>
    </MetMenu>
  );
};

const MetMenu = styled.article`
  width: 100%;
  height: 100%;
  padding: 1rem;
  padding-top: 2rem;
  display: grid;
  gap: 1rem;
  scroll-behaviour: smooth;
`;

const InputMet = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const Card = styled.div`
  padding: 0.8rem 0;
  border-bottom: 1px solid #ccc;
  text-align: justify;

  & img {
    width: 100%;
  }
`;
const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const MapEl = styled.div`
  display: block;
  margin: 0 auto;
  width: 100%;
  aspect-ratio: 1;
`;

const ButtonPages = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  gap: 10px;
  align-items: center;
`;

export default MetDepartments;
