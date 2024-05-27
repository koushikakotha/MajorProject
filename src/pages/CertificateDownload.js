// CertificateDownload.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const CertificateDownload = () => {
  const { user } = useAuth();
  const [topRankStudents, setTopRankStudents] = useState([]);
  const [isTopRank, setIsTopRank] = useState(false);
/*
  useEffect(() => {
    const fetchTopRankStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/top-rank-students');
        console.log(response.data);
        const fetchedTopRankStudents = response.data;
        console.log('User username:', user.username, typeof user.username);
        console.log(user.username.toString());

        // Now you can use isTopRankUser in your logic
        const isTopRankUser = fetchedTopRankStudents.includes(user.username.toString());
        setIsTopRank(isTopRankUser);
        
        // Set the topRankStudents state after the successful fetch
        setTopRankStudents(fetchedTopRankStudents);
      } catch (error) {
        console.error('Failed to fetch top-rank students', error);
      }
    };

    fetchTopRankStudents();
  }, [user]);*/

  useEffect(() => {
    const fetchTopRankStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/top-rank-students');
        console.log('Response from server:', response.data);
  
        // Ensure that the response contains an array of strings
        if (Array.isArray(response.data.top_rank_students)) {
          const fetchedTopRankStudents = response.data.top_rank_students.map(item => item.toString().toLowerCase());
          console.log('fetchedTopRankStudents:', fetchedTopRankStudents);
          console.log(user.username);
  
          // Now you can use isTopRankUser in your logic
          const isTopRankUser = fetchedTopRankStudents.includes(user.username.toString().toLowerCase());

          console.log('isTopRankUser:', isTopRankUser);
          console.log('user.username.toString().toLowerCase():', user.username.toString().toLowerCase());
          console.log('fetchedTopRankStudents:', fetchedTopRankStudents);
          setIsTopRank(isTopRankUser);
  
          // Set the topRankStudents state after the successful fetch
          setTopRankStudents(fetchedTopRankStudents);
        } else {
          console.error('Invalid response from server. Expected an array of strings.');
        }
      } catch (error) {
        console.error('Failed to fetch top-rank students', error);
      }
    };
  
    fetchTopRankStudents();
  }, [user]);

  
  const handleDownload = async () => {
    try {
      const response = await axios.post('http://localhost:5000/generate-certificate', {
        username: user.username,
      }, {
        responseType: 'blob',  // Set responseType to 'blob' for binary data
      });

      if (response.data.success) {
        console.log('Downloading certificate...');}
      // Create a Blob from the binary data
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // Create a download link
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `certificate_${user.username}.pdf`;

      // Append the link to the document and trigger the click event
      document.body.appendChild(link);
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);

    } catch (error) {
      console.error('Failed to download certificate', error);
    }
  };


  return (
    <div className='cert'>
      <h2>Certificate Download</h2>
      {isTopRank ? (
        <button onClick={handleDownload}>Download Certificate</button>
      ) : (
        <p>You are not in the top-rank list.</p>
      )}
    </div>
  );
};

export default CertificateDownload;
