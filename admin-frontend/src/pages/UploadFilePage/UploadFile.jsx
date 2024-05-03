import React, { useState } from "react";
import RetrainBot from "../sharedComponents/RetrainBot";
import FileUploader from "./components/FileUploader";
import { useParams } from "react-router-dom";
import serverBasePath from "../sharedComponents/imports";
import IncludedLinks from "../sharedComponents/IncludedLinks";
import axios from 'axios';
import { LinearProgress } from "@mui/material";

function UploadFiles(props) {

    const [files, setFiles] = useState([]);
    const [showProgress, setShowProgress] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);
    const [message, setMessage] = useState('Uploading...');
    const [messageColor, setMessageColor] = useState('text-blue-800');
    const [sources, setSources] = useState([])
    const [buttonText, setButtonText] = useState('Retrain Chatbot');
    const { id } = useParams();

    const progressBarStyle = {
        marginTop: '2.5%',
        height: 7,
        borderRadius: 10,
        width: '100%'
    }

    function fetchFiles() {
        axios.get(`${serverBasePath}/train/files/${id}`, {
            withCredentials: true,
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json'
            },
        })
            .then(response => {
                addFiles(response.data.files);
                setSources(response.data.trainedData);
            })
            .catch(error => {
                console.log('error fetching uploaded files: ', error);
            });
    }

    function sendFiles() {
        setButtonText('Retraining Chatbot...');
        const formData = new FormData();
        files.forEach(file => {
            if (file.status === undefined) {
                formData.append('file', file);
            }
        });
        formData.append('id', id);

        let config = {
            onUploadProgress: function (progressEvent) {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                setProgressPercent(percentCompleted);
            },
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        setShowProgress(true);
        axios.post(serverBasePath + '/train/files', formData, config)
            .then(response => {

                setMessage(response.data.response);
                if (response.status === 200) {
                    setButtonText('Retrain Chatbot')
                    setMessageColor('text-green-800');
                }
                else if (response.status === 400) {
                    setMessageColor('text-red-800');
                }

                setFiles([]);
                fetchFiles();
                setTimeout(() => {
                    setShowProgress(false);
                    setMessage('Uploading...');
                    setProgressPercent(0);
                    setMessageColor('text-blue-800');
                }, 10000);
            })
            .catch(err => console.log("Error in upload: ", err));

    }

    function addFiles(newFiles) {
        newFiles.map((file, index) => {
            if (file.id === undefined) {
                file.id = index;
            }
        })
        setFiles(prevFiles => [...prevFiles, ...newFiles])
    }

    useState(fetchFiles, [])

    function removeFile(id) {
        //handle removing of saved file doc here
        setFiles(prevArray => prevArray.filter(file => file.id !== id))
    }



    return (
        <>
            <div className=" p-4 text-center ">
                <h3 className=" text-blue-900 mb-10 text-xl font-semibold text-center">Upload Files</h3>
                <div className="flex flex-col justify-center w-full items-center mx-auto">
                    <FileUploader files={files} setFiles={addFiles} />

                    <div className='text-left p-2 mt-6 '>

                        {files.length > 0 && <h3 className='font-semibold mb-2'>Uploaded files</h3>}

                        <div className="max-h-[15vh] overflow-y-auto">

                            {files.length > 0 && files.map((file, index) =>

                                <IncludedLinks
                                    linkVal={file.name}
                                    key={index}
                                    numChars={file.chars}
                                    input={false}
                                    status={file.status}
                                    id={file.id}
                                    removeVal={removeFile}
                                />
                            )}

                        </div>

                        {showProgress === true && <div>
                            <p className={"mt-4 text-center font-semibold opacity-80 " + messageColor}>{message}</p>
                            <LinearProgress sx={progressBarStyle} variant="determinate" value={progressPercent} />
                        </div>}

                    </div>

                </div>

                <RetrainBot sources={sources} retrainbot={sendFiles} buttonText={buttonText}/>
            </div>
        </>

    )
}

export default UploadFiles