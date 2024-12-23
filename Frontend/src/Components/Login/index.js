import './index.css';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Axios from 'axios';

class Login extends Component {
    state = {
        emailorusername: "",
        password: "",
        errMsg: "",
        loggedIn: false
    };

    submitData = async () => {
        const { password, emailorusername } = this.state;
        try {
            const response = await Axios.post('http://localhost:8001/login', { emailorusername, password });
            console.log('Login Successful');
            const { token } = response.data;
            Cookies.set('jwt_token', token, { expires: 30 });
            this.setState({ loggedIn: true });
        } catch (err) {
            this.setState({ errMsg: "Login Failed: Invalid credentials or Database Error" });
        }
    };

    onSubmitForm = (event) => {
        event.preventDefault();
        const { password, emailorusername } = this.state;

        if (emailorusername && password) {
            this.submitData();
        } else {
            this.setState({ errMsg: 'Please enter valid Email and Password' });
        }
    };

    setEmailorUsername = (event) => {
        this.setState({ emailorusername: event.target.value });
    };

    setPassword = (event) => {
        this.setState({ password: event.target.value });
    };

    render() {
        const { errMsg, loggedIn } = this.state;
        const jwt = Cookies.get('jwt_token');

        if (jwt || loggedIn) return <Navigate to='/' />;
        
        return (
            <div className='login-container'>
                <div className='form-login-contaier'>
                <h1>LOGIN</h1>
                <form onSubmit={this.onSubmitForm}>
                    <div className='inner-containers'>
                        <label htmlFor='email'>Email or Username</label>
                        <input onChange={this.setEmailorUsername} type='text' id='email' placeholder='Email or Username' />
                    </div>
                    <div className='inner-containers'>
                        <label htmlFor='password'>Password</label>
                        <input onChange={this.setPassword} type='password' id='password' placeholder='Password' />
                    </div>
                    <button type='submit'>Login</button>
                    {errMsg && <p className='err'>{errMsg}</p>}
                </form>
                <Link className='link-item' to='/register'><p className='dontaccount'>Don't have an account? Sign up!</p></Link>
                </div>
            </div>
        );
    }
}

export default Login;
