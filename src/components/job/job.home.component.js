import React from "react";
import DashboardService from "../../services/dashboard.service";
import JobList from "./job.list.component";
import {withRouter} from "../../common/with-router";

class JobHome extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            jobs: [],
        }
    }

    componentDidMount() {
        DashboardService.findAllJobs()
            .then(res => {
                this.setState({jobs: res.data.content});
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
