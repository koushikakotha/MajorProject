import React, { useEffect, useState } from "react";
import Admin from "./Admin"
//import "./style.css"
import { useMyContext } from "./MyContext";
import axios from "axios" //npm install axios --save 
import {Link} from 'react-router-dom';
import DataTable from 'react-data-table-component';
import TableWithPagination from './TableWithPagination';

export default function ListUserPage(){
    
    const [users, setUsers] = useState([]);
    useEffect(() => {
        getUsers();
    }, []);
  
    function getUsers() {
        axios.get('http://127.0.0.1:5000/api/listusers'
        ).then(function(response) {
            //console.log(response.data);
            setUsers(response.data);
            //console.log("users");
            //console.log(users);
        });
    }
     
    const deleteUser = (id) => {
        axios.delete(`http://127.0.0.1:5000/userdelete/${id}`).then(function(response){
            console.log(response.data);
            getUsers();
        });
        alert("Successfully Deleted");
    }

    
   
    return (
    <div>
        
        <div className="container h-100">
            
                    <center><h1 style={{marginLeft:"150px"}}>Problem Statements</h1></center>
      <TableWithPagination data={users} itemsPerPage={8} />
    </div>
                
            </div>
       
  );
}
