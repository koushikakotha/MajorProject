import React, { useEffect, useState } from "react";
import axios from "axios" //npm install axios --save 
import {Link} from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import './style.css';
import './menu.css';
import Admin from "./Admin";
export default function AutomatePage(){
  
    const [inputs, setInputs] = useState('');
    const [inputs1, setInputs1] = useState('');
    const [selectedOption1, setSelectedOption1] = useState('A');

    const [users, setUsers] = useState([]);
    useEffect(() => {
        getUsers(selectedOption1);
    }, [selectedOption1]);
  

    const getUsers = async (value) => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/listautomatebatch/${value}`);
        setUsers(response.data || []);
        //console.log(value)
        //console.log(response);
        
        // Other dropdowns or options handling
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };


    const navigate = useNavigate();

    const handleChange = (event) => {
        
        
        setInputs(event.target.value);
    }

    const handleselectChange = (event) => {
        
        
        setInputs1(event.target.value);
        setSelectedOption1(event.target.value);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
    
        axios.post('http://127.0.0.1:5000/api/automate', {inputs,inputs1}).then(function(response){
            console.log(response.data);
            navigate('/');
        });
          
    }

    const deleteUser = (id) => {
        axios.delete(`http://127.0.0.1:5000/api/batchdelete/${id}`).then(function(response){
            console.log(response.data);
            getUsers();
        });
    }


    return (
    <div>
        
        <div className="automate-bat">
            <div className="row h-100">
                <div className="col-12">
                <center>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                          <label>Number of Groups</label>
                          <input type="text" className="form-control" name="title" 
                          onChange={handleChange} />
                        </div>

                        <div className="mb-3">
                      
                      <label for="section">Choose a section:</label>
                      <select name="section"  onChange={handleselectChange}>
                      <option></option>
                        <option value="a">A</option>
                        <option value="b">B</option>
                        <option value="c">C</option>
                        
                        </select>
                      
                    </div>
                   

                    <button type="submit" name="add" className="btn btn-primary">Save</button>
                    <div className="table-aut">
                    <table class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>batch No</th>
                                
                                <th>Section</th>
                                <th>GuideName</th>  
                                <th>Action</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, key) =>
                                <tr key={key}>
                                    

                                    <td>{user.batchid}</td>
                                    
                                    <td>{user.section}</td>
                                    <td>{user.guidename}</td>
                                    <td>
                                        <Link to={`user/${user.batchid}/${user.section}/editbatch`} className="btn btn-success" style={{marginRight: "10px"}}>Edit</Link>
                                        <button onClick={() => deleteUser(user.batchid)} className="btn btn-danger">Delete</button>
                                        
                                    </td>
                                </tr>)}

                          </tbody>
                        </table>
                        </div>
                    
                </form>
                </center>
                
                </div>
            </div>
        </div>
    </div>
  );
}
