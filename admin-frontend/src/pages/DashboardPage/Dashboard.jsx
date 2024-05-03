import React, { useEffect, useRef, useState } from "react";
import DatePicker from "./components/DatePicker";
import ConversationHistory from "./components/ConversationHistory";
import serverBasePath from "../sharedComponents/imports";
import { addDays } from "date-fns";
import ChatWindow from "../sharedComponents/ChatWindow";
import { useParams } from "react-router-dom";

function Dashboard(props) {
    const { id } = useParams();
    const [selectOn, toggleSelect] = useState(false);
    const [history, setHistory] = useState([]); //keeps a record of all the conversations in the given date range
    const [date, setDate] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 0),
            key: 'selection'
        }
    ]);
    const [messageHistory, setMessageHistory] = useState([]);
    const [chatView, setChatView] = useState(false);

    const ref = useRef(); // Create a reference

    useEffect(() => {
        // Define the click handler
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                toggleSelect(false);
            }
        }

        // Add the click handler to the document
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            // Remove the click handler from the document when the component is unmounted
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []); // Trigger the effect only once on mount/unmount


    function toggleDatePicker() {
        toggleSelect(!selectOn);
    }

    function sendToBackend(dateRange) {
        if (dateRange[0].startDate !== undefined) {
            let startDate = dateRange[0].startDate;
            let endDate = dateRange[0].endDate;
            console.log(startDate)

            fetch(serverBasePath + '/history', {
                method: "POST",
                headers: new Headers({ 'content-type': 'application/json', 'Accept': 'application/json' }),
                mode: "cors",
                body: JSON.stringify({ startDate: startDate, endDate: endDate, chatbotId: id }),
                credentials: "include"
            })
                .then((response) => {
                    response.json().then((data) => { setHistory(data.history) });
                })
                .catch(err => console.log(err));
        }
    }

    function retrieveConvHis(conversationId) {
        fetch(serverBasePath + '/conversationHistory', {
            method: 'POST',
            headers: new Headers({ 'content-type': 'application/json', 'Accept': 'application/json' }),
            mode: "cors",
            credentials: "include",
            body: JSON.stringify({ conversationId: conversationId, chatbotId: id })
        }).then(response => {
            response.json().then(data => { setMessageHistory(data); setChatView(true) });
        }).catch(err => console.log(err))

    }

    function downloadJson() {
        if (history.length === 0){
            return;
        }
        const dataStr = JSON.stringify(history, function (key, value) {
            if (key === "_id" || key === 'id') { return undefined; }
            else { return value; }
        }, 2);

        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", url);
        downloadAnchorNode.setAttribute("download", "data.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();

        //removing the reference to file in memory
        URL.revokeObjectURL(url);
    }

    return (
        <>

            <div className="lg:ml-64 p-4 text-center mt-14">
                <div className="flex sm:w-[60vw] flex-col md:flex-row  m-auto sm:items-center h-content">
                    <div className="flex flex-col sm:w-1/2 mr-4 items-center p-5">

                        <button className="w-full sm:w-11/12 bg-blue-700 m-1.5 dark:bg-blue-800 rounded p-2 font-bold text-white focus:blue300 dark:hover:bg-blue-900"
                            onClick={toggleDatePicker}
                            // ref={ref}
                        >Choose Dates</button>

                        <div ref={ref}>
                            {selectOn && <DatePicker sendToBackend={sendToBackend} date={date} setDate={setDate} />}
                        </div>

                        <button
                            className="w-full sm:w-11/12 bg-blue-800 m-1.5 dark:bg-blue-800 rounded p-2 font-bold text-white focus:blue300 dark:hover:bg-blue-900"
                            onClick={downloadJson}
                        >Export Filtered Converations
                        </button>

                        <ConversationHistory
                            messageHistory={history}
                            retrieveConvHis={retrieveConvHis}
                            className='' //prevents adding undefined as a classname in the component
                        />

                    </div>
                    <div className="w-full h-3/4">
                        {chatView && <ChatWindow history={true} conversation={messageHistory} className='h-full mx-auto bg-white' />}
                    </div>

                </div>
            </div>
        </>
    )

}

export default Dashboard;