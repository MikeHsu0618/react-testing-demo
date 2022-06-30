import React from "react";
import useCounter from "../../hooks/useCounter/useCounter";

const Counter = () => {
    const { count, add } = useCounter(5, () => { console.log('這裡是 callBack') });
    return (
        <div>
            <span>{count}</span>
            <button onClick={() => { add(3); }}>++</button>
        </div>
    );
}

export default Counter;