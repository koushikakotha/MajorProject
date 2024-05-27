import React, { useState, useEffect  } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Admin from './Admin';
import './menu.css';
import './style.css'

export default function EditProject(){
  
    const navigate = useNavigate();
  
    const [inputs, setInputs] = useState([]);
    const [inputs1, setInputs1] = useState([])
    const {id,sec} = useParams('id');
    const [forceRender, setForceRender] = useState(false);
    
    useEffect(() => {
        getUser();
    }, []);
  
    function getUser() {
        axios.get(`http://127.0.0.1:5000/api/user/${id}/${sec}`).then(function(response) {
            console.log(response.data);
            //setInputs(response.data);
        });
    }
  

    const handleClick = () => {
      // Toggle forceRender to trigger a re-render
      setForceRender(prevState => !prevState);
    };
    
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
        console.log(inputs)
    }
    const handleSubmit = (event) => {
        event.preventDefault();
  
        axios.put(`http://127.0.0.1:5000/api/userupdate/${id}`, inputs).then(function(response){
            console.log(response.data);
            navigate('/');
        });
          
    }
    return (
        <div>
          
            <div className="edit-proj">
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-8">
                    <center><h1>Create Project</h1></center>
                    <center>
                    <form onSubmit={handleSubmit}>
                    
                        <div className="mb-3">
                          <label>Problem Title</label>
                          <input type="text" className="form-control" name="title" 
                          onChange={handleChange} />
                        </div>


                        <div className="mb-3">
                        <label>Category</label>
          <label>
            <input
              type="radio"
              name="category"
              value="software"
              
              onChange={handleChange}
            />
            SOFTWARE
          </label>
          <label>
            <input
              type="radio"
              name="category"
              value="hardware"
              
              onChange={handleChange}
            />
            hardware
          </label>
        </div>

                        <div className="mb-3">
                          <label>Domain Name</label>
                          <label for="domain">Choose a domain:</label>
                         
                          <select name="domain"  onChange={handleChange}>
                          <option></option>
                            <option value="Web Development">Web Development</option>
                            <option value="Machine Learning">Machine Learning</option>
                            <option value="Deep Learning">Deep Learning</option>
                            <option value="Cloud Computing">Cloud Computing</option>
                            <option value="Cyber Security">Cyber Security</option>
                            <option value="NLP">NLP</option>
                            <option value="Blockchain">Blockchain</option>
                            <option value="Android Development">Android Development</option>
                            <option value="Artificial Intelligence">Artificial Intelligence</option>
                            </select>
                          
                        </div>

                        <div className="mb-3">
                        
                          <label for="section">Choose a section:</label>
                          <select name="section"  onChange={handleChange}>
                          <option></option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            
                            </select>
                          
                        </div>

                        

                        

                        <button type="submit" name="add" className="btn btn-primary">Save</button>
                        <p>{inputs.name}</p>
                    </form></center>
                    
                    
                    </div>
                    <div className="col-2">
                      
                    </div>
                </div>
            </div>
        </div>
      );
    }

    