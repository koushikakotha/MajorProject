import React, { useState, useEffect  } from "react";
import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {Link} from 'react-router-dom';
export default function EditBatch(){
  
    const navigate = useNavigate();
  
    const [inputs, setInputs] = useState([]);
  
    const {id} = useParams('id');
    const {sec} = useParams('sec');

    const [showLoginForm, setShowLoginForm] = useState(false);

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  const [showLoginForm1, setShowLoginForm1] = useState(false);

  const toggleLoginForm1 = () => {
    setShowLoginForm1(!showLoginForm1);
  };
  const [showLoginForm2, setShowLoginForm2] = useState(false);

  const toggleLoginForm2 = () => {
    setShowLoginForm2(!showLoginForm2);
  };

  
    useEffect(() => {
        getUser();
    }, []);
  
    function getUser() {
        axios.get(`http://127.0.0.1:5000/api/batchdetails/${id}/${sec}`).then(function(response) {
            console.log(response.data);
            setInputs(response.data);
        });
    }
  
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }
    const handleSubmit = (event) => {
        event.preventDefault();
  
        axios.put(`http://127.0.0.1:5000/batchupdate/${id}`, inputs).then(function(response){
            console.log(response.data);
            navigate('/');
        });
          
    }
    const shouldRenderLink = Object.keys(inputs).length <= 4;

    return (
        <div>
            <div className="container h-100">
            <div className="row">
                <div className="col-2"></div>
                <div className="col-8">
                <p>{Object.keys(inputs).length}</p>
           
                </div>
                <div className="col-2"></div>

                <table class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>batch No</th>
                                <th>Studentid</th>
                                <th>Section</th>
                                <th>GuideName</th>  
                                 
                            </tr>
                        </thead>
                        <tbody>
                            {inputs.map((user, key) =>
                                <tr key={key}>
                                    

                                    <td>{user.batchid}</td>
                                    
                                    <td>{user.studentid}</td>
                                    <td>{user.section}</td>
                                    <td>{user.guidename}</td>
                                    
                                </tr>)}

                          </tbody>
                        </table>

                      {shouldRenderLink && (<Link to={`user/${id}/${sec}/editbatch`} className="btn btn-success" style={{marginRight: "10px"}}>Swap With Other</Link>)}
                        <h1>Welcome to My App</h1>
      <button onClick={toggleLoginForm}>Swap</button>

      {showLoginForm && (
        <form>
         
          <label>
            Username:
            <input type="text" />
          </label>
          <label>
            Password:
            <input type="password" />
          </label>
          <button type="submit">Submit</button>
        </form>
      )}

<br></br>
<button onClick={toggleLoginForm1}>Add Member</button>

{shouldRenderLink && showLoginForm1 && (
  <form>
   
    <label>
      Username:
      <input type="text" />
    </label>
    <label>
      Password:
      <input type="password" />
    </label>
    <button type="submit">Submit</button>
  </form>
)}
<br></br>

<button onClick={toggleLoginForm2}>Delete Member</button>

{showLoginForm2 && (
  <form>
   
    <label>
      Username:
      <input type="text" />
    </label>
    <label>
      Password:
      <input type="password" />
    </label>
    <button type="submit">Submit</button>
  </form>
)}
            </div>
            </div>
        </div>
      );
    }