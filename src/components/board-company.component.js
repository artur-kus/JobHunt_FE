import React, {Component} from "react";

import {userService} from "../services/apiServices"
import EventBus from "../common/EventBus";
// import AddJob from "../services/company/job/addJob"

export default class BoardCompany extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: ""
        };
    }

    componentDidMount() {
        userService.getCompanyBoard().then(
            response => {
                this.setState({
                    content: response.data
                });
            },
            error => {
                this.setState({
                    content:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString()
                });

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
        );
    }

    render() {
        return (
            <div>
                <div className="nav-menu">
                    {/*<BrowserRouter>*/}
                    {/*<div className="container mt-3">*/}
                    {/*    <Route exact path="/" component={Home} />*/}
                    {/*    <Route exact path="/home" component={Home} />*/}
                    {/*    <Route exact path="/company" component={CompanyBoard} />*/}
                    {/*    <Route exact path="/admin" component={AdminBoard} />*/}
                    {/*    <Route exact path="/user" component={UserBoard} />*/}
                    {/*    <Route exact path="/login" component={Login} />*/}
                    {/*    <Route exact path="/register" component={Register} />*/}
                    {/*    <Route exact path="/profile" component={Profile} />*/}
                    {/*</div>*/}
                {/*</BrowserRouter>*/}
                );
                </div>
                <div className="container">
                    {/*<header className="jumbotron">*/}
                    {/*    <h3>{this.state.content}</h3>*/}
                    {/*</header>*/}
                    {/*<AddJob/>*/}
                </div>
            </div>
        );
    }
}
