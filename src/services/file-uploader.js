import React, {useState} from 'react';
import axios from 'axios';

function FileUploader(props) {
    const [email, setEmail] = useState(null);
    const [file, setFile] = useState(null);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const sendCv = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        console.log(props.jobId)
        console.log(props.email)
        axios.post('http://localhost:8010/api/file/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            params: {
                jobId: props.jobId,
                email: email
            }
        })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleClose = () => {
        props.onClose();
    };

    return (
        <form onSubmit={sendCv}
              style={{display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Arial, sans-serif'}}>
            <label style={{margin: '10px 0'}}>Respond to this job advertisement by sending your CV!</label>
            <label>
                Email:
                <input type="email" value={email} onChange={handleEmailChange}
                       style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px'}}/>
            </label>
            <br/>
            <label>
                File:
                <input type="file" onChange={handleFileChange} style={{marginTop: '10px'}}/>
            </label>
            <br/>
            <div>
                <button className={"green-button"}>Send CV</button>
                <button className="button red-button" onClick={handleClose}>Back</button>
            </div>
        </form>
    );
}

export default FileUploader;