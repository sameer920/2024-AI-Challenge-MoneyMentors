import React from "react";
import { AiOutlineDelete } from 'react-icons/ai'

export default function IncludedLinks(props) {
    /*
    PROPS:
    status: String | controls showing of trained tag
    linkVal: String | to show in the input field
    editVal: function | allows you to change the value of the linkVal var and handle it's state
    numChars: Number | shows the number of characters in the file or page
    removeVal: function | function to call on the delete button
    input: boolean | controls whether input is allowed or not.
    
    */



    return (
        <div className="flex w-full p-2 mt-2  items-center justify-items-end">
            {props.status !== '' && props.status !== undefined && <span className="text-green-700 p-1 text-sm rounded-md bg-green-100 border border-green-300">{props.status}</span>}

            {props.input === true && <input type="text"
                name="link"
                id=""
                value={props.linkVal}
                placeholder={props.placeholder}
                onChange={(event) => { props.editVal(props.linkVal, event.target.value) }}
                className="ml-2 border py-1 px-3 rounded-md border-gray-400 w-11/12 text-sm" />}

            {props.input === false &&
                <p className="ml-2 border py-1 px-3 rounded-md border-gray-400 w-11/12 text-sm text-left overflow-x-auto">{props.linkVal}</p>
            }

            <span className="ml-2">{props.numChars}</span>
            <button className="ml-2" onClick={() => { props.removeVal( props.id) }}><AiOutlineDelete className='text-red-500' /></button>
        </div>
    )
}