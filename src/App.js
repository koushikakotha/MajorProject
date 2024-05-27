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
import { useAuth } from './AuthContext';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';
import Adm from './pages/adm';
import Fac from './pages/fac';
import LogoutButton from './LogOut';
import CertificateDownload from './pages/CertificateDownload';
import ListReview from './pages/ListReview';
const AuthenticatedRoute = ({ element }) => {
    const { user } = useAuth();
    return user ? element : <Navigate to="/login" />;
};

const App = () => {
  const { user } = useAuth();
  console.log(user);
  return (
     <div className="app">
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route
                        path="/dashboard"
                        element={
                            <AuthenticatedRoute
                                element={<Dashboard />}
                            />
                        }
                    />
                    <Route path="/certificate-download" element={<CertificateDownload />} />
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/user/:id/:sec/editproject" element={<EditProject />}  />
                    
                            
            
                </Routes>

                {user && (
                    <Sidebar>
                        {/* Nested routes for protected pages with Sidebar */}
                        <Routes>
                        
                            <Route path="/list" element={<AuthenticatedRoute element={<ListUserPage />} />} />
                            
                            <Route path="/addnewuser" element={<AuthenticatedRoute element={<CreateUser />} />} />

                            <Route
                path="/user/:id/:sec/editproject"
                element={<AuthenticatedRoute element={<EditProject />} />}
              />
                            <Route path="/list/user/:id/:sec/editproject" element={<AuthenticatedRoute element={<EditProject />} />} />
                            <Route path="/listbatch" element={<AuthenticatedRoute element={<ListBatch />} />} />
                            <Route path="/automate" element={<AuthenticatedRoute element={<AutomatePage />} />} />
                            <Route path="/custom" element={<AuthenticatedRoute element={<CustomPage />} />} />
                            <Route path="/custom/user/:id/:sec/editbatch" element={<AuthenticatedRoute element={<EditBatch />} />} />
                            <Route path="/batchdividing" element={<AuthenticatedRoute element={<BatchDividing />} />} />
                            <Route path="/guidemapping" element={<AuthenticatedRoute element={<GuideMapping />} />} />
                            <Route path="/automate/user/:id/:sec/editbatch" element={<AuthenticatedRoute element={<EditBatch />} />} />
                            <Route path="/review" element={<AuthenticatedRoute element={<ReviewSchedule />} />} />
                            <Route path="/power" element={<AuthenticatedRoute element={<Power />} />} />
                            <Route path="/admin" element={<Adm />} />
                            <Route path="/faculty" element={<Fac />} />
                            <Route path="/logout" element={<LogoutButton />} />
                            <Route path="/listreview" element={<AuthenticatedRoute element={<ListReview />} />} />

                        </Routes>
                    </Sidebar>
                )}
             {user && (
          <div>
            {/* Place the welcome message here */}
            <p>Welcome, {user.username}!</p>
            {/* Additional components or UI for authenticated user */}
          </div>
        )}

            </Router>
            
        </div>
  );
};

export default App;
