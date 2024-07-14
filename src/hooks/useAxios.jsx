import axios from 'axios';
import { useMemo, useState } from 'react'

const useAxios = async (url) => {
    const [listItems, setListItems] = useState([]);

    useMemo(() => {

        const axiosCall = async () => {
            const data = await axios.get(...url);

            console.log({data})

            setListItems(data)
        }

        axiosCall()

    }, [url])

    const {data} = listItems;

    return await data
}

export default useAxios