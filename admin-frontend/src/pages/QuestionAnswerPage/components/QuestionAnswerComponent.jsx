import { AiOutlineDelete } from 'react-icons/ai';
import { TableCell, TableRow, IconButton, TextareaAutosize, CircularProgress } from '@mui/material';

export default function QuestionAnswerComponent(props) {
    return (
        <TableRow className="hover:bg-gray-50 transition-colors duration-200 ease-in-out">
            <TableCell className="border-t border-gray-200 px-4 py-2 text-center">
                {props.serialNumber + 1} {/* Displaying the index. Adding 1 because array indices start at 0 */}
            </TableCell>
            <TableCell className="border-t border-gray-200 px-4 py-2">
                <TextareaAutosize
                    name="question"
                    placeholder='Enter Question Here'
                    rowsMin={3}
                    className="w-full px-3 py-1 border-gray-300 border rounded-md focus:outline-none focus:border-blue-900"
                    value={props.question}
                    onChange={(event) => { props.setQuestion(props.id, event.target.value) }}
                />
            </TableCell>
            <TableCell className="border-t border-gray-200 px-4 py-2">
                <TextareaAutosize
                    name="answer"
                    placeholder='Enter Answer Here'
                    rowsMin={7}
                    className="w-full px-3 py-1 border-gray-300 border rounded-md focus:outline-none focus:border-blue-900"
                    value={props.answer}
                    onChange={(event) => { props.setAnswer(props.id, event.target.value) }}
                />
            </TableCell>
            <TableCell className="border-t border-gray-200 px-4 py-2 text-center">
                <IconButton onClick={() => props.deleteQuestion(props.id)} size="small">

                    {
                        
                        props.clicked !== props.id ?
                            <AiOutlineDelete className="text-red-600" size={18} /> :
                            <CircularProgress sx={{ color: 'gray', marginTop: '1px', }} size={17} />
                    }
                </IconButton>
            </TableCell>
        </TableRow>
    );
}