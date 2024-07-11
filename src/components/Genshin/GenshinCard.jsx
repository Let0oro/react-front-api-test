import React, {
  memo,
  Suspense,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { Await, useParams } from "react-router-dom";
import Spinner from "../Spinner";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";

const reducer = (state, action) => {
  switch (action.type) {
    case "REFRESH":
      return {
        list: action.newList,
        isArray: action.test,
        keys: !action.test && action.keys,
        consMat: action.consMat,
      };
    default:
      throw new Error(`Type ${action.type} not recognized!`);
  }
};

const initialValue = {
  list: [],
  isArray: null,
  keys: [],
  consMat: null,
};

const GenshinCard = memo(({ item }) => {
  //   const [isArray, setIsArray] = useState(null);

  const [state, dispatch] = useReducer(reducer, initialValue);

  const params = useParams();

  useMemo(() => {
    const reassignAndRefresh = async () => {
      const testConsAndMat =
        params.class == "consumables" || params.class == "materials";

      const test = Array.isArray(item);
      const keys = !test ? Object.keys(item) : [];

      let listItems = item;

      if (!!testConsAndMat) {
        const listLength = keys.length;
        const newArr = [];

        for (let idx = 0; idx < listLength; idx++) {
          const newValue = listItems[keys[idx]];

          // const oldValue = listItems[keys[idx]];

          // let newValue;
          // newValue = oldValue;

          // if (params.class == "materials") {
          //   newValue = <div key={uuidv4()}>Material Item</div>;
          // }

          newArr.push(newValue);
        }
        listItems = newArr;
      }

      dispatch({
        type: "REFRESH",
        newList: listItems,
        test,
        keys,
        consMat: testConsAndMat,
      });
    };

    reassignAndRefresh();
  }, [item]);

  const { list, isArray, keys, consMat } = state;

  if (!list) return <i>{params.class}'s item not found</i>;

  if (!!isArray) {
    return (
      <Suspense fallback={<Spinner />}>
        <Card>
          <ul>
            {list?.map((el) => (
              <li key={uuidv4()}>{el}</li>
            ))}
          </ul>
        </Card>
      </Suspense>
    );
  }

  if (!consMat) {
    const {
      name,
      affiliation,
      birthday,
      constellation,
      constellations,
      description,
      gender,
      id,
      nation,
      passiveTalents,
      rarity,
      release,
      skillTalents,
      title,
      vision,
      vision_key,
      weapon,
      weapon_type,
    } = list;
    return (
      <Suspense fallback={<Spinner />}>
        <Card>
          <i>{name}</i>
          <p>
            <b>{}</b>{" "}
          </p>
        </Card>
      </Suspense>
    );
  }

  if (!!(params.class == "consumables")) {
    return list.map(
      ({
        name,
        rarity,
        recipe,
        hasRecipe,
        effect,
        description,
        proficiency,
        type,
      }) => (
        <Suspense key={uuidv4()} fallback={<Spinner />}>
          <Card>
            <i>
              {name} - {rarity}
            </i>
            <p>
              <b>Type: </b>
              {type}
            </p>
            <p>
              <b>Effect: </b>
              {effect}
            </p>
            <p>
              <b>Proficiency: </b>
              {proficiency}
            </p>
            {!!hasRecipe ? (
              <div>
                <b>Recipe:</b>
                <ul>
                  {recipe.map(({ item, quantity }, i) => (
                    <li key={i}>
                      {item} x {quantity}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              ""
            )}
            <p>Description: {description}</p>
          </Card>
        </Suspense>
      )
    );
  }

  if (!!(params.class == "materials")) {
    console.log(list);

    const listWtString = [...list];
    listWtString.pop();

    return (
      <Suspense fallback={<Spinner />}>
        {listWtString.map((it) => (
          <Card key={uuidv4()}>
            {it?.name && (
              <p>
                <u>{it?.name}</u>
              </p>
            )}
            {it?.characters && (
              <p>
                <b>Characters:</b>
                {it?.characters?.map((src, i) => (
                  <i key={i}>{src}</i>
                ))}
              </p>
            )}
            <p>
              {it?.weapons && (
                <>
                  <b>Weapons:</b>
                  {it?.weapons?.map((src, i) => (
                    <i key={i}>{src}</i>
                  ))}
                </>
              )}
            </p>
            <p>
              <b>Sources:</b>
              {it?.sources && it?.sources.map((src, i) => <i key={i}>{src}</i>)}

              {it?.source && <i key={uuidv4()}>{it?.source}</i>}
            </p>
          </Card>
        ))}
      </Suspense>
    );
  }
});

const Card = styled.article`
  border-bottom: 1px solid #888;
  padding: 1rem 0;
  & p {
    text-align: center;
  }
`;

export default GenshinCard;
