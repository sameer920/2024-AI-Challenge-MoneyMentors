import { useState } from "react";
import { useNavigate } from "react-router-dom";
import serverBasePath from "../../sharedComponents/imports";

function SignUpForm() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });
    const handleChange = evt => {
        const value = evt.target.value;
        setUser({
            ...user,
            [evt.target.name]: value
        });
    };

    const handleOnSubmit = evt => {
        evt.preventDefault();

        fetch(serverBasePath + '/auth/register/user', {
            method: "POST",
            headers: new Headers({ 'content-type': 'application/json', 'Accept': 'application/json' }),
            mode: "cors",
            body: JSON.stringify({ email: user.email, 
                name: user.name,
                password: user.password,
             }),
            credentials: "include"
        })
            .then((response) => {

                response.json().then((data) => {
                    navigate(data.redirect);
                })
            })
            .catch(err => console.log(err))

        setUser({
            name: "",
            email: "",
            password: "",
        });
    };

    return (
        <div className="form-container sign-up-container">
            <form onSubmit={handleOnSubmit}>
                <h1 className="mb-2">Create Account</h1>

                <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    placeholder="Name"
                />
                <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    placeholder="Email"
                />
                <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    placeholder="Password"
                />
                <button className="mt-2">Sign Up</button>
            </form>
        </div>
    );
}

export default SignUpForm;
