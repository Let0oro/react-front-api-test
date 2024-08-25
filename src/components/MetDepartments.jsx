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
  }, [data, listItems?.search, depSelect]);

  useMemo(() => {
    const setData = async () => {
      if (!listItems?.idList?.length) {
        dispatch({
          type: "SET_INFO",
          list: [],
        });
        return;
      }
      const finaldata = await Promise.all(
        listItems?.idList
          ?.filter(
            (id, ix) =>
              ix >= (listItems?.page - 1) * listItems?.size &&
              ix < listItems?.page * listItems?.size
          )
          ?.map(async (id) => {
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
  }, [listItems?.search, listItems?.idList?.length, listItems?.page]);

  const { list } = listItems;

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
              if (!list?.length) {
                return (
                  [<Card key={uuidv4()}>
                    {" "}
                    <p>
                      <i>Not found</i>
                    </p>{" "}
                  </Card>]
                );
              }
              for (let i = 0; i < list.length; i++) {
                const work = list[i];
                childrenReturned.push(
                  <Card key={uuidv4()}>
                    <p>
                      <i>{work?.title}</i>
                    </p>
                    <p>
                      <strong>Accession year: </strong> {work?.accessionYear}
                    </p>
                    <p>
                      <strong>Accession by: </strong> {work?.creditLine}
                    </p>
                    { work?.artistDisplayName && <p>
                      <strong>Artist: </strong> {work?.artistDisplayName} (
                      {work?.artistDisplayBio})
                    </p>}
                    <p>
                      <a href={work?.artistULAN_URL}>ULAN artist url</a>
                    </p>
                    <p>
                      <a href={work?.artistWikidata_URL}>Wikidata artist url</a>
                    </p>
                    { (work?.constituents?.length) &&  (work?.constituents?.length - 1) &&
                      work?.constituents.map((con) => (
                        <div key={uuidv4()}>
                          <p>
                            <strong>{con?.name}</strong>({con?.role}){" "}
                            {con?.gender}
                          </p>
                          <p>
                            <a href={con?.constituentULAN_URL}>
                              ULAN artist url
                            </a>
                          </p>
                          <p>
                            <a href={con?.constituentWikidata_URL}>
                              Wikidata artist url
                            </a>
                          </p>
                        </div>
                      ))}

                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        loading="lazy"
                        style={{ width: "70%" }}
                        src={work?.primaryImage}
                        alt={`${work?.title} image`}
                      />
                    </div>
                    <p>
                      <strong>
                        Creation date
                        {work?.objectBeginDate == work?.objectEndDate
                          ? ""
                          : "s"}
                        :{" "}
                      </strong>{" "}
                      {work?.objectBeginDate == work?.objectEndDate
                        ? (work?.objectBeginDate < 0 ? `${0-work?.objectBeginDate} b. C.`: work?.objectBeginDate)
                        : `${work?.objectBeginDate < 0 ? `${0-work?.objectBeginDate}`: work?.objectBeginDate} 
                        - ${work?.objectEndDate < 0 ? `${0-work?.objectEndDate} b. C.`: work?.objectEndDate}`}
                    </p>
                    <p>
                      <strong>Dimensions: </strong> {work?.dimensions}
                    </p>
                    <p>
                      <strong>Culture: </strong> {work?.culture}
                    </p>
                    { work?.dynasty && (
                      <p>
                        <strong>Dinasty: </strong> {work?.dynasty}
                      </p>
                    )}
                    { work?.excavation && (
                      <p>
                        <strong>Excavation: </strong> {work?.excavation}
                      </p>
                    )}
                    { work?.country && (
                      <p>
                        <strong>Country: </strong> {work?.country}
                      </p>
                    )}
                    { work?.county && (
                      <p>
                        <strong>County: </strong> {work?.county}
                      </p>
                    )}
                    { work?.state && (
                      <p>
                        <strong>state: </strong> {work?.state}
                      </p>
                    )}
                    { work?.period && (
                      <p>
                        <strong>Period: </strong> {work?.period}
                      </p>
                    )}
                    { work?.portfolio && (
                      <p>
                        <strong>Portfolio: </strong> {work?.portfolio}
                      </p>
                    )}
                    { work?.rightsAndReproduction && (
                      <p>
                        <strong>Rights and reproduction: </strong>{" "}
                        {work?.rightsAndReproduction}
                      </p>
                    )}
                    <p>
                      <strong>Medium: </strong> {work?.objectName}{" "}
                      {work?.medium}
                    </p>
                    <p>
                      <a href={work?.objectURL}>Metropolitan link</a>
                    </p>
                    <p>
                      <a href={work?.artistWikidata_URL}>Wikidata work url</a>
                    </p>
                    { work?.linkResource && (
                      <a href={work?.linkResource}>Link to resource</a>
                    )}
                    { work?.tags && <p>
                      <strong>Tags: </strong>
                      {work?.tags?.map((t) => t.term).join("/ ")}
                    </p>}
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
