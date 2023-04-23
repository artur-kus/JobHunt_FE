import React, {Component} from "react";
import {Link, Route, Routes} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

import {authService} from "./services/apiServices";
import Login from "./components/login.component";
import Register from "./components/register.component";
import ThanksYouPage from "./components/thanks.for.register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardCompany from "./components/board-company.component";
import BoardAdmin from "./components/board-admin.component";
import Users from "./services/user/candidate"
import {TaskComponent} from "./services/company/job/addJob";
import JobDetail from "./components/job/job.detail";
import Example from "./components/job/job-grid"

// import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";

class App extends Component {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);

        this.state = {
            showModeratorBoard: false,
            showAdminBoard: false,
            currentUser: undefined,
        };
    }

    componentDidMount() {
        const user = authService.getCurrentUser();
        if (user) {
            this.setState({
                currentUser: user,
                showModeratorBoard: user.role.includes("COMPANY"),
                showAdminBoard: user.role.includes("ADMIN")
            });
        }

        EventBus.on("logout", () => {
            this.logOut();
        });
    }

    componentWillUnmount() {
        EventBus.remove("logout");
    }

    logOut() {
        authService.logout();
        this.setState({
            showModeratorBoard: false,
            showAdminBoard: false,
            currentUser: undefined,
        });
    }

    render() {
            const defaultBackground = {
                backgroundColor: '#BBBBBB',
                height: '100vh',
            };

        const {currentUser, showModeratorBoard, showAdminBoard} = this.state;
        return (
            <div style={defaultBackground}>
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
                                <Link to={"/company"} className="nav-link">
                                    Company Board
                                </Link>
                            </li>
                        )}

                        {showAdminBoard && (
                            <li className="nav-item">
                                <Link to={"/admin"} className="nav-link">
                                    Admin Board
                                </Link>
                            </li>
                        )}

                        {currentUser && (
                            <li className="nav-item">
                                <Link to={"/user"} className="nav-link">
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
                                <a href="/login" className="nav-link" onClick={this.logOut}>
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
                <div>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/home" element={<Home/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/thanks-for-registering" element={<ThanksYouPage/>}/>
                        <Route path="/profile" element={<Profile/>}/>
                        <Route path="/user" element={<BoardUser/>}/>
                        <Route path="/company" element={<BoardCompany/>}/>
                        <Route path="/job/:jobId" element={<JobDetail />} />
                        <Route path={"/admin/users"} element={<Users/>}/>
                        <Route path="/admin" element={<BoardAdmin/>}/>
                        <Route path="/task" element={<TaskComponent/>}/>
                        <Route path="/dashboard/admin/jobs" element={<Example/>}/>
                    </Routes>
                </div>

                {/* <AuthVerify logOut={this.logOut}/> */}
            </div>
        );
    }
}

export default App;
