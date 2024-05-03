import { Box, CircularProgress, Modal, TextareaAutosize, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import serverBasePath from "../sharedComponents/imports";
import { useNavigate, useParams } from "react-router-dom";

export default function DeleteModal(props) {

    const [validationMessage, setValidationMessage] = useState('');
    const validMessage = `I AM SURE I WANT TO DELETE THIS CHATBOT`;
    const [clicked, setClicked] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate()

    const style = {
        position: 'absolute',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
    };

    function deleteChatbot() {
        setClicked(true)
        fetch(serverBasePath + '/deleteBot', {
            method: "POST",
            headers: new Headers({
                'content-type': 'application/json',
                'Accept': 'application/json',
            }),
            mode: "cors",
            body: JSON.stringify({ chatbotId: id }),
            credentials: "include"
        })
            .then((response) => {
                if (response.status === 200) {

                    response.json()
                        .then(data => {
                            navigate(data.path);
                        })
                }
            })
            .catch(err => console.log(err))
    }

    return (<>
        <Modal
            open={props.show}
            onClose={() => props.toggleDelete(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style} className="bg-white dark:bg-gray-900 mt-2 w-full md:w-1/2 left-1/2">
                <Typography id="modal-modal-title" variant="h3" component="h2" className="font-bold text-sm dark:text-white">
                    Delete Chatbot
                </Typography>

                <Typography id="modal-modal-description" variant="h6" component="h6" sx={{ mt: 2 }} className="text-gray-500 dark:text-gray-300">
                    Are you sure you want to delete this chatbot? This action can not be undone.
                </Typography>

                <Typography id="modal-modal-description" variant="h6" component="h6" sx={{ mt: 2 }} className="text-gray-500 dark:text-gray-300">
                    Enter the following phrase at it is to continue.
                </Typography>
                <Typography id="modal-modal-description" variant="h6" component="h3" sx={{ mt: 2 }} className="text-gray-500 dark:text-gray-300">
                    {validMessage}
                </Typography>

                <TextareaAutosize
                    minRows={1}
                    maxRows={2}
                    className="p-2 resize-none rounded mt-3 w-full focus:outline-blue-600 border-gray-400 border overflow-y-auto"
                    value={validationMessage}
                    onChange={(evt) => setValidationMessage(evt.target.value)}
                />

                <div className="flex justify-end mt-2 w-full">
                    <button className="p-2 rounded-md mt-2 mr-3 hover:bg-blue-600 hover:text-white hover:border-blue-600 border-blue-800 border text-blue-800 w-1/3 dark:border-white dark:text-white"
                        onClick={() => { props.toggleDelete(false) }}
                    >Cancel</button>
                    <button className="p-2 rounded-md mt-2 bg-red-600 hover:bg-red-500 text-white w-1/3 disabled:opacity-50"
                        onClick={deleteChatbot}
                        disabled={validationMessage !== validMessage}
                    >Delete Chatbot  
                    {clicked && <CircularProgress sx={{'marginLeft': '10px', color:'white', marginTop: '1px', }} size={17}/>}
                    </button>
                </div>
            </Box>
        </Modal>
    </>)
}