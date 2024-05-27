import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';

import axios from "axios" //npm install axios --save 
import {Link} from 'react-router-dom';

import './TableWithPagination.css'; // Import your CSS file for styling

const TableWithPagination = ({ itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [filterOption, setFilterOption] = useState('domain');
  const [filteredData, setFilteredData] = useState([]);

  const [forceRender, setForceRender] = useState(false);

const handleClick = () => {
  // Toggle forceRender to trigger a re-render
  setForceRender(prevState => !prevState);
};
  // Fetch initial data
  useEffect(() => {
    getUsers();
  }, []);

  // Fetch data from API
  const getUsers = () => {
    axios.get('http://127.0.0.1:5000/api/listusers')
      .then(response => {
        console.log(response.data);
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  };

  // Filter data based on selected radio button and search term
  useEffect(() => {
    filterData();
  }, [data, filterOption, searchTerm]);

  // Filtering logic
  const filterData = () => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = data.filter(item => {
      const fieldValue = item[filterOption].toLowerCase();
      return fieldValue.includes(lowerCaseSearchTerm);
    });

    setFilteredData(filtered);
    setCurrentPage(0); // Reset pagination when filter criteria change
  };

  // Handle pagination
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle radio button change
  const handleRadioChange = (e) => {
    setFilterOption(e.target.value);
  };
  

  const deleteUser = (id,sec) => {
    const numericId = parseInt(id, 10);
    console.log(numericId);
    console.log(sec);
    axios.delete(`http://127.0.0.1:5000/userdelete/${numericId}/${sec}`).then(function(response){
        console.log(response.data);
        getUsers();
    });
    alert("Successfully Deleted");
}


  // Pagination calculation
  const offset = currentPage * itemsPerPage;
  const currentPageData = searchTerm
    ? data.filter(item =>
        item[filterOption].toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredData.slice(offset, offset + itemsPerPage);

  // Return the JSX for the component
  return (
    <div className='container mt-5'>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by..."
          value={searchTerm}
          onChange={handleSearch}
        />

        <div className="filter-radio-buttons">
          <label>
            <input
              type="radio"
              value="domain"
              checked={filterOption === 'domain'}
              onChange={handleRadioChange}
            />
            Domain
          </label>
          <label>
            <input
              type="radio"
              value="section"
              checked={filterOption === 'section'}
              onChange={handleRadioChange}
            />
            Section
          </label>
          <label>
            <input
              type="radio"
              value="title"
              checked={filterOption === 'title'}
              onChange={handleRadioChange}
            />
            Title
          </label>
          {/* Add more radio buttons for other filter options */}
        </div>
      </div>

      <div className="table-search-container">
        <table>
          {/* Table header */}
          <thead>
            <tr>
              <th>Problem Statement</th>
              <th>Domain</th>
              <th>Category</th>
              <th>Section</th>
              <th>Batch</th>
              <th>Action</th>
            </tr>
          </thead>

          {/* Table body */}
          <tbody>
            {currentPageData.map((item) => (
              <tr key={`${item.batchno}-${item.section}`}>
                <td>{item.title}</td>
                <td>{item.domain}</td>
                <td>{item.category}</td>
                <td>{item.section}</td>
                <td>{item.batchno}</td>
                {/* Action buttons */}
                <td>
                  {/* Example buttons */}
                  <Link to={`user/${item.batchno}/${item.section}/editproject`} className="btn btn-success" style={{marginRight: "100px"}}>Edit</Link>

                  
                  <button onClick={() => deleteUser(item.batchno,item.section)} className="btn btn-danger">Delete</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <ReactPaginate
        pageCount={Math.ceil(filteredData.length / itemsPerPage)}
        pageRangeDisplayed={5}
        marginPagesDisplayed={2}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
    </div>
  );
};

export default TableWithPagination;
