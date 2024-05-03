import React, { useEffect, useState } from "react";
import IncludedLinks from "../sharedComponents/IncludedLinks";
import RetrainBot from "../sharedComponents/RetrainBot";
import serverBasePath from "../sharedComponents/imports";
import { useParams } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { CircularProgress, LinearProgress } from "@mui/material";

export default function WebsiteSource(props) {
    const [links, editLinks] = useState([]);
    const [crawlLink, setCrawlLink] = useState('')
    const [sitemap, setSitemap] = useState('')
    const [progress, setProgress] = useState(10);
    const [showProgress, setShowProgress] = useState(false);
    const [messageColor, setMessageColor] = useState('text-blue-800');
    const [message, setMessage] = useState('Fetching And Processing Content...');
    const [sources, setSources] = useState([]);
    const [buttonText, setButtonText] = useState('Retrain Chatbot');
    const [clicked, setClicked] = useState(false);
    const { id } = useParams();


    const progressBarStyle = {
        marginTop: '2.5%',
        height: 7,
        borderRadius: 10,
        width: '100%'
    }

    useEffect(function getLinks() {
        fetch(serverBasePath + '/train/website/' + id, {
            method: "GET",
            headers: new Headers({ 'content-type': 'application/json', 'Accept': 'application/json' }),
            mode: "cors",
            credentials: "include"
        })
            .then((response) => {

                response.json().then((data) => {
                    if (data !== {}) {
                        setSources(data.trainedData);
                        data.links.map((link, index) => addLink(link, index))
                    }
                })
            })
            .catch(err => console.log(err))
    }, [])

    const handleUpdate = (valueToUpdate, newValue) => {
        editLinks(prevArray =>
            prevArray.map(item => (item.link === valueToUpdate ? { link: newValue, chars: '', status: undefined } : item))
        );
    }

    function handleRemove(id) {
        console.log(id)
        editLinks(prevArray => prevArray.filter(item => item.id !== id));
    }

    function addLink(link, index) {
        const empty = links.filter(link => link.link === '');
        if (empty.length > 0) {
            return;
        }
        editLinks(prev => {
            if (link.id === undefined) {
                link.id = index
            }
            return [...prev, link]
        })
    }


    function sendSitemap() {
        fetch(serverBasePath + '/train/website/sitemap', {
            method: "POST",
            headers: new Headers({ 'content-type': 'application/json', 'Accept': 'application/json' }),
            mode: "cors",
            body: JSON.stringify({ sitemap: sitemap }),
            // credentials: "include"
        })
            .then((response) => {

                response.json().then((data) => {
                    if (data !== {}) {
                        data.links.map((link, index) => addLink(link, index))
                    }
                })
            })
            .catch(err => console.log(err))
    }

    function sendBaseLink() {
        setClicked(true)
        fetch(serverBasePath + '/train/website/baseLink', {
            method: "POST",
            headers: new Headers({ 'content-type': 'application/json', 'Accept': 'application/json' }),
            mode: "cors",
            body: JSON.stringify({ url: crawlLink }),
            credentials: "include"
        })
            .then((response) => {

                response.json().then((data) => {
                    if (data !== {}) {
                        setClicked(false);
                        console.log(data.links)

                        data.links.map((link, index) => addLink(link, index))
                    }
                })
            })
            .catch(err => console.log(err));


    }

    function sendLinks() {
        setButtonText('Retraining Chatbot...');
        const socket = socketIOClient(serverBasePath);
        let socketId;
        socket.on('connect', () => {

            socketId = socket.id;
            setShowProgress(true)
            const untrainedLinks = links.filter(item => item.status === undefined || item.status === '');
            fetch(serverBasePath + '/train/website/links', {
                method: "POST",
                headers: new Headers({ 'content-type': 'application/json', 'Accept': 'application/json' }),
                mode: "cors",
                body: JSON.stringify({ links: untrainedLinks, chatbotId: id, socketId: socketId }),
                credentials: "include"
            })
                .then((response) => {



                    if (response.status === 200) {
                        setMessageColor('text-green-800');
                    }
                    else if (response.status === 400) {
                        setMessageColor('text-red-800');
                    }

                    response.json().then((data) => {

                        setMessage(data.message);
                        setButtonText('Retrain Chatbot');

                        if (data !== {} && response.status !== 400) {
                            editLinks([]);
                            data.links.map((link, index) => addLink(link, index))
                            socket.disconnect();
                        }
                        setSources(data.trainedData);

                        setTimeout(() => setShowProgress(false), 10000);
                    })
                })
                .catch(err => console.log(err))


            socket.on("scrapingProgress", data => {
                setProgress(data);
                // Update UI here to show progress
            });
        });

    }




    return (
        <>
            <div className="p-4">
                <h3 className=" text-blue-900 mb-4 text-xl
                 font-semibold text-center">Train A Model Using Data From Your Website</h3>
                <div className="flex w-full flex-col items-start m-auto">
                    <h4 className="ml-3 my-1 font-bold">Crawl</h4>

                    <div className="flex flex-col gap-4 sm:flex-row w-full mt-2 ">
                        <input
                            type="text"
                            name="crawl"
                            placeholder="https://www.example.com"
                            value={crawlLink}
                            onChange={(event) => setCrawlLink(event.target.value)}
                            className=" border sm:py-1 px-3 
                            rounded-md border-gray-400 w-full"/>
                        <button className="p-0.5 sm:p-2 rounded-md bg-blue-600 hover:bg-blue-700 ml-2 text-white"
                            onClick={sendBaseLink}
                        >
                            Fetch Links {clicked && <CircularProgress sx={{'marginLeft': '10px', color:'white', marginTop: '1px', }} size={17}/>}
                        </button>
                    </div>

                    <div className="grid-cols-2 grid grid-rows-1 w-full">

                        <button
                            className="text-white bg-blue-500 hover:bg-blue-800 
                            font-medium rounded-lg px-4 py-2 text-center dark:bg-blue-500 ml-[5%] lg:ml-14
                        dark:hover:bg-blue-700 dark:focus:ring-blue-800 my-8 justify-self-start "
                            onClick={() => { addLink({ link: '', status: '', chars: '' }, links.length) }}
                        >
                            Add New
                        </button>

                        {
                            links.length !== 0 &&
                            <button className="text-red-600 text-lg text-right my-8 justify-self-end"
                                onClick={() => editLinks([])}
                            >
                                Delete All
                            </button>
                        }

                    </div>
                        
                    <div className="w-full self-center overflow-y-auto max-h-[20vh] ">
                    {links.length !== 0 && <h3 className="font-semibold  text-blue-950 ">Included Links:</h3>}
                        {links.map((item, index) => <IncludedLinks
                            status={item.status}
                            linkVal={item.link}
                            editVal={handleUpdate}
                            removeVal={handleRemove}
                            numChars={item.chars}
                            placeholder={item.link === '' ? 'https://www.example.com' : ''}
                            input={true}
                            key={index}
                            id={item.id}
                        />)}
                    </div>

                    {showProgress === true && <div className="w-7/12 self-center">
                        <p className={" mt-4  font-semibold opacity-80 " + messageColor}>{message}</p>
                        <LinearProgress sx={progressBarStyle} variant="determinate" value={progress} />
                    </div>}
                </div>
                <RetrainBot sources={sources} retrainbot={sendLinks} buttonText={buttonText} />
            </div>
        </>
    )
}