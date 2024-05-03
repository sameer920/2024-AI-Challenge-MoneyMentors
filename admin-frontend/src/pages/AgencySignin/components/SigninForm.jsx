
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import serverBasePath from "../../sharedComponents/imports";
function SignInForm() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: ""
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
    console.log(user)
    fetch(serverBasePath + '/auth/login/user', {
      method: "POST",
      headers: new Headers({ 'content-type': 'application/json', 'Accept': 'application/json' }),
      mode: "cors",
      body: JSON.stringify({
        email: user.email,
        password: user.password
      }),
      credentials: "include"
    })
      .then((response) => {

        response.json().then((data) => {
          console.log(data)
          navigate(data.response);
        })
      })
      .catch(err => console.log(err))


    // for (const key in user) {
    //   setUser({
    //     ...user,
    //     [key]: ""
    //   });
    // }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Sign in</h1>

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={user.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
        />
        <a href="#">Forgot your password?</a>
        <button type='submit'>Sign In</button>
      </form>
    </div>
  );
}

export default SignInForm;
