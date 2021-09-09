import React, { createContext, useState } from 'react'

export const ThemeContext = createContext()

function ThemeContextProvider(props) {
    const [checked, setChecked] = useState(true);

    const handleChange = nextChecked => {
        setChecked(nextChecked);
    };

    const data = {
        checked,
        handleChange,
    }
    return (
        <ThemeContext.Provider value={data}>
            {props.children}
        </ThemeContext.Provider>
    )
}

export default ThemeContextProvider
