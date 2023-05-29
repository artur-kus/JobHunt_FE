import React, {useEffect, useState} from 'react';
import {withRouter} from '../../../common/with-router';
import {authService, homeService, sendResponseByAccount} from '../../../services/apiServices';
import FileUploader from '../../../services/file-uploader';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SubmitMenu = (job) => {
    const [isSubmitByCv, setIsSubmitByCv] = useState(false);

    const toggleSubmitMenu = () => {
        setIsSubmitByCv(true);
    }
    const handleBack = () => {
        setIsSubmitByCv(false);
    }

    const submitByAccount = () => {
        const user = authService.getCurrentUser();
        if (user != null) {
            const defaultErrorMessage = 'Server problem, try again later';
            sendResponseByAccount(job.job.id)
                .then((response) => {
                    (response.request.status === 200)
                        ? toast.info('Submit was sent')
                        : toast.error(defaultErrorMessage)
                }).catch((error) => {
                    return toast.error(error.response.data != null ? error.response.data : defaultErrorMessage);
                });
        } else return toast.error('Please log in to reply to this job ad');
    };

    return (
        <div className="submit">
            {!isSubmitByCv && (
                <button className="button" onClick={toggleSubmitMenu}>Submit By CV</button>
            )}
            {isSubmitByCv && (
                <div className="by-cv">
                    <FileUploader jobId={job.id} onClose={handleBack}/>
                </div>
            )}
            {!isSubmitByCv && (
                <div className="by-account">
                    <button className="blue-button" onClick={submitByAccount}>Submit by Account</button>
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