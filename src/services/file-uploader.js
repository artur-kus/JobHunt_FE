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

    return (
            <form onSubmit={sendCv} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Arial, sans-serif' }}>
                <label style={{ margin: '10px 0' }}>Respond to this job advertisement by sending your CV!</label>
                <label>
                    Email:
                    <input type="email" value={email} onChange={handleEmailChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }} />
                </label>
                <br />
                <label>
                    File:
                    <input type="file" onChange={handleFileChange} style={{ marginTop: '10px' }} />
                </label>
                <br />
                <button
                    type="submit"
                    style={{
                        marginTop: '20px',
                        backgroundColor: '#4CAF50',
                        border: 'none',
                        color: 'white',
                        padding: '10px 20px',
                        textAlign: 'center',
                        textDecoration: 'none',
                        display: 'inline-block',
                        fontSize: '16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease-in-out',
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#3e8e41';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#4CAF50';
                    }}
                >
                    Send CV
                </button>
            </form>
    );
}

export default FileUploader;