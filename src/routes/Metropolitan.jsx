import React, { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import Spinner from "../components/Spinner";
import { v4 as uuidv4 } from "uuid";

const Metropolitan = () => {
  const { data } = useLoaderData();

    if (data) console.log(data);

  return (
    <>
      <h4 style={{textDecoration: 'underline'}}>Metropolitan departaments</h4>
      <Suspense fallback={<Spinner />}>
        <Await
          resolve={data.departments}
          errorElement={<div>Could not load data 😬</div>}
          children={(resolvedPictures) => (
            resolvedPictures.map(({displayName, departmentId}) => (<p key={departmentId}>{displayName}</p>))
            )
          }
        />  
      </Suspense>
    </>
  );
};

export default Metropolitan;
