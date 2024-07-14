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
      // console.log(records.filter((rec) => rec?.caption?.length));
      console.log({ records });
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

  const handleChangeRes = (ev) => {
    dispatch({ type: "CHANGE_RESOURCE", resource: ev.target.value });
    window.scrollTo(0, 0);
  };

  async function initMap(geo) {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    document.querySelectorAll(".map").forEach((mp) => {
      const map = new Map(mp, {
        center: { ...geo, lng: geo.lon },
        zoom: 15,
        mapId: "4504f8b37365c3d0",
      });
      new AdvancedMarkerElement({
        map,
        position: { ...geo, lng: geo.lon },
      });
    });
    const infoWindow = new google.maps.InfoWindow();
    infoWindow.setPosition({ ...geo, lng: geo.lon });
  }

  return (
    <HardvarMenu>
      <SideBar
        defaultValue={listItems?.resource || "gallery"}
        onChange={handleChangeRes}
      >
        <option value={"gallery"}>gallery</option>
        <option value={"person"}>person</option>
        <option value={"exhibition"}>exhibition</option>
        <option value={"publication"}>publication</option>
        <option value={"culture"}>culture</option>
        <option value={"site"}>site</option>
        <option value={"video"}>video</option>
        <option value={"image"}>image</option>
        <option value={"audio"}>audio</option>
        <option value={"annotation"}>annotation</option>
      </SideBar>
      <List>
        <Suspense fallback={<Spinner />}>
          <Await
            children={(list) => {
              const childrenReturned = [];
              for (let i = 0; i < list.length; i++) {
                const work = list[i];
                if (!!work?.geo) initMap(work?.geo);
                childrenReturned.push(
                  <Card key={uuidv4()}>
                    <p>
                      <i>
                        {work?.name || work?.displayname || work?.title || ""}{" "}
                        {work?.volumetitle ? work.volumetitle : ""}{" "}
                        {work?.body ? work.body : ""}{" "}
                        {work?.volumenumber ? `(${work.volumenumber})` : ""}{" "}
                        {work?.publicationplace
                          ? `[${work.publicationplace}]`
                          : ""}
                        {work.theme ? `[${work.theme}]` : ""}
                        {work.technique ? `[${work.technique}]` : ""}
                        {work?.displaydate ? `(${work?.displaydate})` : ""}{" "}
                        {work?.date ? `(${work?.date})` : ""}{" "}
                        {work?.publicationdate
                          ? `(${work?.publicationdate})`
                          : ""}{" "}
                        {work?.gender && work.gender != "unknown"
                          ? `- ${work?.gender}`
                          : ""}
                        {work?.format && work.format != "image/jpeg"
                          ? `- ${work?.format}`
                          : ""}
                      </i>
                      {work?.address || ""}
                      {work?.datebegin || work?.begindate || ""}
                      {work?.birthplace ? `(${work.birthplace})` : ""}
                      {!!work?.datebegin ||
                      !!work?.begindate ||
                      !!work?.birthplace
                        ? " - "
                        : " "}
                      {work?.dateend || work.enddate || ""}
                      {work?.deathplace ? `(${work.deathplace})` : ""}
                      {/(gallery)(exhibition)/gi.test(listItems.resource) ? (
                        <b>
                          By{" "}
                          {work?.donorname ||
                            (work?.people?.length &&
                              work?.people
                                ?.map((ppl) => ppl.displayname)
                                .join(", ")) ||
                            "Anon."}
                        </b>
                      ) : (
                        ""
                      )}
                    </p>
                    {!!work?.gallerynumber && !!work.floor ? (
                      <p
                        style={{
                          border: "1px solid #888",
                          display: "inline-block",
                          padding: "3px",
                        }}
                      >
                        <strong>Gallery number: </strong>
                        {work?.gallerynumber}, <strong>floor: </strong>
                        {work?.floor}
                      </p>
                    ) : (
                      ""
                    )}
                    {!!work?.primaryimageurl ||
                    work?.baseimageurl ||
                    work?.target ? (
                      <div
                        style={{
                          width: "60%",
                          margin: "0 auto",
                          display: "block",
                        }}
                      >
                        <Suspense fallback={<Spinner />}>
                          <img
                            src={
                              work?.primaryimageurl ||
                              work?.baseimageurl ||
                              work?.target
                            }
                            alt={work?.title || work?.technique}
                          />
                        </Suspense>
                        {!!work?.caption ? `(${work?.caption})` : ""}
                        {!!work?.source ? `Source: (${work?.source})` : ""}
                      </div>
                    ) : (
                      ""
                    )}

                    {!!work.geo ? (
                      <Suspense fallback={<Spinner />}>
                        <Await
                          resolve={work?.geo}
                          children={<MapEl className="map"></MapEl>}
                        ></Await>
                      </Suspense>
                    ) : (
                      ""
                    )}
                    <p>
                      {work?.labeltext ||
                      work?.description ||
                      work?.shortdescription ? (
                        <span>
                          <strong>Description: </strong>{" "}
                          {work?.labeltext || work?.description + "\n"}
                          {!!work?.shortdescription || ""}
                        </span>
                      ) : (
                        ""
                      )}{" "}
                      {work?.primaryurl ? <br /> : ""}
                      {(!!work?.url ||
                        work?.primaryurl ||
                        work?.iiifbaseuri) && (
                        <a
                          target="_blank"
                          href={
                            work?.url || work?.primaryurl || work?.iiifbaseuri
                          }
                        >
                          {work?.primaryurl || work?.iiifbaseuri
                            ? "Link to media"
                            : "See more..."}
                        </a>
                      )}
                    </p>
                    <p>
                      {!!work?.roles && !!work?.roles?.length ? (
                        <span>
                          Roles: {work.roles.map((rol) => rol.role).join(", ")}
                        </span>
                      ) : (
                        ""
                      )}{" "}
                    </p>
                    <small
                      style={
                        work?.copyright
                          ? {
                              display: "flex",
                              justifyContent: "space-between",
                              gap: "2rem",
                            }
                          : {}
                      }
                    >
                      Last updated:{" "}
                      {new Intl.DateTimeFormat("es-ES").format(
                        new Date(work?.lastupdate)
                      )}{" "}
                      {work?.copyright ? (
                        <strong>Copyright: {work.copyright}</strong>
                      ) : (
                        ""
                      )}
                    </small>
                  </Card>
                );
                // }
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
    </HardvarMenu>
  );
};

const HardvarMenu = styled.article`
  width: 100%;
  height: 100%;
  padding: 1rem;
  padding-top: 2rem;
  display: grid;
  gap: 1rem;
  scroll-behaviour: smooth;
`;

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

export default Hardvar;
