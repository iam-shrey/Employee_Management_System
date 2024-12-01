import { Drawer, Sidebar, TextInput } from "flowbite-react";
import {
  HiChartPie,
  HiClipboard,
  HiCollection,
  HiInformationCircle,
  HiUserAdd,
  HiSearch,
  HiShoppingBag,
  HiUsers,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../security/AuthContext";

function SideBar({ isOpen, setIsOpen }) {

  const authContext = useAuth()
  const isAuthenticated = authContext.isAuthenticated

  let userRole = "";
  let newUser = false;
  const loggedInUser = localStorage.getItem("loggedInUserData");

  if (loggedInUser) {
    const userObject = JSON.parse(loggedInUser);

    // Parse the string into an object
    userRole = userObject.userRole
    newUser = userObject.newUser
  } else {
    console.log("No user found");
  }
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
                    {userRole === 'ADMIN' ?
                      <Sidebar.Item onClick={() => navigate("/employees")} className="cursor-pointer" icon={HiChartPie}>
                        Dashboard
                      </Sidebar.Item> :
                      <Sidebar.Item onClick={() => navigate("/welcome")} className="cursor-pointer" icon={HiChartPie}>
                        Dashboard
                      </Sidebar.Item>}
                    {userRole === 'ADMIN' && <Sidebar.Item onClick={() => navigate("/template")} className="cursor-pointer" icon={HiShoppingBag}>
                      Template Editor
                    </Sidebar.Item>}
                    <Sidebar.Item onClick={() => navigate("/employees")} className="cursor-pointer" icon={HiUsers}>
                      Employee list
                    </Sidebar.Item>
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