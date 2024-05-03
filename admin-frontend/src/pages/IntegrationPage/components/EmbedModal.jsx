import { Box, Modal, Typography } from "@mui/material";
import React from "react";
import serverBasePath from "../../sharedComponents/imports";

export default function EmbedModal(props) {

    /* props:
    edit: (Boolean) state that controls the showing of modal
    togglePopup: (Function) controls the closing of the modal
    chatBotID: (string) unique id of each chatbot
    */

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50vw',
        transform: 'translate(-50%, -50%)',
        borderRadius: 2,
        boxShadow: 24,
        margin: 'auto',
        p: 4,
    };

    return (

        <div>
            <Modal
                open={props.edit}
                onClose={() => props.togglePopup(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="bg-white dark:bg-gray-800 mt-2 outline-none border-none">
                    <Typography id="modal-modal-title" variant="h6" component="h2" className="font-bold text-sm dark:text-white">
                        Embed On Website
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }} className="text-gray-500 dark:text-gray-300">
                        To embed a chatbubble on the bottom right of your website, add this script tag in your html
                    </Typography>
                    <div className="w-[98%] bg-gray-100 h-fit p-3 mt-3">

                        <p className="text-left font-mono text-gray-700 text-sm break-words">{`<script>`}</p>
                        <p className="text-left font-mono text-gray-700 text-sm ml-4 break-words">{`const chatbotId = '${props.chatbotId}';`}</p>
                        <p className="text-left font-mono text-gray-700 text-sm break-words">{`</script>`}</p>

                        <br />

                        <p className="text-left font-mono text-gray-700 text-sm break-words">{`<script `} </p>
                        <p className="text-left font-mono text-gray-700 text-sm ml-4 break-words">{`  src = '${serverBasePath}/embed.js' 
                        defer >`}</p>
                        <p className="text-left font-mono text-gray-700 text-sm break-words">{`</script>`}
                        </p>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}