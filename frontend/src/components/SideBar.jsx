import { Drawer, Sidebar, TextInput } from "flowbite-react";
import {
  HiChartPie,
  HiClipboard,
  HiCollection,
  HiInformationCircle,
  HiUserAdd,
  HiSearch,
  HiUsers,
  HiBell,
  HiCog,
  HiMail,
  HiIdentification,
  HiDuplicate,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../security/AuthContext";

function SideBar({ isOpen, setIsOpen }) {

  const authContext = useAuth()
  const isAuthenticated = authContext.isAuthenticated
  const userRole = authContext.role;
  const newUser = authContext.newUser;

  const handleClose = () => setIsOpen(false);
  const navigate = useNavigate();
  return (
    <>{isAuthenticated && !newUser &&
      <Drawer open={isOpen} onClose={handleClose} backdrop={false} className="mt-[68px] top-0 fixed bg-amber-100">
        <Drawer.Header title="MENU" titleIcon={() => <></>} onClick={() => setIsOpen(!isOpen)} />
        <Drawer.Items>
          <Sidebar
            aria-label="Sidebar with multi-level dropdown example"
            className="[&>div]:bg-transparent [&>div]:p-0"
          >
            <div className="flex h-full flex-col justify-between py-2">
              <div>
                <form className="pb-3 md:hidden">
                  <TextInput icon={HiSearch} type="search" placeholder="Search" required size={32} />
                </form>
                <Sidebar.Items>
                  <Sidebar.ItemGroup>
                    <Sidebar.Item onClick={() => navigate("/")} className="cursor-pointer" icon={HiChartPie}>
                      Dashboard
                    </Sidebar.Item>
                    {userRole === 'ADMIN' ? <Sidebar.Item onClick={() => navigate("/employees")} className="cursor-pointer" icon={HiUsers}>
                      Employee list
                    </Sidebar.Item> :
                      <Sidebar.Item onClick={() => navigate("/user/employees")} className="cursor-pointer" icon={HiUsers}>
                        Employee list
                      </Sidebar.Item>}
                    {userRole === 'ADMIN' && <Sidebar.Collapse icon={HiIdentification} label="Attendance/Leave" className="m-0">
                      <Sidebar.Item onClick={() => navigate("/employees/attendance")} className="cursor-pointer" icon={HiCollection}>Attendance Records</Sidebar.Item>
                      <Sidebar.Item onClick={() => navigate("/attendance/settings")} className="cursor-pointer" icon={HiCog}>Attendance Settings</Sidebar.Item>
                      <Sidebar.Item onClick={() => navigate("/employees/leave-requests")} className="cursor-pointer" icon={HiBell}>Leave Requests</Sidebar.Item>
                      <Sidebar.Item onClick={() => navigate("/leave-types")} className="cursor-pointer" icon={HiDuplicate}>Leave Types</Sidebar.Item>
                      <Sidebar.Item onClick={() => navigate("/holidays")} className="cursor-pointer" icon={HiDuplicate}>Holidays</Sidebar.Item>
                    </Sidebar.Collapse>}
                    {userRole === 'ADMIN' && <Sidebar.Collapse icon={HiIdentification} label="Payroll Management" className="m-0">
                      <Sidebar.Item onClick={() => navigate("/generate-payroll")} className="cursor-pointer" icon={HiCollection}>Generate Payroll</Sidebar.Item>
                      <Sidebar.Item onClick={() => navigate("/view-payroll")} className="cursor-pointer" icon={HiCog}>View Payroll</Sidebar.Item>
                    </Sidebar.Collapse>}
                    {userRole === 'ADMIN' && <Sidebar.Item onClick={() => navigate("/template")} className="cursor-pointer" icon={HiMail}>
                      Offer Template Editor
                    </Sidebar.Item>}
                    {userRole === 'ADMIN' && <Sidebar.Item onClick={() => navigate("/register")} className="cursor-pointer" icon={HiUserAdd}>
                      Register New Employee
                    </Sidebar.Item>}
                  </Sidebar.ItemGroup>
                  <Sidebar.ItemGroup>
                    <Sidebar.Item href="https://github.com/themesberg/flowbite-react/" icon={HiClipboard}>
                      Docs
                    </Sidebar.Item>
                    <Sidebar.Item href="https://flowbite-react.com/" icon={HiCollection}>
                      Components
                    </Sidebar.Item>
                    <Sidebar.Item href="https://github.com/themesberg/flowbite-react/issues" icon={HiInformationCircle}>
                      Help
                    </Sidebar.Item>
                  </Sidebar.ItemGroup>
                </Sidebar.Items>
              </div>
            </div>
          </Sidebar>
        </Drawer.Items>
      </Drawer>}
    </>
  );
}

export default SideBar;