import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LogoutComponent from './LogoutComponent'
import HeaderComponent from './HeaderComponent'
import EmployeeForm from './EmployeeForm'
import EmployeeList from './EmployeeList'
import ErrorComponent from './ErrorComponent'
import LoginComponent from './LoginComponent'
import AuthProvider, { useAuth } from '../security/AuthContext'
import './Ravionics.css'
import AttendanceManagement from '../pages/user/AttendanceManagement'
import SideBar from './SideBar'
import { useState } from 'react'
import AdminTemplateEditor from '../pages/admin/AdminTemplateEditor' 
import FooterComponent from './FooterComponent'
import CompleteProfilePage from '../pages/user/CompleteProfilePage' 
import UserRegistrationForm from '../pages/admin/UserRegistrationForm' 
import WelcomePage from '../pages/user/WelcomePage' 
import NewUserPage from '../pages/user/NewUserPage' 
import ExperienceForm from '../pages/user/ExperienceForm'
import ForgotPasswordComponent from './ForgotPasswordComponent'
import EmployeeDetailPage from '../pages/admin/EmployeeDetailsPage'
import EmployeeEditPage from '../pages/admin/EmployeeEditPage'

function AuthenticatedRoute({ children }) {
    if (useAuth().isAuthenticated) {
        return children
    }
    
    return <Navigate to="/" />
}

function Routing() {
    
    // used for sidebar
    const [isOpen, setIsOpen] = useState(false);

    // Sidebar toggle function
    const handleOpen = () => {
            setIsOpen(!isOpen);
    };


    return (
        <div className="Ravionics">
            <AuthProvider>
                <BrowserRouter>
                    <HeaderComponent handleOpen={() => handleOpen()} />
                    <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
                    <Routes>
                        <Route path='/' element={<LoginComponent />} />
                        <Route path='/login' element={<LoginComponent />} />
                        <Route path='/forgot-password' element={<ForgotPasswordComponent />} />
                        {/* here :username is the path variable..... */}
                        <Route path='/welcome' element={
                            <AuthenticatedRoute>
                                {/* this Welcome component is just used when children is returned, else will be ignored/not rendered anymore */}
                                <WelcomePage />
                            </AuthenticatedRoute>
                        } />
                        <Route path='/employees' element={
                            <AuthenticatedRoute>
                                <EmployeeList />
                            </AuthenticatedRoute>
                        } />
                        <Route path='/employees/:employeeId' element={
                            <AuthenticatedRoute>
                                <EmployeeDetailPage />
                            </AuthenticatedRoute>
                        } />
                        <Route path='/employees/:employeeId/edit' element={
                            <AuthenticatedRoute>
                                <EmployeeEditPage />
                            </AuthenticatedRoute>
                        } />
                        <Route path='/new' element={
                            <AuthenticatedRoute>
                                <NewUserPage />
                            </AuthenticatedRoute>
                        } />
                        <Route path='/exp' element={
                            <AuthenticatedRoute>
                                <ExperienceForm />
                            </AuthenticatedRoute>
                        } />


                        <Route path='/fill' element={
                            <AuthenticatedRoute>
                                <EmployeeForm />
                            </AuthenticatedRoute>
                        } />

                        <Route path='/logout' element={
                            <AuthenticatedRoute>
                                <LogoutComponent />
                            </AuthenticatedRoute>
                        } />

                        <Route path='/attendance' element={
                            <AuthenticatedRoute>
                                <AttendanceManagement />
                            </AuthenticatedRoute>
                        } />

                        <Route path='/template' element={
                            <AuthenticatedRoute>
                                <AdminTemplateEditor />
                            </AuthenticatedRoute>
                        } />

                        <Route path='/complete' element={
                            <AuthenticatedRoute>
                                <CompleteProfilePage />
                            </AuthenticatedRoute>
                        } />

                        <Route path='/register' element={
                            <AuthenticatedRoute>
                                <UserRegistrationForm />
                            </AuthenticatedRoute>
                        } />

                        {/* <Route path='/admin' element={
                            <AuthenticatedRoute>
                                <AdminDashboardNav />
                            </AuthenticatedRoute>
                        } >
                            <Route path='home' element={
                                <AuthenticatedRoute>
                                    <AdminHome />
                                </AuthenticatedRoute>
                            } />

                            <Route path='EmployeeList' element={
                                <AuthenticatedRoute>
                                    <EmployeeList />
                                </AuthenticatedRoute>
                            } />

                        </Route> */}

                        <Route path='*' element={<ErrorComponent />} />
                    </Routes>
                    {/* <FooterComponent/> */}
                </BrowserRouter>
            </AuthProvider>
        </div>
    )
}

export default Routing;
//it is a controlled component..... (see notes.txt)