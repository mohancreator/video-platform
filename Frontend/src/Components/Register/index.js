import './index.css'
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import Axios from 'axios';

class Register extends Component {
    state = {
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        errMsg: "",
        registrationSuccessful: false
    };

    submitData = async () => {
        const { username, password, email, name } = this.state;
        try {
            const response = await Axios.post('http://localhost:8001/register', {name, username, password, email });
            const { message } = response.data;

            this.setState({ errMsg: message, registrationSuccessful: true });
        } catch (err) {
            this.setState({ errMsg: "Database Error: Could not register" });
        }
    };

    onSubmitForm = (event) => {
        event.preventDefault();
        const {name, username, password, email, confirmPassword } = this.state;
        if(!name){
            this.setState({errMsg: "Enter Name"})
        }
        else if (!username) {
            this.setState({ errMsg: "Enter Username" });
        } else if (!email) {
            this.setState({ errMsg: "Enter Email" });
        } else if (password !== confirmPassword) {
            this.setState({ errMsg: "Password and Confirm Password don't match" });
        } else if (!password || password.length < 6) {
            this.setState({ errMsg: "Password must be at least 6 characters" });
        } else {
            this.submitData();
        }
    };

    setName =(event) => {
        this.setState({name: event.target.value})
    }

    setUsername = (event) => {
        this.setState({ username: event.target.value });
    };

    setEmail = (event) => {
        this.setState({ email: event.target.value });
    };

    setPassword = (event) => {
        this.setState({ password: event.target.value });
    };

    setConfirmPassword = (event) => {
        this.setState({ confirmPassword: event.target.value });
    };

    render() {
        const { errMsg, registrationSuccessful } = this.state;
        const jwt = Cookies.get('jwt_token')
        if(jwt) return <Navigate to='/'/>
        if (registrationSuccessful) return <Navigate to="/login" />;

        return (
            <div className="register-container">
                <div className='register-form-container'>
                <h1>REGISTER</h1>
                <form className='form-container-register' onSubmit={this.onSubmitForm}>                    
                    <div className="inner-register-containers">
                        <label htmlFor="username">Name</label>
                        <input onChange={this.setName} type="text" id="username" placeholder="Name" required />
                    </div>
                    <div className="inner-register-containers">
                        <label htmlFor="username">Username</label>
                        <input onChange={this.setUsername} type="text" id="username" placeholder="Username" required />
                    </div>
                    <div className="inner-register-containers">
                        <label htmlFor="email">Email</label>
                        <input onChange={this.setEmail} type="email" id="email" placeholder="Email" required />
                    </div>
                    <div className="inner-register-containers">
                        <label htmlFor="password">Password</label>
                        <input onChange={this.setPassword} type="password" id="password" placeholder="Password" required minLength="6" />
                    </div>
                    <div className="inner-register-containers">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input onChange={this.setConfirmPassword} type="password" id="confirmPassword" placeholder="Confirm Password" required minLength="6" />
                    </div>
                    <button className='register-button' type="submit">Register</button>
                    {errMsg && <p className="err">{errMsg}</p>}
                </form>
                <Link className='link-item' to='/login'><p>I have account</p></Link>
                </div>
            </div>
        );
    }
}

export default Register;
