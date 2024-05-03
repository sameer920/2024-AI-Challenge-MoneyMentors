import React from "react";
import Header from "../sharedComponents/Header";
import { AiOutlineGoogle } from 'react-icons/ai';
import serverBasePath from "../sharedComponents/imports";
import { useNavigate } from "react-router-dom";

export default function Login(props) {
    const navigate = useNavigate();

    function authencticateWithGoogle() {
        window.open(serverBasePath + '/auth/login/google', '_self')
    }

    return (
        <div>
            <Header />
            <div className="m-auto text-center w-11/12 flex-col justify-center  flex items-center mt-[15%] ">
                <h1 className="text-gray-950 text-3xl font-semibold m-3 h-10">Your Custom ChatBot Is Just A Few Clicks Away!</h1>
                <p className="text-xl m-4 text-gray-800">Register or Sign in by clicking the button below</p>
                <button
                    className=" p-4 m-4 bg-blue-600 max-w-3xl text-lg hover:bg-blue-700 rounded-md text-white font-semibold"
                    onClick={authencticateWithGoogle}>
                    <AiOutlineGoogle className="inline mr-2 my-auto" size={30} color="white" />
                    Login with google
                </button>
                <div className="flex w-[97%] items-center text-center self-center justify-items-center my-7">
                    <hr className="flex-1 border-gray-400" />
                    <span className="px-3">OR</span>
                    <hr className="flex-1 border-gray-400" />
                </div>
                <p className="text-2xl m-4 text-gray-800 h-12">Register or sign in to your agency account</p>
                <button
                    className=" p-4 px-16 m-4 bg-blue-600 max-w-3xl text-2xl hover:bg-blue-700 rounded-md text-white font-semibold"
                    onClick={()=>{navigate('/user/login')}}>
                    Sign in
                </button>
            </div>
        </div>
    )
}