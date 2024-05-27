// src/Dashboard.js
// App.js
import React from 'react';
import { BrowserRouter as Router, Route,Routes,Navigate} from 'react-router-dom';
import { Link } from 'react-router-dom';
import './pages/menu.css'
import './App.css'
import './pages/style.css'
import Student from './pages/Student';
import LeftMenu from './pages/LeftMenu';
import ListUserPage from './pages/ListUserPage';
import CreateUser from './pages/CreateUser';
import ListBatch from './pages/ListBatch';
import EditProject from './pages/EditProject';
import Admin from './pages/Admin';
import AutomatePage from './pages/AutomatePage';
import CustomPage  from './pages/CustomPage';
import EditBatch from './pages/EditBatch';
import BatchDividing from './pages/BatchDividing';
import GuideMapping from './pages/GuideMapping';
import ReviewSchedule from './pages/ReviewSchedule';
import Sidebar from './pages/Sidebar';
import Power from './power';
import LogoutButton from './LogOut';
import Adm from './pages/adm';
import ListReview from './pages/ListReview';
import { useAuth } from './AuthContext';

const AdminDashboard = () => {
    return (
        
        <Sidebar>
      <Routes>
            <Route path="/list" element={<ListUserPage />} />
            <Route path="/addnewuser" element={<CreateUser />} />
            <Route path="list/user/:id/editproject" element={<EditProject />} />
            <Route path="/listbatch" element={<ListBatch />} />
            <Route path="/automate" element={<AutomatePage />} />
            <Route path="/custom" element={<CustomPage />} />
            <Route path="/custom/user/:id/:sec/editbatch" element={<EditBatch />} />
            <Route path="/batchdividing" element={<BatchDividing />} />
            <Route path="/guidemapping" element={<GuideMapping />} />
            <Route path="/automate/user/:id/:sec/editbatch" element={<EditBatch />} />
            <Route path='/review_sch' element={<ReviewSchedule />} />
            <Route path='/power' element={<ReviewSchedule />} />
            <Route path='/admin' element={<Adm />} />
            <Route path='/logout' element={<LogoutButton />} />
            <Route path='/listreview' element={<ListReview />} />
        </Routes>
        </Sidebar>
    );
};

const FacultyDashboard = () => {
    return (
        <div>
            <h2>Welcome to the Faculty Dashboard</h2>
            {/* Add Faculty Dashboard content here */}
        </div>
    );
};

const StudentDashboard = () => {
    return (
        <div>
            <h2>Welcome to the Student Dashboard</h2>
            {/* Add Student Dashboard content here */}
        </div>
    );
};

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) {
        return <p>Loading...</p>;
    }

    switch (user.role) {
        case 'admin':
            return <AdminDashboard />;
        case 'faculty':
            return <FacultyDashboard />;
        case 'student':
            return <StudentDashboard />;
        default:
            return <p>Invalid role</p>;
    }
};

export default Dashboard;
