import React from "react";
import JobService from "../../services/job.service";
import {Container} from "reactstrap";
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
        JobService.findAll()
            .then(res => {
                this.setState({jobs: res.data.content});
            });
    }

    render() {
        return (
            <Container fluid>
                <h1>{this.state.jobs.map(z => console.log('tutaj ' + z.id))}</h1>
                <JobList jobs={this.state.jobs} />
            </Container>
        )
    }
}

export default withRouter(JobHome)
