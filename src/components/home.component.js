import React, {Component} from "react";
import Job from "./job/home/job.home.component";
import JobCard from "./job/home/job.card.js.css"
import {userService} from "../services/apiServices"

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: ""
        };
    }

    componentDidMount() {
        userService.getPublicContent().then(
            response => {
                this.setState({
                    content: response.data
                });
            },
            error => {
                this.setState({
                    content:
                        (error.response && error.response.data) ||
                        error.message ||
                        error.toString()
                });
            }
        );
    }

    render() {
        return (
            <div className={"jumbotron default-background"}>
                <div className="container">
                    {/*<header className="jumbotron">*/}
                    {/*<h3>{this.state.content}</h3>*/}
                    <div className={JobCard.jobCard}>
                        <Job/>
                    </div>
                    {/*</header>*/}
                </div>
            </div>
        );
    }
}
