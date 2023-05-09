import React, {useEffect, useState} from "react";
import {Link, Route, Routes, useLocation} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

import {authService} from "./services/apiServices";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import Users from "./services/user/candidate"
import {TaskComponent} from "./services/company/job/addJob";
import JobDetail from "./components/job/home/job.detail";
import Jobs from "./components/job/job-grid"
import {SidebarAdmin, SidebarCompany} from "./sidebar"

// import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";

function App() {
    const [currentUser, setCurrentUser] = useState(undefined);
    const [showModeratorBoard, setShowModeratorBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            setShowModeratorBoard(user.role.includes("COMPANY"));
            setShowAdminBoard(user.role.includes("ADMIN"));
        }

        EventBus.on("logout", () => {
            logOut();
        });

        return () => {
            EventBus.remove("logout");
        }
    }, []);

    const logOut = () => {
        authService.logout();
        setShowModeratorBoard(false);
        setShowAdminBoard(false);
        setCurrentUser(undefined);
    }

    const defaultBackground = {
        backgroundColor: '#BBBBBB',
        height: '100vh',
    };

    function useIsInDashboard(value) {
        const location = useLocation();
        return location.pathname.includes(`/dashboard/${value}`);
    }

    return (
        <div style={defaultBackground}>
            {useIsInDashboard("admin") && <SidebarAdmin/>}
            {useIsInDashboard("company") && <SidebarCompany/>}
            <div>
                <nav className="navbar navbar-expand navbar-dark bg-dark">
                    <Link to={"/"} className="navbar-brand">
                        JobHunt.IT
                    </Link>
                    <div className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to={"/home"} className="nav-link">
                                Home
                            </Link>
                        </li>

                        {showModeratorBoard && (
                            <li className="nav-item">
                                <Link to={"/dashboard/company"} className="nav-link">
                                    Company Board
                                </Link>
                            </li>
                        )}

                        {showAdminBoard && (
                            <li className="nav-item">
                                <Link to={"/dashboard/admin"} className="nav-link">
                                    Admin Board
                                </Link>
                            </li>
                        )}

                        {currentUser && (
                            <li className="nav-item">
                                <Link to={"/dashboard/user"} className="nav-link">
                                    User
                                </Link>
                            </li>
                        )}
                    </div>

                    {currentUser ? (
                        <div className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to={"/profile"} className="nav-link">
                                    {currentUser.email}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <a href="/login" className="nav-link" onClick={logOut}>
                                    LogOut
                                </a>
                            </li>
                        </div>
                    ) : (
                        <div className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to={"/login"} className="nav-link">
                                    Login
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to={"/register"} className="nav-link">
                                    Sign Up
                                </Link>
                            </li>
                        </div>
                    )}
                </nav>
            </div>
            <div className={useIsInDashboard("") ? "content-with-sidebar" : "content"}>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/dashboard/company/jobs" element={<Jobs/>}/>
                    <Route path="/job/:jobId" element={<JobDetail/>}/>
                    <Route path={"/dashboard/admin/users"} element={<Users/>}/>
                    <Route path="/task" element={<TaskComponent/>}/>
                    <Route path="/dashboard/admin/jobs" element={<Jobs/>}/>
                </Routes>
            </div>
            {/* <AuthVerify logOut={this.logOut}/> */}
        </div>
    );
}

export default App;
