import axios from 'axios';
import { useMemo, useState } from 'react'

const useAxios = async (url) => {

    const [listItems, setListItems] = useState([]);

    useMemo(() => {

        const axiosCall = () => {
            const data = axios.get(url);

            console.log(data)

            setListItems(data)
        }

        axiosCall()

    }, [url])

    return { listItems }
}

export default useAxios