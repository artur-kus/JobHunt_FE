import React, {Component} from 'react';
import {withRouter} from "../../common/with-router";

class Job extends Component {
    constructor(props) {
        super(props);
        this.state = {
            job: {
                companyName: '',
                companyAddress: '',
                jobName: '',
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
            <div className="job-card">
                <div className="company-info">
                    <div className="company-name">{job.companyName}</div>
                    <div className="company-address">{job.companyAddress}</div>
                </div>
                <div className="position">{job.jobName}</div>
                <div className="details">
                    <div className="salary">
                        {job.salary.salary != null
                            ? <div>{job.salary.salary}</div>
                            : <div>{job.salary.minWage} - {job.salary.maxWage}</div>
                        }
                    </div>
                    <div className="role">{job.role}</div>
                    <div className="type">{job.type}</div>
                </div>
                <div className="tags">
                    <div>{job.languages.join(' ')}</div>
                </div>
            </div>
        )
    }
}

export default withRouter(Job)
