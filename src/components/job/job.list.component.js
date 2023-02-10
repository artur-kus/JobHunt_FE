import React, {Component} from 'react';
import JobItem from './job.item.component'
import {Container} from "reactstrap";
import {withRouter} from "../../common/with-router";


class JobList extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        console.log("test z listy")
        console.log(this.state.jobs)
    }

    render() {
        return (
            <Container fluid>
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Salary</th>
                        <th>Widełki</th>
                        <th>Role</th>
                        <th>Type</th>
                        <th>Languages</th>
                        <th>Status</th>
                        <th>Company ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.jobs.map(job =>
                        <JobItem key={job.id} job={job} />
                    )}
                    </tbody>
                </table>
            </Container>
        )
    }
}

export default withRouter(JobList)
