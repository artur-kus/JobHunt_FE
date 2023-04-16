import React from 'react';
import {withRouter} from "../../common/with-router";
import {getJobDetails} from "../../services/job.service";
import FileUploader from "../../services/file-uploader";
import "./job-detail.css";

class JobDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            job: {
                salary: {},
                languages: [],
            },
        };
    }

    componentDidMount() {
        const jobId = this.props.router.params.jobId;
        getJobDetails(jobId).then((res) => {
            this.setState({job: res});
        });
    }

    render() {
        const {job} = this.state;
        const salary = job.salary.salary != null ? job.salary.salary : `${job.salary.minWage} - ${job.salary.maxWage}`;
        return (
            <div className="job-detail">
                {/*<div>ID: {job.id}</div>*/}
                <div className="title">{job.name}</div>
                <div className="description">{job.description}</div>
                <div className="salary">Salary: {salary}</div>
                <div>Role: {job.role}</div>
                <div>Type: {job.type}</div>
                <div className="languages">Languages: {job.languages.join(', ')}</div>
                {/*<div>Status: {job.status}</div>*/}
                <FileUploader jobId={job.id}/>
            </div>
        );
    }
}

export default withRouter(JobDetail);