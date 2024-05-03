import React, { useEffect, useState } from "react"
import serverBasePath from "../sharedComponents/imports"
import Slider from '@mui/material/Slider';
import { useParams } from "react-router-dom";
import { TextareaAutosize } from "@mui/material";


// let config = {
//     botId: '',
//     totalChars: '',
//     name: '',
//     basePrompt: '',
//     model: 'gpt-3.5-turbo', //dropdown
//     temprature: 0,
//     publicAccess: false, //dropdown
//     domains: [],
//     rateMessages: '',
//     rateSeconds: '',
//     initialMessage: 'Hello, how can I help you?',
//     SuggestedMessages: [],
//     theme: '',//light dark dropdown
//     displayName: '',
//     userBubbleColor: '#3b82f6',
//     chatButtonColor: '#030712',
//     autoShowTime: ''
// }


export default function Settings(props) {
    const { id } = useParams();
    const [settings, setSettings] = useState({});
    const [response, setResponse] = useState('');

    const handleChangeSlider = (event, newValue) => {
        setSettings({ ...settings, temprature: (newValue / 10) })
    };

    function handleChange(key, event) {
        setSettings({
            ...settings,
            [key]: event.target.value

        });

    }

    function handleVisbilityChange(event) {
        setSettings({
            ...settings,
            publicAccess: event.target.value === 'private' ? false : true
        });
    }

    useEffect(() => {
        fetch(`${serverBasePath}/settings/${id}`, {
            method: "GET",
            headers: new Headers({ 'content-type': 'application/json', 'Accept': 'application/json' }),
            mode: "cors",
            credentials: "include"
        })
            .then((response) => {

                response.json().then((data) => setSettings(data))
            })
            .catch(err => console.log(err))

    }, []);

    function updateSettings() {
        fetch(`${serverBasePath}/settings/${id}`, {
            method: "POST",
            headers: new Headers({ 'content-type': 'application/json', 'Accept': 'application/json' }),
            mode: "cors",
            body: JSON.stringify(settings),
            credentials: "include"
        })
            .then((response) => {

                response.json().then((data) => setResponse(data.response));
                setTimeout(() => {
                    setResponse('');
                }, 10000);
            })
            .catch(err => console.log(err))
    }


    return (
        <>
            {settings.name !== undefined && <div className="lg:ml-64 py-8 px-[5%] text-lg text-left mt-7">

                <h4 className="text-gray-500 my-4">Chatbot ID</h4>
                <p className="font-semibold">{settings.botId}</p>

                <h4 className="text-gray-500 my-4">Number of Characters</h4>
                <p className="font-semibold">{settings.totalChars}</p>

                <h4 className="text-gray-500 my-4">Name</h4>
                <input type="text"
                    className="w-[90%] border-gray-300 border rounded focus:outline-blue-900 p-2"
                    value={settings.name}
                    onChange={(evt) => { handleChange('name', evt) }}
                />

                <h4 className="text-gray-500 my-4">Base Prompt (system message)</h4>
                <TextareaAutosize name="basePrompt"
                    className="p-2 w-[90%] resize-none border-gray-300 border rounded focus:outline-blue-900"
                    maxRows={5}
                    minRows={2}
                    value={settings.basePrompt}
                    onChange={(evt) => { handleChange('basePrompt', evt) }}
                />

                <h4 className="text-gray-500 my-4">Model</h4>

                <select
                    value={settings.model}
                    onChange={(evt) => { handleChange('model', evt) }}
                    className=" p-1 border-gray-300 border rounded focus:outline-blue-900"
                >

                    <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                    <option value="gpt-4">gpt-4</option>

                </select>

                <h4 className="text-gray-500 my-4">Temprature: {settings.temprature }</h4>
                <span></span>
                <div className="w-[90%]  ml-7 my-2">
                    <Slider
                        min={0}
                        max={10}
                        steps={1}
                        value={settings.temprature * 10}
                        onChange={handleChangeSlider}
                        className="my-2 w-7"
                        marks={[
                            {
                                value: 0,
                                label: 'Reserved'
                            },
                            {
                                value: 10,
                                label: 'Creative'
                            },

                        ]}
                    />
                </div>

                <h4 className="text-gray-500 my-4">Visibility</h4>
                <select value={settings.publicAccess ? 'public' : 'private'} onChange={handleVisbilityChange}
                    className=" p-1 border-gray-300 border rounded focus:outline-blue-900 mb-4 w-36"
                >
                    <option value="gpt-3.5-turbo">private</option>
                    <option value="gpt-4">public</option>
                </select>
                <p className="text-gray-500 mb-2 text-sm">'private': The chatbot can only be accessed from your account </p>
                <p className="text-gray-500 mb-2 text-sm">'public': People can chat with your chatbot if you send them a link or you can embed the chatbot on your website
                    so your visitors are able to use it.
                </p>

                <h4 className="text-gray-500 my-4">Initial Message</h4>
                <TextareaAutosize
                    name="InitialMessage"
                    className="p-2 w-[90%] resize-none border-gray-300 border rounded focus:outline-blue-900"
                    maxRows={5}
                    minRows={2}
                    value={settings.initialMessage}
                    onChange={(evt) => { handleChange('initialMessage', evt) }}
                />

                <h4 className="text-gray-500 my-4">User Message Color</h4>
                <input type="color"
                    className="h-7 w-6 p-0 m-0 border-none outline-none"
                    value={settings.userBubbleColor}
                    onChange={(evt) => { handleChange('userBubbleColor', evt) }}
                />

                <h4 className="text-gray-500 my-4">Chat Bubble Color</h4>
                <input type="color"
                    className="h-7 w-6 p-0 m-0 border-none outline-none"
                    value={settings.chatButtonColor}
                    onChange={(evt) => { handleChange('chatButtonColor', evt) }}
                />
                <br />
                <div className="text-center">
                    <button
                        className="py-3 font-medium bg-blue-600 rounded-lg text-white my-8 px-7 "
                        onClick={updateSettings}
                    >Update Settings</button>
                    <h5 className={"font-semibold text-xl " + (response === 'Settings successfully updated' ? 'text-green-600' : 'text-red-700')} >{response}</h5>
                </div>
            </div>}
        </>
    )
}