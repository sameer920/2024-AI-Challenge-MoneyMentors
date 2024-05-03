import { Outlet, useNavigate } from "react-router-dom";
import Header from "../../sharedComponents/Header";
import NewChatbotSideBar from "./NewChatbotSidebar";
import { useEffect, useState } from "react";
import serverBasePath from "../../sharedComponents/imports";

export default function NewChatbotNav(props) {

    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(serverBasePath + '/isAuthenticated', {
            method: "GET",
            headers: new Headers({
                'content-type': 'application/json',
                'Accept': 'application/json',
            }),
            mode: "cors",
            credentials: "include"
        })
            .then((response) => {
                response.json()
                    .then(data => {
                        if (data.authenticated === false) {
                            navigate('/login')
                        }
                    })

            })
            .catch(err => console.log(err))

    }, [])

    return (
        <>
            <Header />
            <NewChatbotSideBar />
            <div className="mt-20 lg:ml-64"></div>
            <Outlet />
        </>
    )
}