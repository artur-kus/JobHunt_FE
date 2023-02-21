import React, {Component} from 'react';
import JobItem from './job.item.component'
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
            <div className={'jobs-list'}>
                {this.props.jobs.map(job =>
                    <JobItem key={job.id} job={job}/>
                )}
            </div>
        )
    }
}

export default withRouter(JobList)
