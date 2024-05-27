import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import {
    FaTh,
    FaBars,
    FaUserAlt,
    FaRegChartBar,
    FaCommentAlt,
    FaShoppingBag,
    FaThList,
    FaSignOutAlt
}from "react-icons/fa";



const Sidebar = ({children}) => {
    const[isOpen ,setIsOpen] = useState(false);
    const toggle = () => setIsOpen (!isOpen);
    const { user } = useAuth();


    const adminMenu=[
    { path: '/list',name: "ListProblemStatements",icon:<FaTh/>},
    { name: 'Batch Dividing', path: '/batchdividing',icon:<FaUserAlt/>},
    {name: 'List Batches', path: '/listbatch',icon:<FaThList/>},
    {name:'Guide Mapping',path: '/guidemapping'},
    {name:'Review Scheduling',path: '/review'},
    {name:'PowerBI dashboard',path: '/power',icon:<FaRegChartBar/>},
    {name:'Assess Project',path: '/admin',icon:<FaRegChartBar/>},
    {name: 'List Reviews', path: '/listreview',icon:<FaThList/>},
    {name:'Log Out',path: '/logout',icon:<FaSignOutAlt/>},
    
    ]
   
    const facultyMenu = [
        { path: '/list',name: "ListProblemStatements",icon:<FaTh/>},
    {name: 'List Batches', path: '/listbatch',icon:<FaRegChartBar/>},
  
    {name:'Assess Project',path: '/faculty',icon:<FaRegChartBar/>},
    {name: 'List Reviews', path: '/listreview',icon:<FaThList/>},
    {name:'Log Out',path: '/logout',icon:<FaSignOutAlt/>},
    
      ];
    
      const studentMenu = [
        { path: '/list',name: "ListProblemStatements",icon:<FaTh/>},
    
    {name: 'List Batches', path: '/listbatch',icon:<FaRegChartBar/>},

    {name: 'Create Project', path: '/addnewuser',icon:<FaCommentAlt/>}, 
    {name: 'Certificate', path: '/certificate-download',icon:<FaCommentAlt/>},  
    {name: 'List Reviews', path: '/listreview',icon:<FaThList/>},
    {name:'Log Out',path: '/logout',icon:<FaSignOutAlt/>},
    
    
      ];
    
      const getMenuItems = () => {
        switch (user?.role) {
          case 'admin':
            return adminMenu;
          case 'faculty':
            return facultyMenu;
          case 'student':
            return studentMenu;
          default:
            return [];
        }
      };
    
      const menuItem = getMenuItems();

    return (
        <div className="container">
           <div style={{width: isOpen ? "270px" : "50px"}} className="sidebar">
               <div className="top_section">
                   <h1 style={{display: isOpen ? "block" : "none"}} className="logo">Logo</h1>
                   <div style={{marginLeft: isOpen ? "150px" : "0px"}} className="bars">
                       <FaBars onClick={toggle}/>
                   </div>
               </div>
               {
                   menuItem.map((item, index)=>(
                       <NavLink to={item.path} key={index} className="link" activeclassName="active">
                           <div className="icon">{item.icon}</div>
                           <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
                       </NavLink>
                   ))
               }
           </div>
           <main>{children}</main>
        </div>
    );
};

export default Sidebar;