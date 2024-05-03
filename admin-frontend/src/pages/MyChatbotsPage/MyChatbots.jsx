import { useEffect, useState } from "react";
import BotIcon from './components/BotIcon'
import { AiOutlinePlus } from 'react-icons/ai';
import serverBasePath from "../sharedComponents/imports";
import { useNavigate } from "react-router-dom";
import { FiMessageSquare } from 'react-icons/fi';
import Header from "../sharedComponents/Header";
import Loading from "../loading/Loading";

export default function MyChatbots(props) {
    const [chatbots, setChatbots] = useState([]);
    // ********************* FOR Loading ONLY**************************
    const[loading,setloading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetch(serverBasePath + '/auth/isAuthenticated', {
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
        fetch(serverBasePath + '/my-chatbots', {
            method: 'GET',
            headers: new Headers({ 'content-type': 'application/json', 'Accept': 'application/json' }),
            mode: "cors",
            credentials: "include"
        })
            .then(response => {
                response.json().then(data => {
                    console.log(data.chatBots)

                    const newChatBots = data.chatBots.map(chatbot => ({
                        name: chatbot.name,
                        id: chatbot._id,
                        icon: chatbot.icon
                    }));

                    setChatbots(newChatBots);
                    setloading(false);

                });
            })
            .catch(err => console.log(err))
    }, []);

    function newChatbot() {
        fetch(serverBasePath + '/new-chatbot', {
            method: 'GET',
            headers: new Headers({ 'content-type': 'application/json', 'Accept': 'application/json' }),
            mode: "cors",
            credentials: "include"
        }).then(response => {
            response.json().then(data => { navigate(data.link) });
        }).catch(err => console.log(err))

    }

    return (
        <>
            <Header />
            {/* <div className="sm:ml-64 p-4  mt-14"> */}
            <div className="flex justify-center items-center flex-col mt-20">
                <h2 className="font-semibold text-xl sm:2xl">My Chatbots</h2>

                {
                    loading ? <>
                        <Loading/>
                    </>
                    :
                    <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 w-full max-w-5xl m-auto my-8 gap-8 items-center justify-center ">
                    <BotIcon name="New Chatbot" onClick={newChatbot}>
                        <AiOutlinePlus size={" "} className='object-cover' />
                    </BotIcon>
                    {chatbots.map(chatbot => {

                        return <BotIcon
                            name={chatbot.name}
                            onClick={() => { navigate('/backend/chatbot/' + chatbot.id) }}
                            key={chatbot.id}
                        >
                            <FiMessageSquare size={' '} className='object-cover' />
                        </BotIcon>
                    }
                    )}
                </div>
                    </>
                }

                {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 w-full max-w-5xl m-auto my-8 gap-8 items-center justify-center ">
                    <BotIcon name="New Chatbot" onClick={newChatbot}>
                        <AiOutlinePlus size={" "} className='object-cover' />
                    </BotIcon>
                    {chatbots.map(chatbot => {

                        return <BotIcon
                            name={chatbot.name}
                            onClick={() => { navigate('/backend/chatbot/' + chatbot.id) }}
                            key={chatbot.id}
                        >
                            <FiMessageSquare size={' '} className='object-cover' />
                        </BotIcon>
                    }
                    )}
                </div> */}
            </div>
        </>
    )
}