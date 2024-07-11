import React, {
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { Await, json, useLoaderData, useParams } from "react-router-dom";
import Spinner from "../Spinner";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import dizznessObj from "../../utils/dizznessObj";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "REFRESH":
//       return {
//         keys: action.keys,
//         values: action.values,
//         testTp: action.testTp,
//         keys: !action.test && action.keys,
//         shitMatOrCons: action.shitMatOrCons,
//         length: action.length,
//       };
//     default:
//       throw new Error(`Type ${action.type} not recognized!`);
//   }
// };

// const initialValue = {
//   keys: [],
//   values: [],
//   testTp: "",
//   shitMatOrCons: false,
//   length: 0,
// };

const objTest = {
  name: "John Doe",
  age: 30,
  isEmployed: true,
  skills: ["JavaScript", "React", "Node.js"],
  address: {
    street: "123 Main St",
    city: "Springfield",
    postalCode: "12345",
  },
  projects: [
    {
      name: "Project A",
      description: "A web application project.",
      completed: false,
      budget: 1500,
    },
    {
      name: "Project B",
      description: "A mobile application project.",
      completed: true,
      budget: 3000,
    },
  ],
  preferences: {
    newsletter: true,
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
  },
  contacts: [
    {
      type: "email",
      value: "john.doe@example.com",
    },
    {
      type: "phone",
      value: "555-1234",
    },
  ],
};

const GenshinCard2 = memo(({ item }) => {
  const objParsed = dizznessObj(objTest);

  const genOtherHtml = (obj) => {
    const { keys, values } = obj;
    console.log({ keys });
    const lengthObj = keys.length;

    let returned;
    for (let i = 0; i < lengthObj; i++) {
      const value = values[i];
      const key = keys[i];

      console.log({ key }, { value });

      returned = (
        <Card>
          {!!(Array.isArray(key) && Array.isArray(value)) ? (
            value.length < key.length ? (
              <ul style={{ backgroundColor: "green" }}>
                <i>{key[0]}</i>
                <li>{genOtherHtml({ keys: key[0], values: value })}</li>
              </ul>
            ) : (
              <ul>
                <i>{key[0]}</i>
                <li>{genOtherHtml({ keys: key, values: value })}</li>
              </ul>
            )
          ) : (
            <p style={{ backgroundColor: "blue" }}>
              <b>{key}</b>: {String(value)}
            </p>
          )}
        </Card>
      );
    }
    return returned;
  };

  const { keys, values } = objParsed;

  const childrenHtml = genOtherHtml({ keys, values });

  return <CardChild className="childrenRender">{childrenHtml}</CardChild>;
});

const MasterCard = styled.section`
  background-color: red;
`;

const CardChild = styled.div``;

const Card = styled.article`
  border-bottom: 1px solid #888;
  padding: 1rem 0;
  & p {
    text-align: center;
  }
`;

export default GenshinCard2;
