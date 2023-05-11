import React, { useState, useEffect } from "react";
import { homeService } from "../../../services/apiServices";
import JobList from "./job.list.component";
import { withRouter } from "../../../common/with-router";

const JobHome = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const page = {
            sort: "ASC",
            sortedFieldName: "id",
        };
        homeService.findAllJobs(page).then((res) => {
            setJobs(res.content);
        });
    }, []);


    return (
        <div>
            <JobList jobs={jobs} />
        </div>
    );
};

export default withRouter(JobHome);