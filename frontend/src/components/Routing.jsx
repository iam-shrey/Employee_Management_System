import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LogoutComponent from './LogoutComponent'
import HeaderComponent from './HeaderComponent'
import EmployeeList from '../pages/admin/EmployeeList'
import UserEmployeeListPage from '../pages/user/UserEmployeeListPage'
import ErrorComponent from './ErrorComponent'
import LoginComponent from './LoginComponent'
import AuthProvider, { useAuth } from '../security/AuthContext'
import './Ravionics.css'
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
import MarkAttendance from '../pages/user/attendance/MarkAttendance'
import Attendance from '../pages/admin/attendance/Attendance'
import UserAttendance from '../pages/admin/attendance/UserAttendance'
import AttendanceEditForm from '../pages/admin/attendance/AttendanceEditForm'
import AttendanceSettings from '../pages/admin/attendance/AttendanceSettings'
import LeaveRequestForm from '../pages/user/leave/LeaveRequestForm'
import LeaveRequestsList from '../pages/user/leave/LeaveRequestsList'
import AdminLeaveRequests from '../pages/admin/leave/AdminLeaveRequests'
import AdminPastLeaveRequests from '../pages/admin/leave/AdminPastLeaveRequests'
import UserLeaveBalance from '../pages/user/leave/UserLeaveBalance'
import LeaveTypeForm from '../pages/admin/leave/LeaveTypeForm'
import LeaveTypeList from '../pages/admin/leave/LeaveTypeList'
import HolidayList from '../pages/admin/holiday/HolidayList'
import AddHoliday from '../pages/admin/holiday/AddHoliday'
import EditHoliday from '../pages/admin/holiday/EditHoliday'
import GeneratePayroll from '../pages/admin/payroll/GeneratePayroll'
import ViewPayroll from '../pages/admin/payroll/ViewPayroll'
import ViewPayrollUser from '../pages/user/payroll/ViewPayrollUser'
import AboutPage from './AboutPage'

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
                    <HeaderComponent className="navbar" handleOpen={() => handleOpen()} />
                    <div className={`main-layout ${isOpen ? "sidebar-open" : ""}`}>
                        <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
                        <div className="content">
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

                                <Route path='/about' element={
                                    <AuthenticatedRoute>
                                        <AboutPage />
                                    </AuthenticatedRoute>
                                } />

                                <Route path='/employees' element={
                                    <AuthenticatedRoute>
                                        <EmployeeList />
                                    </AuthenticatedRoute>
                                } />

                                <Route path='/user/employees' element={
                                    <AuthenticatedRoute>
                                        <UserEmployeeListPage />
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

                                <Route path='/logout' element={
                                    <AuthenticatedRoute>
                                        <LogoutComponent />
                                    </AuthenticatedRoute>
                                } />

                                <Route path='/mark/:employeeId' element={
                                    <AuthenticatedRoute>
                                        <MarkAttendance />
                                    </AuthenticatedRoute>
                                } />

                                <Route path='/apply-leave' element={
                                    <AuthenticatedRoute>
                                        <LeaveRequestForm />
                                    </AuthenticatedRoute>
                                } />

                                <Route path='/your-leaves' element={
                                    <AuthenticatedRoute>
                                        <LeaveRequestsList />
                                    </AuthenticatedRoute>
                                } />

                                <Route path='/your-leave-balance' element={
                                    <AuthenticatedRoute>
                                        <UserLeaveBalance />
                                    </AuthenticatedRoute>
                                } />

                                <Route path='/your-payrolls' element={
                                    <AuthenticatedRoute>
                                        <ViewPayrollUser />
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

                                <Route path='/employees/attendance' element={
                                    <AuthenticatedRoute>
                                        <Attendance />
                                    </AuthenticatedRoute>
                                } />

                                <Route path='/attendance/settings' element={
                                    <AuthenticatedRoute>
                                        <AttendanceSettings />
                                    </AuthenticatedRoute>
                                } />

                                <Route path='/attendance/:employeeId' element={
                                    <AuthenticatedRoute>
                                        <UserAttendance />
                                    </AuthenticatedRoute>
                                } />

                                <Route path='/edit/attendance/:userId' element={
                                    <AuthenticatedRoute>
                                        <AttendanceEditForm />
                                    </AuthenticatedRoute>
                                } />

                                <Route path='/employees/leave-requests' element={
                                    <AuthenticatedRoute>
                                        <AdminLeaveRequests />
                                    </AuthenticatedRoute>
                                } />

                                <Route path='/employees/leave-records' element={
                                    <AuthenticatedRoute>
                                        <AdminPastLeaveRequests />
                                    </AuthenticatedRoute>
                                } />

                                <Route path="/leave-types" element={
                                    <AuthenticatedRoute>
                                        <LeaveTypeList />
                                    </AuthenticatedRoute>
                                } />

                                <Route path="/add-leave-type" element={
                                    <AuthenticatedRoute>
                                        <LeaveTypeForm />
                                    </AuthenticatedRoute>
                                } />

                                <Route path="/edit-leave-type/:id" element={
                                    <AuthenticatedRoute>
                                        <LeaveTypeForm />
                                    </AuthenticatedRoute>
                                } />

                                <Route path="/holidays" element={
                                    <AuthenticatedRoute>
                                        <HolidayList />
                                    </AuthenticatedRoute>
                                } />

                                <Route path="/add-holiday" element={
                                    <AuthenticatedRoute>
                                        <AddHoliday />
                                    </AuthenticatedRoute>
                                } />

                                <Route path="/edit-holiday/:id" element={
                                    <AuthenticatedRoute>
                                        <EditHoliday />
                                    </AuthenticatedRoute>
                                } />

                                <Route path="/generate-payroll" element={
                                    <AuthenticatedRoute>
                                        <GeneratePayroll />
                                    </AuthenticatedRoute>
                                } />

                                <Route path="/view-payroll" element={
                                    <AuthenticatedRoute>
                                        <ViewPayroll />
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
                        </div>
                    </div>
                    {/* <FooterComponent/> */}
                </BrowserRouter>
            </AuthProvider>
        </div>
    )
}

export default Routing;
//it is a controlled component..... (see notes.txt)