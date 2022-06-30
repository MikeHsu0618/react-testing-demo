import {useState, useCallback, useEffect} from 'react'

const useCounter = (s = 0, cb = () => { console.log('count') }) => {
    const [count, setCount] = useState(s);
    const add = (addend = 1) => {
        setCount(count + addend);
    };

    useEffect(cb, [count]);

    return { count, add };
};

export default useCounter;
