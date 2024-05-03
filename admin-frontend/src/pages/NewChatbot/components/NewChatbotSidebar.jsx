import { useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function NewChatbotSideBar(props) {
    const { id } = useParams();
    const [currentPage, setCurrentPage] = useState('Files');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLinkClick = (page) => {
        setSidebarOpen(false);
        setCurrentPage(page)
    };
    let sideBarClasses = `fixed top-16 left-0 w-64 h-screen overflow-y-auto transition-transform duration-200 ease-in-out 
    ${sidebarOpen ? "translate-x-0 ease-out" : "-translate-x-full ease-in"}
    lg:translate-x-0 lg:transition-none lg:overflow-visible`

    return (
        <>
            <button aria-controls="default-sidebar"
                type="button"
                className="inline-flex left-0 absolute p-2 mt-2 ml-3 text-sm  text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >

                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>

            <aside id="default-sidebar" className={sideBarClasses} aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">

                        <li className={currentPage === 'Files' ? "bg-slate-500 rounded" : ""}>
                            <Link
                                to={'/new/sources/files/' + id}
                                className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                onClick={() => handleLinkClick('Files')}
                            >Files</Link>
                        </li>

                        <li className={currentPage === 'Text' ? "bg-slate-500 rounded" : ""}>
                            <Link to={'/new/sources/text/' + id}
                                className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                onClick={() => handleLinkClick('Text')}
                            >Text</Link>
                        </li>

                        <li className={currentPage === 'Website' ? "bg-slate-500 rounded" : ""}>
                            <Link to={'/new/sources/website/' + id}
                                className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                onClick={() => handleLinkClick('Website')}
                            >Website</Link>
                        </li>

                        <li className={currentPage === 'Q&A' ? "bg-slate-500 rounded" : ""}>
                            <Link to={'/new/sources/questionAnswers/' + id}
                                className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                onClick={() => handleLinkClick('Q&A')}
                            >Q&A</Link>
                        </li>
                    </ul>
                </div>
            </aside>

        </>
    );


}