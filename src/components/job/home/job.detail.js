import React, {useEffect, useState} from 'react';
import {withRouter} from '../../../common/with-router';
import {homeService} from '../../../services/apiServices';
import FileUploader from '../../../services/file-uploader';

const SubmitMenu = (job) => {
    const [isSubmitCv, setIsSubmitCv] = useState(false);

    const toggleSubmitMenu = () => {
        setIsSubmitCv(true);
    }
    const handleBack = () => {
        setIsSubmitCv(false);
    }

    return (
        <div className="submit">
            {!isSubmitCv && (
                <button className="button" onClick={toggleSubmitMenu}>Submit By CV</button>
            )}
            {isSubmitCv && (
                <div className="by-cv">
                    <FileUploader jobId={job.id} onClose={handleBack}/>
                </div>
            )}
            {!isSubmitCv && (
                <div className="by-account">
                    <button className="blue-button">Submit by Account</button>
                </div>
            )}
        </div>
    );
}

const JobDetail = (props) => {
    const [job, setJob] = useState({
        salary: {},
        languages: [],
    });

    useEffect(() => {
        const jobId = props.router.params.jobId;
        homeService.getJobDetails(jobId).then((res) => {
            setJob(res);
        });
    }, [props.router.params.jobId]);

    const salary = job.salary.salary != null ? job.salary.salary : `${job.salary.minWage} - ${job.salary.maxWage}`;
    return (
        <div className="job-detail">
            <div className="title">{job.name}</div>
            <div className="salary">Salary: {salary}</div>
            <div>Role: {job.role}</div>
            <div>Type: {job.type}</div>
            <div className="languages">Languages: {job.languages.join(', ')}</div>

            <div style={{position: 'relative'}}>
                <div dangerouslySetInnerHTML={{__html: job.description}} style={{position: 'relative', zIndex: 0}}/>

            </div>
            <SubmitMenu job={job}/>
        </div>
    );
};

export default withRouter(JobDetail);