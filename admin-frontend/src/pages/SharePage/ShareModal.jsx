import { Box, Modal, Typography } from "@mui/material";
import React from "react";
import serverBasePath from "../sharedComponents/imports";
import { useParams } from "react-router-dom";

export default function ShareModal(props) {

    /* props:
    edit: (Boolean) state that controls the showing of modal
    togglePopup: (Function) controls the closing of the modal
    chatBotID: (string) unique id of each chatbot
    */

    const {id} = useParams();

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
                open={props.show}
                onClose={() => props.toggleShare(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="bg-white dark:bg-gray-800 mt-2 outline-none border-none w-full md:w-1/2">
                    <Typography id="modal-modal-title" variant="h6" component="h2" className="font-bold text-sm dark:text-white">
                        Share your Chatbot
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 1 }} className="text-gray-500 dark:text-gray-300">
                        Use this link to share your chatbot. Anyone with this link can access it.
                    </Typography>
                    <div className="w-[98%] bg-gray-100 h-fit p-3 mt-3">

                        <p className="text-left font-mono text-gray-700 text-sm break-words">{`${serverBasePath}/iframe/${id}`} </p>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}