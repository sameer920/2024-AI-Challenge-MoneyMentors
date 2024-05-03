import { useEffect, useState } from 'react';
import AccountName from './components/AccountName';
import serverBasePath from '../sharedComponents/imports';
import Header from '../sharedComponents/Header';


export default function AgencyPageUser() {
    const [accountsWithAccess, setAccountsWithAccess] = useState([]);
    const [email, setEmail] = useState('');

    useEffect(() => {
        fetch(serverBasePath + '/user/my-agencies', {
            method: "GET",
            headers: new Headers({
                'content-type': 'application/json',
                'Accept': 'application/json',
            }),
            mode: "cors",
            credentials: "include",
        })
            .then((response) => {
                response.json()
                    .then(data => {
                        setAccountsWithAccess(data.agencies);
                    })

            })
            .catch(err => console.log(err))
    }, []);

    function removeAccount(email) {
        fetch(serverBasePath + '/user/remove-agency', {
            method: "POST",
            headers: new Headers({
                'content-type': 'application/json',
                'Accept': 'application/json',
            }),
            body: JSON.stringify({
                email: email,
            }),
            mode: "cors",
            credentials: "include",
        })
            .then((response) => {
                response.json()
                    .then(data => {
                        console.log(data.agencies)
                        setAccountsWithAccess(data.agencies);
                    })

            })
            .catch(err => console.log(err))
    }

    function addAgency() {
        console.log('called')
        fetch(serverBasePath + '/user/add-agency', {
            method: "POST",
            headers: new Headers({
                'content-type': 'application/json',
                'Accept': 'application/json',
            }),
            body: JSON.stringify({
                email: email,
            }),
            mode: "cors",
            credentials: "include",
        })
            .then((response) => {
                response.json()
                    .then(data => {
                        console.log(data)
                    })

            })
            .catch(err => console.log(err))
    }

    return (
        <>
            <Header />
            <div className="p-[5%] mx-auto h-full">

                <div className='flex justify-center items-center mt-14 sm:mt-4'>
                    <h2 className='text-2xl sm:text-4xl overflow-y-hidden'>Allow agencies to access my account</h2>
                </div>
                <div className="flex mt-[8%] lg:h-1/2 flex-col lg:flex-row item-center ">

                    <div className="my-3 mx-auto lg:m-auto p-[4%] h-full rounded-lg border md:w-1/2 border-gray-300 text-left bg-gray-800 ">
                        <h3 className="font-semibold overflow-y-hidden text-2xl sm:text-4xl mx-2 mt-1 mb-10 text-white">Agencies who can access my account</h3>
                        {
                            accountsWithAccess.map((email, index) => {
                                return <AccountName email={email} key={index} removeAccount={removeAccount} />
                            })
                        }
                    </div>
                    <div className="m-auto lg:mx-3 p-[2.5%] rounded-lg h-full text-left border border-gray-400 md:w-1/2   ">
                        <h3 className='font-semibold overflow-y-hidden text-2xl sm:text-4xl mt-9 mb-3'>Grant access to an agency</h3>
                        <p>Enter the email of the agency that you want to grant access to your account</p>

                        <input
                            type="email"
                            name="AgencyEmail"
                            id="AgencyEmail"
                            placeholder="someone@example.com"
                            className='border border-gray-400 p-2 w-full my-3'
                            value={email}
                            onChange={(evt) => { setEmail(evt.target.value) }}
                        />
                        <button type="submit" onClick={addAgency} className='p-2 bg-blue-500 text-white rounded text-lg'>Grant Access</button>
                    </div>
                </div>
            </div>
        </>

    )
}