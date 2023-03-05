import React, { Component } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import {SidebarAdmin} from "../sidebar";

export default class BoardAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount() {
    UserService.getAdminBoard().then(
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
      <div className="container">
        {/*<BrowserRouter>*/}
          <SidebarAdmin />
          <div className="container mt-3">
            {/*<Route exact path="/admin/dashboard" component={BoardAdmin} />*/}
          </div>
        {/*</BrowserRouter>*/}
      </div>
    );
  }
}
