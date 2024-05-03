import { useEffect, useState } from "react";
import logo from "../../images/logo.svg"
import { Link } from "react-router-dom";
import serverBasePath from "./imports";

function Header(props) {
    const [headerOpen, toggleHeader] = useState(false);
    const [role, setRole] = useState('user');


    function closeHeader() {
        toggleHeader(false);
    }
    return (
        <nav className="bg-white fixed w-full top-0 shadow-md border-gray-300 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between  p-4">
                <div>
                    <a href='' className="flex items-center">
                        <img src={logo} className="h-8 mr-3" alt="chatapp Logo" />
                        <span className="self-center text-xl sm:text-2xl font-semibold whitespace-nowrap dark:text-white">Chat App</span>
                    </a>
                </div>
                <div className="flex items-center justify-center md:order-2">
                    <Link to={'/myaccount'}>
                        <button type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm  px-2 sm:px-4 py-2 sm:py-2 text-center sm:mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            My Account
                        </button>
                    </Link>
                    <button data-collapse-toggle="navbar-cta" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-cta"
                        aria-expanded="false"
                        onClick={() => toggleHeader(!headerOpen)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
                <div className={headerOpen ? "block w-full" : "hidden lg:flex items-center justify-between w-full lg:w-auto lg:order-1"} id="navbar-cta">
                    <ul className="flex flex-col font-medium p-4 lg:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 lg:flex-row lg:space-x-8 lg:mt-0 lg:border-0 lg:bg-white dark:bg-gray-800 lg:dark:bg-gray-900 dark:border-gray-700">
                        <li onClick={closeHeader}>
                            <a href="#" className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded lg:bg-transparent lg:text-blue-700 lg:p-0 lg:dark:text-blue-500" aria-current="page">Demo</a>
                        </li>
                        <li onClick={closeHeader}>
                            <a href="#" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:hover:text-blue-700 lg:p-0 lg:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Affiliate</a>
                        </li>
                        <li onClick={closeHeader}>
                            <a href="#" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:hover:text-blue-700 lg:p-0 lg:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Pricing</a>
                        </li>
                        <li onClick={closeHeader}>
                            <a href="#" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:hover:text-blue-700 lg:p-0 lg:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">API</a>
                        </li>
                        <li onClick={closeHeader}>
                            <a href="#" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:hover:text-blue-700 lg:p-0 lg:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Guide</a>
                        </li>


                        <li onClick={closeHeader}>
                            <Link to={role === 'agency' ? '/agency/Dashboard' : '/backend/myChatbots'}
                                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:hover:text-blue-700 lg:p-0 lg:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                            >My Chatbots
                            </Link>
                        </li>

                        <li onClick={closeHeader}>
                            <Link to={'/Access-Control'}
                                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:hover:text-blue-700 lg:p-0 lg:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                            >
                                Access Control
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    )
}

export default Header;