import React, { Component } from "react";
import {authService} from "../services/apiServices";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { email: "" }
    };
  }

  componentDidMount() {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })
  }

  render() {
    // if (this.state.redirect) {
    //   return <Navigate to={this.state.redirect} />
    // }
    console.log(this.state)
    const { currentUser } = this.state;
    return (
      <div className="container">
        {(this.state.userReady) ?
        <div>
        <header className="jumbotron">
          <h3>
            <strong>{currentUser.email}</strong> Profile
          </h3>
        </header>
        <p>
          <strong>Token:</strong>{" "}
          {currentUser.token}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          {currentUser.email}
        </p>
        <strong>Authorities:</strong>
        <ul>
          {currentUser.role}
        </ul>
      </div>: null}
      </div>
    );
  }
}
