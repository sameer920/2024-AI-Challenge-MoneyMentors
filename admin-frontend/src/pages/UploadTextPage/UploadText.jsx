import React, { useEffect, useState } from "react";
import RetrainBot from "../sharedComponents/RetrainBot";
import serverBasePath from "../sharedComponents/imports";
import { useParams } from "react-router-dom";

function UploadText(props) {
    const [text, setText] = useState('');
    const [loaded, setLoaded] = useState(false); //used to disbale the input field until data is loaded
    const [sources, setSources] = useState([]);
    const [buttonText, setButtonText] = useState('Retrain Chatbot');
    const {id} = useParams();

    function fetchData(){
        fetch(serverBasePath + '/train/text/'+id, {
            method: "GET",
            headers: new Headers({ 'content-type': 'application/json', 'Accept': 'application/json' }),
            mode: "cors",
            credentials: "include"
        })
            .then((response) => {
                response.json().then((data) => {
                    setText(data.data);
                    setSources(data.trainedData);
                    setLoaded(true);
                })
            })
            .catch(err => console.log(err))
    }

    useEffect(fetchData ,[]);

    function handleChange(event) {
        setText(event.target.value);
    }

    function sumbitText(event) {
        setButtonText('Retraining Chatbot...');
        event.preventDefault();
        fetch(serverBasePath + '/train/text', {
            method: "POST",
            headers: new Headers({ 'content-type': 'application/json', 'Accept': 'application/json' }),
            mode: "cors",
            body: JSON.stringify({ trainText: text, chatbotId: id }),
            credentials: "include"
        })
            .then((response) => {
                if (response.status === 200){
                    setButtonText('Retrain Chatbot');
                    fetchData();
                }
                else{
                    console.log('error');
                }
            })
            .catch(err => console.log(err))
        setText('')

    }

    return (
        <>
            <div className="mt-12 w-full sm:w-[50%] text-center">
                <h3 className=" text-blue-900 mb-10 text-xl font-semibold text-center">Add Text to train model</h3>
                <form className="h-full" onSubmit={sumbitText}>
                    <textarea name="trainText"
                        id=""
                        className="w-full h-40 p-5 border-slate-300 border-2 rounded"
                        placeholder={loaded ? "Add Data here to train the model" : 'Please wait while the data is being loaded'}
                        value={text}
                        onChange={handleChange}
                        disabled = {!loaded}
                        required
                    />
                    <RetrainBot sources={sources} retrainbot={sumbitText} buttonText={buttonText} />
                </form>
            </div>
        </>

    )
}

export default UploadText