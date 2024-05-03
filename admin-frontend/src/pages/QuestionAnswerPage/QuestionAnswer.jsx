import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import QuestionAnswerComponent from "./components/QuestionAnswerComponent";
import RetrainBot from "../sharedComponents/RetrainBot";
import serverBasePath from "../sharedComponents/imports";
import { AiOutlineDelete } from 'react-icons/ai'
import axios from "axios";

export default function QuestionAnswer(props) {
    const { id } = useParams();
    // const [QA, setQA] = useState([{ question: '', answer: '', id: 0 }]);
    const [QA, setQA] = useState([]);
    const [sources, setSources] = useState([])
    const [buttonText, setButtonText] = useState('Retrain Chatbot');
    const [loaded, setLoaded] = useState(false);
    const [clicked, setClicked] = useState('');

    function addNew() {
        setQA(prev => [...prev, { question: '', answer: '', id: prev.length, new: true }])
    }

    function clearAll() {
        setQA([]);
    }

    function handleQuestionVal(id, val) {
        const questions = [...QA];
        questions[id].question = val;
        setQA(questions);
    }
    function handleAnswerVal(id, val) {
        const questions = [...QA];
        questions[id].answer = val;
        setQA(questions);
    }

    function deleteQuestion(itemId) {
        setClicked(itemId);
        const QAToRemove = QA.filter(question => question.id === id);
        if (QAToRemove.new !== true) {
            axios.delete(`${serverBasePath}/train//deleteQuestions`, {
                params: {
                    itemId: itemId,
                    chatbotId: id
                },
                withCredentials: true
            })
                .then(function (response) {
                    if (response.status === 200) {
                        getQuestions();
                        setClicked('');
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        setQA(prev => prev.filter(item => item.id !== id));
    }

    function sendQuestions() {
        if (QA.length === 0) {
            return;
        }
        const questions = QA.filter(question => question.new === true && question.question !== undefined && question.question !== '');
        setButtonText('Retraining Chatbot...')
        axios.post(serverBasePath + '/train/addQuestions', { QA: questions, chatbotId: id }, {
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true
        })
            .then(response => {
                // setResponse(true);
                // setResMessage(response.data.response);
                if (response.status === 200) {
                    getQuestions();
                    setButtonText('Retrain Chatbot');
                }
                else {
                    setButtonText('There was an error while training');
                    setTimeout(setButtonText('Retrain Chatbot'), 5000);
                }
            })
            .catch(err => console.log(err))
    }

    function getQuestions() {
        setLoaded(false);
        axios.get(`${serverBasePath}/train/QuestionAnswers/${id}`, {
            withCredentials: true,
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json'
            },
        })
            .then(response => {
                setQA(response.data.questionAnswers);
                setSources(response.data.trainedData);
                setLoaded(true);
            })
            .catch(error => {
                console.log('error fetching uploaded files: ', error);
            });
    }

    useEffect(getQuestions, []);

    return (
        <div className="lg:ml-64 p-4 text-center mt-7 h-screen flex flex-col ">
            <h3 className=" text-blue-900 mb-2 text-xl font-semibold text-center ">Define Question and Answers Here</h3>

            <div className="grid-cols-2 grid grid-rows-1">

                <button
                    className="text-white bg-blue-700 hover:bg-blue-800 
                    font-medium rounded-lg px-4 py-2 text-center dark:bg-blue-600
                    dark:hover:bg-blue-700 dark:focus:ring-blue-800 my-8 justify-self-start ml-[10.6vw]"
                    onClick={addNew}
                    disabled={!loaded}
                >
                    Add New
                </button>

                {
                    QA.length !== 0 &&
                    <button className="text-red-600 text-lg text-right my-8 justify-self-end  mr-[10.6vw] "
                        onClick={clearAll}
                    >
                        Delete All
                    </button>
                }

            </div>

            <Paper elevation={3} className="mt-4 mx-auto w-[93%] lg:w-3/4 overflow-hidden rounded-lg">
                <Table>
                    <TableHead>
                        <TableRow className="bg-blue-200">
                            <TableCell className="px-2 py-2 font-semibold">ID</TableCell>
                            <TableCell className="px-4 py-2 font-semibold">Question</TableCell>
                            <TableCell className="px-4 py-2 font-semibold">Answer</TableCell>
                            <TableCell className="px-4 py-2 font-semibold">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            QA.map((question, index) => {
                                return <QuestionAnswerComponent
                                    question={question.question}
                                    answer={question.answer}
                                    setQuestion={handleQuestionVal}
                                    setAnswer={handleAnswerVal}
                                    serialNumber={index}
                                    id={question.id}
                                    key={index}
                                    deleteQuestion={deleteQuestion}
                                    clicked={clicked}
                                />
                            })
                        }
                    </TableBody>
                </Table>
            </Paper>

            <RetrainBot sources={sources} retrainbot={sendQuestions} buttonText={buttonText} />


        </div>
    )
}