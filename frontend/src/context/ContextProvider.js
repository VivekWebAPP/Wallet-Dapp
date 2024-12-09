import React, { FC, useMemo } from 'react';

import Context from './ContextState';

const ContextProvider = (props) => {
    

    return (
        <Context.Provider value={{}}>
            {props.children}
        </Context.Provider>

    )
}

export default ContextProvider
