import { Box, Button, Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import serverBasePath from "../../sharedComponents/imports";

export default function ReviewAnswerModal(props) {

    const [resMessage, setResMessage] = useState('');   //Used to change the contents of the response returned by the user.

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        // width: '35%',
        borderRadius: 2,
        boxShadow: 24,
        margin: 'auto',
        p: 4,
    };

    function addPredefinedMessage(message) {
        fetch(serverBasePath + '/addQuestions', {
            method: "POST",
            headers: new Headers({ 'content-type': 'application/json', 'Accept': 'application/json' }),
            mode: "cors",
            body: JSON.stringify(message),
            credentials: "include"
        })
            .then((response) => {
                response.json().then((data) => setResMessage(data.response))
            })
            .catch(err => console.log(err))
        setTimeout(()=>setResMessage(''), 7000);
    }



    return (
        <div>
            {/* <Button onClick={() => { toggleEditor(true) }}>Open modal</Button> */}
            <Modal
                open={props.edit}
                onClose={() => props.toggleEditor(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="bg-white dark:bg-gray-800 mt-2 w-full lg:w-[35%]">
                    <Typography id="modal-modal-title" variant="h6" component="h2" className="font-bold text-sm dark:text-white">
                        Revise answer
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }} className="text-gray-500 dark:text-gray-300">
                        User Message
                    </Typography>
                    <textarea rows='3'
                        className="p-2 resize-none rounded mt-1.5 w-full focus:outline-blue-600 border-gray-400 border overflow-y-auto"
                        value={props.message.userMessage}
                        onChange={(evt) => props.setMessage('userMessage', evt.target.value)}
                    />

                    {/* Bot Response  */}
                    <Typography id="modal-modal-description" sx={{ mt: 2 }} className="text-gray-500 dark:text-gray-300">
                        Chatbot Response
                    </Typography>
                    <textarea rows='8'
                        className="p-2 resize-none rounded mt-1.5 w-full focus:outline-blue-600 border-gray-300 border overflow-y-auto"
                        value={props.message.botResponse}
                        onChange={(evt) => props.setMessage('botResponse', evt.target.value)}
                    />

                    <div className="flex justify-end mt-2 w-full">
                        <button className="p-2 rounded-md mt-2 mr-3 hover:bg-blue-600 hover:text-white hover:border-blue-600 border-blue-800 border text-blue-800 w-1/3 dark:border-white dark:text-white"
                            onClick={() => props.toggleEditor(false)}
                        >Cancel</button>
                        <button className="p-2 rounded-md mt-2 bg-blue-800 hover:bg-blue-600 text-white w-1/3"
                            onClick={() => { addPredefinedMessage({ QA: [{ question: props.message.userMessage, answer: props.message.botResponse }] }) }}
                        >Update Chatbot</button>
                    </div>
                    {resMessage !== '' && <p className="font-bold text-blue-600 dark:text-white">{resMessage}</p>}
                </Box>
            </Modal>

        </div>);
}