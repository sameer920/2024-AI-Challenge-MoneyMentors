import { AiFillDelete } from 'react-icons/ai'

export default function AccountName(props) {
    /*
    props:
    email (String): email of the user you want to display
    removeAccount (function): Function to remove particular instance
    */


    return (
        <div className="flex mt-2 w-[85%]  items-center justify-between">
            <p className="font-light text-lg text-white mx-6">{props.email}</p>
            <button className="ml-2" onClick={() => { props.removeAccount(props.email) }}><AiFillDelete className='text-red-500' size={20} /></button>
        </div>
    )
}