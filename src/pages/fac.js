// src/App.js
import React, { useEffect, useState ,useRef} from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
function Fac() {
  const { user } = useAuth();
  //console.log({"role":user.role});
  //console.log({"name":user.username});
  //console.log({"pass":user.password});
  const [studentsData, setStudentsData] = useState([]);
  const [batchNo, setBatchNo] = useState('');
  const [sec, setSec] = useState('');
  const [batchNumbers, setBatchNumbers] = useState([]);
  const [reviewNumbers, setReviewNumbers] = useState([]);
  const [selectedReviewNumber, setSelectedReviewNumber] = useState('');
  const [dynamicGuide, setDynamicGuide] = useState('');
  const usernameRef = useRef(user.username);

  useEffect(() => {
    // Update the ref when user.username changes
    usernameRef.current = user.username;
  }, [user.username]);


  const handleChange = (e, studentIndex, fieldName) => {
    const updatedStudents = [...studentsData];
    updatedStudents[studentIndex][fieldName] = e.target.value;
    setStudentsData(updatedStudents);
  };

  const guide = "Mr. GVSS. Prasad Raju";
 
  const fetchReviewNumbers = async () => {
    try {
      
      const response = await axios.get(`http://localhost:5000/api/review-numbers`);
      console.log(response.data);
      setReviewNumbers(response.data);
    } catch (error) {
      console.error('Error fetching batch numbers:', error);
    }
  };
  
  // Add this useEffect to observe the updated batchNumbers
  useEffect(() => {
    console.log('Updated ReviewNumbers:', reviewNumbers);
  }, [reviewNumbers]);


  useEffect(() => {
    fetchReviewNumbers();
  }, []); // 

  
  const fetchGuide = async () => {
    try {
      console.log({"username": usernameRef.current});
      console.log({"password":user.password})
      const guideResponse = await axios.get(`http://localhost:5000/api/get-guide?role=${user.role}&username=${usernameRef.current}&password=${user.password}`);
      const dynamicGuide = guideResponse.data;
      setDynamicGuide(dynamicGuide);
      console.log({"guidedyn":dynamicGuide});
    } catch (error) {
      console.error('Error fetching guide:', error);
    }
  };

  useEffect(() => {
    console.log("error fetching guid");
    fetchGuide();
  }, []); 


  const fetchBatchNumbers = async () => {
    try {
      console.log(sec);
      console.log({"dynamicguide":dynamicGuide});
      //console.log(guide);
      const response = await axios.get(`http://localhost:5000/api/get-batch-numbers-faculty?sec=${sec}&guide=${dynamicGuide}`);
      console.log(sec);
      setBatchNumbers(response.data.batch_numbers);
      
    
    }catch (error) {
      console.error('Error fetching batch numbers:', error);
    }
  };
  
  // Add this useEffect to observe the updated batchNumbers
  useEffect(() => {
    console.log('Updated batchNumbers:', batchNumbers);
  }, [batchNumbers]);
  
  useEffect(() => {
    fetchBatchNumbers();
  }, [sec,dynamicGuide]); // 

  const fetchStudentsData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/get-students?batchno=${batchNo}&sec=${sec}`);
      setStudentsData(response.data.students.map(student => ({ ...student, creativity: '', presentation: '' })));
    } catch (error) {
      console.error('Error fetching students data:', error);
    }
  };

  useEffect(() => {
    fetchBatchNumbers();
  }, []); // Fetch batch numbers on component mount

  useEffect(() => {
    fetchStudentsData();
  }, [batchNo, sec]); // Fetch students data when batchNo or sec changes

  console.log({"role":user.role});

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(studentsData);
      console.log(batchNo);
      console.log(sec);
      console.log({"role":user.role});
      const response = await axios.post('http://localhost:5000/api/submit-form', {students: studentsData,sec,batchNo,selectedReviewNumber,role:user.role});
      console.log(response.data);
      // Refresh students data after submitting the form
      fetchStudentsData();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="Fac">
      <h1>Student Information Form</h1>

      <div>
        

        <label>Section:</label>
        <select
          value={sec}
          onChange={(e) => setSec(e.target.value)}
        >
          <option value="">Select Section</option>
          <option value="a">A</option>
          <option value="b">B</option>
          <option value="c">C</option>
          {/* Add more section options as needed */}
        </select>
        <p>{sec}</p>

        
        <label>Batch Number:</label>
        <select
          value={batchNo}
          onChange={(e) => setBatchNo(e.target.value)}
        >
          <option value="">Select Batch Number</option>
          {batchNumbers.map((batchNumber, index) => (
            <option key={index} value={batchNumber}>
              {batchNumber}
            </option>
          ))}
        </select>
        <p>{batchNo}</p>
      </div>

      <form onSubmit={handleSubmit}>
        {studentsData.map((student, studentIndex) => (
          <div key={studentIndex} className="student-section">
            
            <p>Name: {student.name}</p>

            <label>Creativity:</label>
            <input
              type="number"
              name="creativity"
              value={student.creativity}
              onChange={(e) => handleChange(e, studentIndex, 'creativity')}
              required
            />
            
            <label>Technical Skills:</label>
            <input
              type="number"
              name="technicalskills"
              value={student.technicalskills}
              onChange={(e) => handleChange(e, studentIndex, 'technicalskills')}
              required
            />
            
            <label>Project Management:</label>
            <input
              type="number"
              name="projectmanagement"
              value={student.projectmanagement}
              onChange={(e) => handleChange(e, studentIndex, 'projectmanagement')}
              required
            />
            
            <label>Documentation:</label>
            <input
              type="number"
              name="documentation"
              value={student.documentation}
              onChange={(e) => handleChange(e, studentIndex, 'documentation')}
              required
            />

            <label>Presentation:</label>
            <input
              type="number"
              name="presentation"
              value={student.presentation}
              onChange={(e) => handleChange(e, studentIndex, 'presentation')}
              required
            />
          </div>
        ))}
       
       <label>Select Review Number:</label>
<select
  value={selectedReviewNumber}  // Define selectedReviewNumber state
  onChange={(e) => setSelectedReviewNumber(e.target.value)}  >
    <option value=""></option>
{reviewNumbers && reviewNumbers.map((number) => (
  <option key={number} value={number}>
    {number}
  </option>
))}
  
</select>
       <p>{selectedReviewNumber}</p>
        <button type="submit">Submit</button>
      </form>

      <div>
        <h2>Student List</h2>
        <ul>
          {studentsData.map((student, studentIndex) => (
            <li key={studentIndex}>
              {`Name: ${student.name}, Creativity: ${student.creativity}, Presentation: ${student.presentation}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Fac;
