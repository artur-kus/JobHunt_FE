import React, { Component } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import {ContextMenu, ContextMenuTrigger, MenuItem} from "react-contextmenu";

export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount() {
    UserService.getUserBoard().then(
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

  handleClick(e, data) {
    console.log(data.foo);
  }

  render() {
    return (
        <div className="container">
          <header className="jumbotron">
            <h3>{this.state.content}</h3>
            <div>
              {/* NOTICE: id must be unique between EVERY <ContextMenuTrigger> and <ContextMenu> pair */}
              {/* NOTICE: inside the pair, <ContextMenuTrigger> and <ContextMenu> must have the same id */}

              <ContextMenuTrigger id="same_unique_identifier">
                <div className="well">Right click to see the menu</div>
              </ContextMenuTrigger>

              <ContextMenu id="same_unique_identifier">
                <MenuItem data={{foo: 'bar'}} onClick={this.handleClick}>
                  ContextMenu Item 1
                </MenuItem>
                <MenuItem data={{foo: 'bar'}} onClick={this.handleClick}>
                  ContextMenu Item 2
                </MenuItem>
                <MenuItem divider />
                <MenuItem data={{foo: 'bar'}} onClick={this.handleClick}>
                  ContextMenu Item 3
                </MenuItem>
              </ContextMenu>

            </div>
          </header>
        </div>
    );
  }
}
