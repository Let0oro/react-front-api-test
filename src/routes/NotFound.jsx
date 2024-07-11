import React from 'react'
import { useRouteError } from 'react-router-dom'

const NotFound = () => {

    const error = useRouteError();

  return (
    <>
   <h2>Oops!</h2>
   <h3>Seems like this route don't exist</h3>
   <p>Maybe for this reason...</p>
   <i>{error.statusText || error.message}</i>
    </>
  )
}

export default NotFound