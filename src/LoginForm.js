// src/LoginForm.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Use 'useNavigate' from 'react-router-dom'
import { useAuth } from './AuthContext';


const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();  // Use 'useNavigate' from 'react-router-dom'
    console.log("login Rendered");
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/login', { username, password, role: selectedRole });
            login(response.data.token, response.data.role,username,password);
            navigate('/dashboard');  // Use 'navigate' instead of 'history.push'
            console.log(response.data)
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <div className='bg'>
        <div className='container'>
       <div className='header'>
       <div className="text">                      
       <center><h2>LOGIN</h2></center>                
                        </div>
                         </div>
            <center>               
            <form onSubmit={handleSubmit} >
                <label>
            <div className="names">       
            Username:
                </div> 
                <div className="inputs">       
            <div className="input">                    
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    </div>
                </label>
                <br />
                <label>
                <div className="names">       
                Password:
                </div> 
                <div className="inputs">
            <div className="input">    
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    </div>
                </label>
                <br />
                <label>            
                    Select Role:
                    <div className="custom-select">
                    <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                       
                        <option value="admin">Admin</option>
                        <option value="faculty">Faculty</option>
                        <option value="student">Student</option>
                    </select>
                   </div>
                 
                </label>
                <br />
                <div className="login">
                <button type="submit">Login</button>
                </div>
            </form>
           
            </center>
        </div>
        </div>
    );
};

export default LoginForm;
