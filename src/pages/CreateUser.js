import React, { useState ,useEffect } from "react";
//import { useMyContext } from "./MyContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './style.css'
import "./menu.css"
import Admin from "./Admin"; 
const CreateUser = () => {
/*
    const navigate = useNavigate();

    const [inputValue1, setInputValue1] = useState('');
   
    const [selectedOption, setSelectedOption] = useState('software');
    const [dropdownValue1, setDropdownValue1] = useState('Web Development');
    const [dropdownValue2, setDropdownValue2] = useState('A');

    
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await axios.post('http://127.0.0.1:5000/api/useradd', {
          
          inputValue1,
          dropdownValue1,
          selectedOption,
          
          dropdownValue2
        });
  
        if (response.status === 200) {
          console.log('Data sent successfully');
        } else {
          console.error('Failed to send data');
        }
      } catch (error) {
        console.error('Error sending data:', error);
      }
    };
*/

//const navigate = useNavigate();

//const { basename } = useMyContext(); 
  
const [inputs, setInputs] = useState([]);

const [selectedOption, setSelectedOption] = useState('');

const [dropdownValues, setDropdownValues] = useState([]);
const [dropdownValues1, setDropdownValues1] = useState([]);



useEffect(() => {
  
  fetchOptions(selectedOption); // Fetch options based on initial selected value
}, [selectedOption]);

const fetchOptions = async (value) => {
  try {
    const response = await axios.get(`http://127.0.0.1:5000/api/listbatch/${value}`);
    console.log(response.data);
    const batchIds = response.data.map(item => item);
    //console.log(batchIds);
    console.log(batchIds);
    setDropdownValues(batchIds);
    
    //console.log(response.data);
    
    // Other dropdowns or options handling
  } catch (error) {
    console.error('Error fetching options:', error);
  }
};


const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}));
    setSelectedOption(event.target.value);
   
    console.log(inputs);
}
const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://127.0.0.1:5000/api/useradd', inputs).then(function(response){
        console.log(response.data);
        //navigate('/');
    });
      
}
    return (
      
      <center>
        
        <div className="create_user">
            <div className="container h-100">
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-8">
                    <center><h1>Create Project</h1></center>
                    <center>
                    <form onSubmit={handleSubmit}>
                    
                        <div className="mb-3">
                          <label>Project Title</label>
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
                            <option value="Image Processing">Image Processing</option>

                            </select>
                          
                        </div>

                        <div className="mb-3">
                        
                          <label for="section">Choose a section:</label>
                          <select name="section"  onChange={handleChange}>
                          <option></option>
                            <option value="a">A</option>
                            <option value="b">B</option>
                            <option value="c">C</option>
                            
                            </select>
                          
                        </div>

                        

                        

                        <div className="mb-3">
                      <label>Section</label>
                      <label for="batch">Choose a Batch:</label>
                      <select name="batch" onChange={handleChange} multiple>
                      {dropdownValues.map((option, index) => (
          <option key={index} value={option}>
            {"Batch"+option}
          </option>
        ))}

        </select>
            </div>

                        <button type="submit" name="add" className="btn btn-primary">Save</button>
                        <p>{inputs.name}</p>
                    </form></center>
                    
                    
                    </div>
                    <div className="col-2">
                      {selectedOption}
                    </div>
                </div>
            </div>
        </div>
        </center>
      );
    }

    export default CreateUser;
