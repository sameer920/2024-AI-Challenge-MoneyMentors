import React, { useState } from "react";
import Sources from "./Sources";

function RetrainBot(props) {

    const [buttonText, setButtonText] = useState('Retrain Chatbot');

    function handleClick(event) {
        if (event !== undefined) {
            props.retrainbot(event);
        }
        else {
            props.retrainbot();
        }
        // setButtonText('Retraining ...');
    }

    return (
    <div>
        <h4>Included Sources</h4>
        <div className="flex justify-between mt-4">
            {props.sources.map((s)=>{return <Sources source={s} key={s}/>})}
        </div>
        {/* <p className="text-sm text-slate-500 my-1 mb-2">{props.sources}</p> */}
        <button
                type='submit'
                onClick={handleClick}
                className="bg-blue-950 hover:bg-blue-600 p-2 rounded text-slate-50 mt-4 w-full disabled:opacity-90 disabled:hover:bg-blue-950"
                disabled={props.buttonText === 'Retraining Chatbot...'}
            >
                {props.buttonText}
            </button>
    </div>)
}

export default RetrainBot;