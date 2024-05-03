import { useEffect, useState } from "react";
import BotIcon from './components/BotIcon'
import { AiOutlinePlus } from 'react-icons/ai';
import serverBasePath from "../sharedComponents/imports";
import { useNavigate } from "react-router-dom";
import { FiMessageSquare } from 'react-icons/fi';
import AgencyHeader from "./components/AgencyHeader";

export default function AgencyDashboard(props) {
    const [chatbots, setChatbots] = useState([{
        chatBots: []
    }]);
    const [showClient, setShowClient] = useState(false);
    const [clientEmail, setClientEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch(serverBasePath + '/isAuthenticated', {
            method: "GET",
            headers: new Headers({
                'content-type': 'application/json',
                'Accept': 'application/json',
            }),
            mode: "cors",
            credentials: "include"
        })
            .then((response) => {
                response.json()
                    .then(data => {
                        if (data.authenticated === false) {
                            navigate('/login')
                        }
                    })

            })
            .catch(err => console.log(err))

    }, []);

    useEffect(() => {
        fetch(serverBasePath + '/agency/my-chatbots', {
            method: 'GET',
            headers: new Headers({ 'content-type': 'application/json', 'Accept': 'application/json' }),
            mode: "cors",
            credentials: "include"
        })
            .then(response => {
                response.json().then(data => {
                    console.log(data.clients)

                    setChatbots(data.clients);

                });
            })
            .catch(err => console.log(err))
    }, []);

    function newChatbot(userId) {
        fetch(serverBasePath + '/agency/new-chatbot/' + userId, {
            method: 'GET',
            headers: new Headers({ 'content-type': 'application/json', 'Accept': 'application/json' }),
            mode: "cors",
            credentials: "include"
        }).then(response => {
            response.json().then(data => { navigate(data.link) });
        }).catch(err => console.log(err))

    }

    function openClientField() {
        setShowClient(true);
    }

    function addClient() {
        fetch(serverBasePath + '/agency/add-new-client', {
            method: "POST",
            headers: new Headers({ 'content-type': 'application/json', 'Accept': 'application/json' }),
            mode: "cors",
            body: JSON.stringify({
                email: clientEmail,
            }),
            credentials: "include"
        })
            .then((response) => {

                response.json().then((data) => {
                    console.log(data)
                })
            })
            .catch(err => console.log(err))
    }

    return (
        <>
            <AgencyHeader />
            <div className="sm:ml-64 p-4  mt-36">
                <div className="flex w-full items-center justify-center my-5 mb-20">

                    {
                        showClient &&
                        <input
                            type="text"
                            className="w-1/2 border-gray-800 border rounded p-3 m-2"
                            placeholder="user@example.com"
                            value={clientEmail}
                            onChange={(evt) => { setClientEmail(evt.target.value) }}
                        />
                    }

                    <button className={`text-white p-1 h-12 px-4 bg-blue-700 hover:bg-blue-800 focus:ring-none 
                    focus:outline-none font-medium rounded-lg
                     text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 
                      ${showClient ? 'w-[10%}' : 'w-[80%]'}`}
                        onClick={showClient ? addClient : openClientField}
                    >
                        {showClient ? 'Confirm' : 'Add new Client'}
                    </button>

                </div>

                {
                    chatbots[0].chatBots.length !== 0 && chatbots.map(client => {
                        return <>
                            <h2 className="font-semibold text-blue-950 text-2xl text-left px-[7vw] mt-10">{client.email}'s Chatbots</h2>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 w-full max-w-5xl m-auto my-8 gap-8 items-center justify-center ">

                                {client.chatBots.map(
                                    (chatbot, index) => {
                                        return <BotIcon
                                            name={chatbot.name}
                                            onClick={() => { navigate('/backend/chatbot/' + chatbot._id) }}
                                            key={chatbot._id}
                                        >
                                            <FiMessageSquare size={' '} className='object-cover' />
                                        </BotIcon>
                                    })
                                }

                                <BotIcon name="New Chatbot" onClick={() => { newChatbot(client.id) }}>
                                    <AiOutlinePlus size={" "} className='object-cover' />
                                </BotIcon>

                            </div>



                        </>
                    })
                }


            </div>
        </>
    )
}