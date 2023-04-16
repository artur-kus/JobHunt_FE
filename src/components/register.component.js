import React, {Component} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import {authService} from "../services/apiServices";
import {enumService} from "../services/apiServices";
import ThanksYouPage from "./thanks.for.register.component"
import {withRouter} from "../common/with-router";
import CompanyForm from "./register-company";

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const vemail = value => {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!value.match(validRegex)) {
        return (
            <p className="alert alert-danger" role="alert">
                The email should contain at least:
                One or more uppercase and lowercase letters (A-Z and a-z)
                One or more Numeric characters (0-9)
                One or more Special characters
            </p>
        );
    }
};

const vpassword = password => {
    var pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!pattern.test(password)) {
        return (
            <div className="alert alert-danger" role="alert">
                Password must be at least 8 characters long and must contain at least one lowercase letter, one
                uppercase letter, one number, and one special character (@$!%*?&)
            </div>
        )
    }
    // if (value.length < 8 || value.length > 40) {
    //     return (
    //         <div className="alert alert-danger" role="alert">
    //             The password must be between 6 and 40 characters.
    //         </div>
    //     );
    // }
};

class Register extends Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.state = {
            email: "",
            password: "",
            selectedRole: '',
            rolesList: [],
            successful: false,
            message: ""
        };
    }

    componentDidMount() {
        enumService.getUserRoles().then(res => {
            this.setState({
                rolesList: res.data,
                selectedRole: res.data[0]
            });
        })

    }

    handleChange = (event) => {
        this.setState({selectedRole: event.target.value});
    }

    onChangeEmail(e) {
        this.setState({email: e.target.value});
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    handleRegister(e) {
        e.preventDefault();
        this.setState({
            message: "",
            successful: false
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            authService.register(
                this.state.email,
                this.state.password,
                this.state.selectedRole
            ).then(
                response => {
                    this.setState({
                        message: response.data.message,
                        successful: true
                    });
                    this.props.history.redirect(ThanksYouPage);
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    this.setState({
                        successful: false,
                        message: resMessage
                    });
                }
            );
        }
    }

    render() {
        return (
            <div className="col-md-12">
                <div className="card card-container">
                    <img
                        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                        alt="profile-img"
                        className="profile-img-card"
                    />

                    <Form
                        onSubmit={this.handleRegister}
                        ref={c => {
                            this.form = c;
                        }}
                    >
                        {!this.state.successful && (
                            <div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="email"
                                        value={this.state.email}
                                        onChange={this.onChangeEmail}
                                        validations={[vemail]}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <Input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.onChangePassword}
                                        validations={[required, vpassword]}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="role">Select your role: </label>
                                    <select
                                        name="role"
                                        className="form-control"
                                        value={this.state.selectedRole}
                                        onChange={this.handleChange}>
                                        {this.state.rolesList.map(role => <option key={role}
                                                                                  value={role}>{role}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-primary btn-block">Sign Up</button>
                                </div>
                            </div>
                        )}

                        <div className={"form-group"}>
                            <CompanyForm selectedRole={this.state.selectedRole} />
                        </div>


                        {this.state.message && (
                            <div className="form-group">
                                <div
                                    className={
                                        this.state.successful
                                            ? "alert alert-success"
                                            : "alert alert-danger"
                                    }
                                    role="alert"
                                >
                                    {this.state.message}
                                </div>
                            </div>
                        )}
                        <CheckButton
                            style={{display: "none"}}
                            ref={c => {
                                this.checkBtn = c;
                            }}
                        />
                    </Form>
                </div>
            </div>
        );
    }
}

export default withRouter(Register);
