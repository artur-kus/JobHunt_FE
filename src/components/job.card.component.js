import React from "react";
import jobsData from "../job-data-mock.json";

export default function JobCard(props) {
    let job = props.job;

    return (
        // <div className={job.featured ? "job-card featured-job" : "job-card"}>
            <div className={"job-card"}>
            <div className="details">
                <div className="primary-content">
                    <div className="row">
                        <p className={'company-name'}>{job.company}</p>
                        {/*{job.new && <div className="highlight new">NEW! </div>}*/}
                        {/*{job.featured && <div className="highlight featured">FEATURED</div>}*/}
                    </div>
                    <h2 className={'position'}>{job.position}</h2>
                    <div className="secondary">
                        <p>{job.postedAt}</p>
                        <p>{job.contract}</p>
                        <p>{job.location}</p>
                    </div>
                </div>
                <ul className="tags">
                    {job.languages.map((language) => <li onClick={() => props.toggleLanguageFilter(language)}
                                                         key={language}>{language}</li>)}
                    {job.tools.map((tool) => <li onClick={() => props.toggleToolFilter(tool)} key={tool}>{tool}</li>)}
                </ul>
            </div>

        </div>
    )
}