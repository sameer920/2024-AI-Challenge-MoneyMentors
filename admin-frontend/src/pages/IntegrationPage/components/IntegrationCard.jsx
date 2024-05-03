import React, { useState } from "react";
import { AiFillSlackCircle } from 'react-icons/ai'

export default function IntegrationCard(props) {
    const [clicked, setClicked] = useState(false);
    return (

        <div className="mx-auto flex justify-between w-full p-4 text-left bg-gray-400 dark:bg-gray-800 hover:dark:bg-gray-700 dark:text-white rounded-2xl mt-2 text-xl" onClick={props.onClick}>
            <span className="font-mono text-lg">{props.icon} {props.text} </span>
            <span className="text-right text-sm text-slate-200 mr-1">{props.details}</span>

        </div>)
}