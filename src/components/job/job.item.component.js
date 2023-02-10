import React, {Component} from 'react';
import {withRouter} from "../../common/with-router";

class Job extends Component {
    constructor(props) {
        super(props);
        this.state = {
            job: {
                id: '',
                name: '',
                description: '',
                salary:{
                    salary:'',
                    minWage:'',
                    maxWage:'',
                },
                role: '',
                type: '',
                languages: '',
                status: '',
                idCompany: ''
            },
        };
    }

    componentDidMount() {
        console.log('Logowanie z test:')
        console.log(this.state.jobs)
    }

    render() {
            const { job } = this.props;
            return (
                <tr key={job.id}>
                    <td>{job.name}</td>
                    <td>{job.description}</td>
                    <td>{job.salary.salary}</td>
                    <td>{job.salary.minWage} - {job.salary.maxWage}</td>
                    <td>{job.role}</td>
                    <td>{job.type}</td>
                    <td>{job.languages}</td>
                    <td>{job.status}</td>
                    <td>{job.idCompany}</td>
                </tr>
            )
    }
}

export default withRouter(Job)
