import React from "react";
import "./styles/chatbubble.css"

function ChatBubble(props) {
    /*
    props: 
        message -- JSON: containing sender and message body
        editable: boolean: Decided whether review modal should be activated or not
        toggleEditor: function: controls state to pop up modal and passes it the id so it can render correct values in the modal
        id: number: unique id for each message and same as value key prop of the message
    */

    return (
        <>
            {props.typing && <div className="bg-stone-200 bot rounded-lg p-3.5 m-3.5 w-fit chatBubble text-right">
                <div className="flex justify-center space-x-2 animate-breathe">
                    <div className="h-1 w-1 bg-gray-500 rounded-full"></div>
                    <div className="h-1 w-1 bg-gray-500 rounded-full"></div>
                    <div className="h-1 w-1 bg-gray-500 rounded-full"></div>
                </div>
            </div>}
            
           {props.typing !== true &&  <div className={props.message.sender === "bot" ? "bg-stone-200 bot rounded-lg p-3.5 m-3.5 w-fit chatBubble text-right" : "bg-blue-500 user text-white rounded-lg p-3.5 m-3.5 w-fit chatBubble"}>
                <p className="text-left">{props.message.body}</p>
                {props.message.sender === 'bot' && props.editable && props.id !== 1 && <button className="text-xs text-gray-500 text-left w-fit m-0 inline" onClick={() => props.toggleEditor(props.id)}>Revise Answer</button>}
            </div>}
        </>
    )
}

export default ChatBubble;