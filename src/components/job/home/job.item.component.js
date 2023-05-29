import React, {Component} from 'react';
import {withRouter} from "../../../common/with-router";
import {Link} from "react-router-dom";

class Job extends Component {
    constructor(props) {
        super(props);
        this.state = {
            job: {
                id: "",
                companyName: '',
                companyAddress: '',
                name: '',
                salary: {
                    salary: '',
                    minWage: '',
                    maxWage: '',
                },
                role: '',
                type: '',
                languages: []
            },
        };
    }

    componentDidMount() {
    }

    render() {
        const {job} = this.props;
        return (
            <Link to={`/job/${job.id}`}>
            <div className="job-card">
                <div className="company-info">
                    <div className="company-name">{job.companyName}</div>
                    <div className="company-address">{job.companyAddress}</div>
                </div>
                <div className="position">{job.role}</div>
                <div className="details">
                    <div className="salary">
                        {job.salary.salary != null
                            ? <div>{job.salary.salary}</div>
                            : <div>{job.salary.minWage} - {job.salary.maxWage}</div>
                        }
                    </div>
                    <div className="jobName">{job.jobName}</div>
                    <div className="type">{job.type}</div>
                </div>
                <div className="tags">
                    <div>{job.languages.join(' ')}</div>
                </div>
            </div>
            </Link>
        )
    }
}

export default withRouter(Job)
