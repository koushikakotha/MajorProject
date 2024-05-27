
import React, {  useState,useEffect } from "react";
import { useMyContext } from "./MyContext";
import axios from "axios" //npm install axios --save 
import "./menu.css"
import Admin from "./Admin";
import './style.css';
const ListReview = () => {
 
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
  

   

  useEffect(() => {
    sendDataToBackend(selectedOption);
  }, [selectedOption]);

  const sendDataToBackend = (value) => {
    // Send a POST request to your Flask API with the selected radio button value in the route
    axios.get(`http://localhost:5000/api/reviewprojects/${value}`)
      .then(response => {
        // Handle the response from the backend and set the received data state
        console.log("response data");
        //console.log(response.data.Batches);
        //console.log(response.data.Problems);
        let batches = response.data;
        

        setReceivedData(response.data);
        setUsers(batches);
        
        
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
            <th >Review No</th>
            
            <th >Review Link</th>
            <th>Revie Date</th>
            
            
            
          </tr>
        </thead>
        <tbody>
                            {users.map((user, key) =>
                                <tr key={key}>
                                    

                                    <td>{user.reviewid}</td>
                                    
                                    <td>{user.reviewlink}</td>
                                    <td>{user.reviewdate}</td>
                                    
                                </tr>)}

                          </tbody>
      </table>
    </div>
    </div>
  );
};

export default ListReview;
