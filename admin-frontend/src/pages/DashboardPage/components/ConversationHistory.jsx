import React, { useState } from "react";
import ConversationCard from "./ConversationCard";

export default function ConversationHistory(props) {
    const [active, setActive] = useState('');
    function chooseActive(id) {
        props.retrieveConvHis(id)
        setActive(id)
    }
    
    return (
        <div className= {props.className + " sm:w-96"}>
            <div className="max-h-[34rem] overflow-y-auto  rounded-lg mt-4 ml-1.5 md:ml-0  w-full space-y-0">
                {props.messageHistory.map((message) => {
                    return <ConversationCard
                        startTime={message.startTime}
                        messages={message.conversation}
                        key={message.id}
                        id={message.id}
                        active={active}
                        setActive={chooseActive} />
                })}
            </div></div>
    )
}