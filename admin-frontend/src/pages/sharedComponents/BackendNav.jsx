import { Outlet, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import SideBar from "./SideBar";
import { useEffect, useState } from "react";
import serverBasePath from "./imports";

export default function BackendNav(props) {

    const [name, setName] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetch(serverBasePath + '/auth//isAuthenticated', {
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

        console.log(id)
        if (id !== undefined) {
            fetch(serverBasePath + `/getName/${id}`, {
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
                            setName(data.name);
                        })

                })
                .catch(err => console.log(err))
        }

    }, [])

    return (
        <>
             <div>
            <Header />
            <div>
                <div className="sm:mt-[68px] mt-[74px] w-[20vw]">
                    <SideBar />
                </div>
                <div className="mt-2 w-[80vw] ml-[18vw]">
                    <div className="flex flex-col w-full justify-center items-center">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}