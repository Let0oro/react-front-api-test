import React, { memo, Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import Spinner from "../Spinner";
import GenshinCard from "./GenshinCard";
import GenshinCard2 from "./GenshinCard2";

const GenshinApiChildren = memo(() => {
  const { data } = useLoaderData();

  return (
    <>
      <Suspense fallback={<Spinner />}>
        <Await
          resolve={data}
          errorElement={<i>Data not founded</i>}
          children={(item) => <GenshinCard2 item={item} />}
        ></Await>
      </Suspense>
    </>
  );
});

export default GenshinApiChildren;
