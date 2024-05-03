import React from "react";
import Header from "../sharedComponents/Header";
import serverBasePath from "../sharedComponents/imports";
import { useNavigate } from "react-router-dom";

export default function Login(props) {
    const navigate = useNavigate();


    return (
        <div>
            <Header />
            <div className="m-auto text-center w-11/12 flex-col justify-center  flex items-center mt-[15%] ">
                <h1 className="text-gray-950 text-3xl font-semibold m-3 h-10">Login to add data to FinBuddy.</h1>

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