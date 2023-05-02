import React, {Component} from "react";

import {userService} from "../services/apiServices"
import EventBus from "../common/EventBus";

export default class BoardAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: ""
        };
    }

    componentDidMount() {
        userService.getAdminBoard().then(
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
                <div className="container">
                    {/*<BrowserRouter>*/}
                    <div className="container mt-3">
                        {/*<Route exact path="/admin/dashboard" component={BoardAdmin} />*/}
                    </div>
                    {/*</BrowserRouter>*/}
                </div>
            </div>
        );
    }
}
