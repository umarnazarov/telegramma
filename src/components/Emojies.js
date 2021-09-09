import React, { useState } from 'react'
import Picker from 'emoji-picker-react';
import '../css/Emojies.css'

function Emojies({ chosenEmoji, setChosenEmoji }) {
    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
    };

    return (
        <Picker onEmojiClick={onEmojiClick} pickerStyle={{ position: "absolute", top: '-325px', boxShadow: "none", border: "none", right: "10px" }} />
    )
}

export default Emojies
