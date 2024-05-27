// App.js
import React from 'react';
import { BrowserRouter as Router, Route,Routes ,useRoutes} from 'react-router-dom';
//import './menu.css'
import { Link } from 'react-router-dom';
//import './style.css'
import LeftMenu from './LeftMenu';
import ListUserPage from './ListUserPage';
import CreateUser from './CreateUser';
import ListBatch from './ListBatch';
import EditProject from './EditProject';

import AutomatePage from './AutomatePage';
import CustomPage  from './CustomPage';
import EditBatch from './EditBatch';
import BatchDividing from './BatchDividing';
import GuideMapping from './GuideMapping';


const Admin = () => {
  const menus = [
    { title: 'List Problem Statements', path: '/list', component: ListUserPage },
    { title: 'Batch Dividing', path: '/batchdividing', component: BatchDividing },
    { title: 'List Batches', path: '/listbatch', component: ListBatch },

    { title: 'Create Project', path: '/addnewuser', component: CreateUser },  
    {title:'Guide Mapping',path: '/guidemapping', component: GuideMapping}
  ];

  return (
    <div className='app'>
    
      <div style={{ display: 'flex' }}>
        <div style={{ width: '200px', borderRight: '1px solid #ccc' }}>
          <LeftMenu menus={menus} />
        </div>
        </div>  
        <div style={{ padding: '00px' }} className='content'>
        <Routes>
           {menus.map((menu) =>
           (
            <Route path={menu.path} element = {menu.component} />
           ))} 
        <Route path="/list" element={<ListUserPage />} />
        <Route path="/addnewuser" element={<CreateUser />} />

          <Route path="/admin" element={<Admin />} />   
            <Route path="user/:id/editproject" element={<EditProject />} />
            
            <Route path="/automate" element={<AutomatePage />} />
            <Route path="/custom" element={<CustomPage />} />
            <Route path="/custom/user/:id/:sec/editbatch" element={<EditBatch />} />
           
            <Route path="/automate/user/:id/:sec/editbatch" element={<EditBatch />} />
         </Routes>
        </div>
      </div>
  );
};
export default Admin;
