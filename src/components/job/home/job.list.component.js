import React, {useEffect, useState} from 'react';
import JobItem from './job.item.component'
import {withRouter} from "../../../common/with-router";
import {FormControl, InputLabel, OutlinedInput, Select} from "@mui/material";
import {enumService} from "../../../services/apiServices";
import MenuItem from "@mui/material/MenuItem";
import './job-detail.css';

function JobList(props) {
    const [sortedFieldName, setSortedFieldName] = useState('');
    const [sort, setSort] = useState('');
    const [languages, setLanguages] = useState([]);
    const [jobRoles, setJobRoles] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);
    const [chooseLanguages, chooseJobRoles, chooseJobTypes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [languagesResponse, jobRolesResponse, jobTypesResponse] = await Promise.all([
                enumService.getProgrammingLanguages(),
                enumService.getJobRoles(),
                enumService.getJobType(),
            ]);
            setLanguages(languagesResponse.data);
            setJobRoles(jobRolesResponse.data);
            setJobTypes(jobTypesResponse.data);
        };
        fetchData();
    }, []);

    const MultiSelect = ({data, label}, selected) => {
        const [selectedOption, setSelectedOption] = useState([]);

        const handleChange = (event) => {
            const options = event.target.value;
            setSelectedOption(options);
            console.log(`Options selected:`, options);
            selected = options;
        };

        useEffect(() => {
            console.log('Selected options:', selectedOption);
        }, [selectedOption]);

        return (
            <FormControl variant="outlined" style={{width: 150}}>
                <InputLabel>{label}</InputLabel>
                <Select
                    multiple
                    value={selectedOption}
                    onChange={handleChange}
                    label="Label">
                    {data.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    };

    const handleSortChange = (fieldName, sortOrder) => {
        setSortedFieldName(fieldName);
        setSort(sortOrder);
    };

    const {jobs} = props;

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                Sort by:
                <button className="button" onClick={() => handleSortChange('name', 'ASC')}>
                    Job name ASC
                </button>
                <button onClick={() => handleSortChange('name', 'DESC')}>
                    Job name DESC
                </button>
                <button onClick={() => handleSortChange('salary', 'ASC')}>
                    Salary ASC
                </button>
                <button onClick={() => handleSortChange('salary', 'DESC')}>
                    Salary DESC
                </button>
                <MultiSelect data={languages} label='Languages' selected={chooseLanguages}/>
                <MultiSelect data={jobRoles} label='Roles' selected={chooseJobRoles}/>
                <MultiSelect data={jobTypes} label='Types' selected={chooseJobTypes}/>
            </div>
            <div className={'jobs-list'}>
                {sortedJobs.map((job) => (
                    <JobItem key={job.id} job={job}/>
                ))}
            </div>
        </div>
    );
}

export default withRouter(JobList);