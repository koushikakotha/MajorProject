
import React, {  useState,useEffect } from "react";
import { useMyContext } from "./MyContext";
import axios from "axios" //npm install axios --save 
import "./menu.css"
import Admin from "./Admin";
import './style.css';
const ListBatch = () => {
 
/*
  const fetchDataFromBackend = () => {
    axios.post('http://localhost:5000/api/listbatch', { selectedOption })
      .then(response => {
        // Handle the response data from Flask
        setResponseData(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };*/

  
  const basename = useMyContext;

  const [selectedOption, setSelectedOption] = useState('b');
  const [receivedData, setReceivedData] = useState(null);

  
  const [users, setUsers] = useState([]);
  const [users1, setUsers1] = useState([]);
  useEffect(() => {
    sendDataToBackend(selectedOption);
  }, [selectedOption]);

  const sendDataToBackend = (value) => {
    // Send a POST request to your Flask API with the selected radio button value in the route
    axios.get(`http://localhost:5000/api/batch/${value}`)
      .then(response => {
        // Handle the response from the backend and set the received data state
        console.log("response data");
        //console.log(response.data.Batches);
        //console.log(response.data.Problems);
        let batches = response.data.Batches;
        let problems = response.data.Problems;

        setReceivedData(response.data);
        setUsers(batches);
        setUsers1(problems)
        
        //setUsers(response.data.Problems)
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
      });
}

const handleOptionChange = (event) => {
  if (event && event.target && event.target.value) {
      setSelectedOption(event.target.value);
    }
  
};
console.log("users");
console.log(users);
console.log("");
console.log(users1);
const data = users;
const data1 = users1;
const uniqueBatchIds = [...new Set(data.map(student => student.batchid))];



  return (
    <div>
      
      <center>
        <div className="list_bat">
      <form className="list-batch">
        <label>
          A
          <input
            type="radio"
            name="option"
            value="a"
            checked={selectedOption === 'a'}
            onChange={handleOptionChange}
          />
        </label>
        <label>
          B
          <input
            type="radio"
            name="option"
            value="b"
            checked={selectedOption === 'b'}
            onChange={handleOptionChange}
          />
        </label>
        <label>
          C
          <input
            type="radio"
            name="option"
            value="c"
            checked={selectedOption === 'c'}
            onChange={handleOptionChange}
          />
        </label>
        {/* Add more radio inputs for other options */}
        {/* ... */}
      </form>
      </div>
      </center>

      {/* Display fetched data */}
      
      <div>
      <center><h1>Student Data</h1></center>
      <table className="table table-striped">
        <thead>
          <tr>
            <th >Batch ID</th>
            
            <th >Student ID</th>
            <th>Full Name</th>
            
            <th>Phone Number</th>
            
            <th>GuideName</th>
            
          </tr>
        </thead>
        <tbody>
          {uniqueBatchIds.map((batchId, index) => {
            const batchStudents = data.filter(student => student.batchid === batchId);
            
            

            return (
              <React.Fragment key={index}>
                {batchStudents.map((student, studentIndex) => (
                  <tr key={`${index}-${studentIndex}`}>
                    {studentIndex === 0 ? (
                      <td rowSpan={batchStudents.length} >{batchId}</td>
                    ) : null}
                    <td >{student.studentid}</td>
                    <td>{student.full_name}</td>
                    
                    <td>{student.phn}</td>
                    {studentIndex === 0 ? (
                      <td rowSpan={batchStudents.length} >{student.guidename}</td>
                    ) : null}
                    
                  </tr>
                ))}
              </React.Fragment>
            );
            
            
            
              
          })}
          
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default ListBatch;
