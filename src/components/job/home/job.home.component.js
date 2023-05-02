import React from "react";
import {homeService} from "../../../services/apiServices"
import JobList from "./job.list.component";
import {withRouter} from "../../../common/with-router";

class JobHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
        };
    }

    componentDidMount() {
        const page = {
            sort: 'ASC',
            sortedFieldName: 'id'
        };
        homeService.findAllJobs(page)
            .then(res => {
                this.setState({jobs: res.content});
            });
    }

    render() {
        return (
            <div>
                <JobList jobs={this.state.jobs} />
            </div>
        )
    }
}

export default withRouter(JobHome)