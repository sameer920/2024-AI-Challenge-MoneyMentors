import React, { useState } from "react";
import IntegrationCard from "./components/IntegrationCard";
import { AiFillSlackCircle } from "react-icons/ai";
import { FaLaptopCode, FaFacebookMessenger } from 'react-icons/fa'
import EmbedModal from "./components/EmbedModal";
import { useParams } from "react-router-dom";

export default function IntegrationPage(props) {

    const {id} = useParams();
    const [embedPopup, togglePopup] = useState(false);

    function openEmbedModal() {
        console.log('called')
        togglePopup(true)
    }

    return (
        <div>
            <div className="text-center flex sm:ml-[20vw] mt-10">
                <div className="flex flex-col max-w-xl mx-auto">
                    <h4 className="font-light text-xl">Click to integrate your chatbot</h4>
                    <button><IntegrationCard icon={<FaLaptopCode className="inline" size={'2rem'} />} text='Website' onClick={openEmbedModal} /></button>
                    {embedPopup && <EmbedModal edit={embedPopup} togglePopup={togglePopup} chatbotId={id} />}

                    <button><IntegrationCard icon={<AiFillSlackCircle className="inline" size={'2.2rem'} />} text='Slack' details='coming soon' onClick={() => { }} /></button>

                    <button><IntegrationCard icon={<FaFacebookMessenger className="inline" size={'2rem'} />} text='Messenger' details='coming soon' onClick={() => { }} /></button>
                </div>
            </div>
        </div>

    )
}