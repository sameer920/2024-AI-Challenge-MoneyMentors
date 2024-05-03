import React from "react";
import ChatWindow from "../sharedComponents/ChatWindow";

function Chatbot(props) {
    return (
        <div>
            <div className=" p-4 mt-7 ">
                <ChatWindow history={false}/>
            </div>
        </div>
    )
}

export default Chatbot;