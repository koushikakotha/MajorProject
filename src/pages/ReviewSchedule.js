import React, { useState } from 'react';
import axios from 'axios';
import './style.css';
const ReviewSchedule = () => {
  const [date, setDate] = useState('');
  const [inputs,setinputs] = useState([]);

  
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setinputs(values => ({...values, [name]: value}));
    //setSelectedOption(event.target.value);
   
    //console.log(inputs);
}

  

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs)
    axios.post('http://127.0.0.1:5000/api/review_sch/', inputs).then(function(response){
        console.log(response.data);
        console.log(inputs)
        console.log('Date submitted successfully');
        //navigate('/');
    });

}
  return (
    <center>
    <div className='review-sch'>
   
      <form onSubmit={handleSubmit}>
      
      <label>
          ReviewNo:
          <input type="text" name = "reviewno"  onChange={handleChange} />
        </label>
        
        <br></br>
        <br></br>
        <label>
          Date:
          <input type="date" name = "date"  onChange={handleChange} />
        </label>
        <br></br>
        <br></br>
        <label>
          Section:
          <input type="text" name = "sec"  onChange={handleChange} />
        </label>
        <br></br>
        <br></br>
        <label>
          Meeting Link:
          <input type="text" name = "url"  onChange={handleChange} />
        </label>
        <br></br>
        <br></br>
        <button type="submit">Submit</button>
        
      </form>
      
    </div>
    </center>
  );
};

export default ReviewSchedule;
