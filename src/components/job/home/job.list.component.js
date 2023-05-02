import React, {Component} from 'react';
import JobItem from './job.item.component'
import {withRouter} from "../../../common/with-router";


class JobList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sortedFieldName: '',
            sort: '',
        };
    }

    handleSortChange = (fieldName, sortOrder) => {
        this.setState({ sortedFieldName: fieldName, sort: sortOrder });
    };

    render() {
        const { jobs } = this.props;
        const { sortedFieldName, sort } = this.state;

        const sortedJobs = jobs.sort((a, b) => {
            if (sort === 'ASC') {
                return a[sortedFieldName] > b[sortedFieldName] ? 1 : -1;
            } else if (sort === 'DESC') {
                return a[sortedFieldName] < b[sortedFieldName] ? 1 : -1;
            } else {
                return 0;
            }
        });

        return (
            <div>
                <div>
                    Sort by:
                    <button onClick={() => this.handleSortChange('name', 'ASC')}>
                        Job name ASC
                    </button>
                    <button onClick={() => this.handleSortChange('name', 'DESC')}>
                        Job name DESC
                    </button>
                    <button onClick={() => this.handleSortChange('salary', 'ASC')}>
                        Salary ASC
                    </button>
                    <button onClick={() => this.handleSortChange('salary', 'DESC')}>
                        Salary DESC
                    </button>
                </div>
                <div className={'jobs-list'}>
                    {sortedJobs.map((job) => (
                        <JobItem key={job.id} job={job} />
                    ))}
                </div>
            </div>
        );
    }
}

export default withRouter(JobList)
