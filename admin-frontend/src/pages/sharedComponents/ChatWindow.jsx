import React, { useEffect, useRef, useState } from "react";
// import { v4 as uuidv4 } from 'uuid';
import './styles/chatWindow.css';
import ChatBubble from "./ChatBubble";
import serverBasePath from "./imports";
import ReviewAnswerModal from "../DashboardPage/components/ReviewAnswerModal";
import { useParams } from "react-router-dom";
import { TextareaAutosize } from "@mui/material";


function ChatWindow(props) {
    const { id } = useParams()
    // const welcomeMessage = {
    //     sender: 'bot',
    //     body: 'Hi, how may I help you today?'
    // };


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const [text, setText] = useState('');
    const [messages, setMessages] = useState([])
    const messagesEndRef = useRef(null);
    const [edit, toggleEditor] = useState(false);
    const [editorVals, setEditorVals] = useState({ userMessage: '', botResponse: '' })
    const [typing, setTyping] = useState(false);
    const [conversationId, setConversationId] = useState('');
    const [credits, setCredits] = useState(-1);

    useEffect(scrollToBottom, [messages]);


    function addMessage(message) {
        setMessages(messages => [...messages, message]);
    }

    function handleChange(event) {
        //handle input being done in the text area. This text will be the user input that will be sent to the server. 
        setText(event.target.value)
    }

    function sendMessage(event) {
        event.preventDefault();
        let messageBody = { sender: 'user', body: text, conversationId: conversationId }
        addMessage(messageBody);
        setTyping(true);
        fetch(serverBasePath + '/message/' + id, {
            method: 'POST',
            headers: new Headers({ 'content-type': 'application/json', 'Accept': 'application/json' }),
            mode: "cors",
            credentials: "include",
            body: JSON.stringify(messageBody)
        }).then(response => {
            response.json().then(data => {
                setTyping(false)
                addMessage(data);
                if (conversationId === '') {
                    setConversationId(data.conversationId)
                }
            });
        })
            .catch(err => console.log(err))
        setText('')
    }

    function restartConvo(id) {
        setMessages([]);
        setConversationId('');
        setCredits(-1);
        
        fetch(serverBasePath + '/start/' + id, {
            method: 'POST',
            headers: new Headers({ 'content-type': 'application/json', 'Accept': 'application/json' }),
            mode: "cors",
            credentials: "include",
            // body: JSON.stringify({sender: 'user', body: message})
        }).then(response => {
            response.json().then(data => {
                addMessage(data.message);
                setCredits(data.credits);
            });
        }).catch(err => console.log(err))
    }



    function OpenEditor(id) {
        //used to toggle editor by clicking the Revise Answer button.
        console.log('props.conv', props.conversation[id])
        setEditorVals({ userMessage: props.conversation[id - 2].body, botResponse: props.conversation[id - 1].body })
        toggleEditor(true);
    }

    function handleModalInput(key, val) {
        setEditorVals({
            ...editorVals,
            [key]: val
        });
    }

    useEffect(() => { restartConvo(id) }, [])
    return (
        // Create main window
        <div className={" chat-window w-[70vw] h-fit overflow-auto p-2.5 rounded-md shadow-md border-stone-300 border-2 bg-stone-100"}>

            {/* Refresh button: */}
            <div className="flex flex-initial flex-wrap flex-row-reverse " onClick={() => { restartConvo(id) }}>
                <button>
                    <img src={serverBasePath + "/refresh.svg"} className="w-10 p-2 refresh control-icons" />
                </button>
            </div>

            <hr className="bg-stone-300 rounded-lg mb-1 h-px" />

            <div className="main">
                {/* Create main chat area */}
                <div className="flex flex-col flex-wrap chat-area">

                    {(props.history ? props.conversation : messages).map((message, index) => <ChatBubble key={index + 1}
                        id={index + 1}
                        message={message}
                        editable={props.history}
                        toggleEditor={OpenEditor} />)}

                    {typing && <ChatBubble key={-1} typing={typing} />}

                    <div ref={messagesEndRef} />  {/*scrolls the newly added message into view*/}
                </div>
            </div>

            {/* {
                // Show remaining message credits
                props.history === false && credits !== -1 && <p className="text-xs m-1.5 text-stone-500">{credits} message credits left</p>
            } */}

            {
                // field to write message that would sent. This is not shown if the component is used to display a previous conversation
                props.history === false &&

                (<div className="message-area border-2 p-2.5 pt-3 border-stone-200 rounded-md focus-within:outline-none focus-within:border-stone-600">
                    <form onSubmit={sendMessage}>
                        <TextareaAutosize name="message"
                            required
                            minRows={1}
                            maxRows={3}
                            value={text}
                            onChange={handleChange}
                            onKeyDown={event => {
                                if (event.key === 'Enter' && !event.shiftKey) {
                                    sendMessage(event);
                                }
                            }}
                            className="resize-none w-11/12 text-sm  outline-none " />
                        <button type="submit" className=" sm:pl-2 pl-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5"
                                viewBox="0 0 512 512">
                                <path
                                    d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
                            </svg>
                        </button>
                    </form>
                </div>)

            }

            {
                // Review modal that pops up and allows the user to revise the answer provided by the chatbot. Shown only when bot is used to display a previous conversation.
                props.history && <ReviewAnswerModal
                    toggleEditor={toggleEditor}
                    message={editorVals}
                    setMessage={handleModalInput}
                    edit={edit}
                />
            }
        </div>

    )
}

export default ChatWindow;