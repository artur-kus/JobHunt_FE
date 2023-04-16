import React, { useState } from "react";

function CompanyForm(props) {
    const selectedRole = props.selectedRole;
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [nip, setNip] = useState("");
    const [street, setStreet] = useState("");
    const [buildingNumber, setBuildingNumber] = useState("");
    const [city, setCity] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [countryCode, setCountryCode] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (selectedRole === "COMPANY") {
            const response = await fetch("http://localhost:8010/api/companies/create", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    description,
                    nip,
                    address: {
                        street,
                        buildingNumber,
                        city,
                        zipCode,
                        countryCode
                    }
                })
            });
            const data = await response.json();
            console.log(data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {selectedRole === "COMPANY" && (
                <div>
                    <div>
                        <label>Name:</label>
                        <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
                    </div>
                    <div>
                        <label>Description:</label>
                        <input type="text" value={description} onChange={(event) => setDescription(event.target.value)} />
                    </div>
                    <div>
                        <label>NIP:</label>
                        <input type="text" value={nip} onChange={(event) => setNip(event.target.value)} />
                    </div>
                    <div>
                        <label>Address:</label>
                        <div>
                            <label>Street:</label>
                            <input type="text" value={street} onChange={(event) => setStreet(event.target.value)} />
                        </div>
                        <div>
                            <label>Building number:</label>
                            <input type="text" value={buildingNumber} onChange={(event) => setBuildingNumber(event.target.value)} />
                        </div>
                        <div>
                            <label>City:</label>
                            <input type="text" value={city} onChange={(event) => setCity(event.target.value)} />
                        </div>
                        <div>
                            <label>ZIP code:</label>
                            <input type="text" value={zipCode} onChange={(event) => setZipCode(event.target.value)} />
                        </div>
                        <div>
                            <label>Country code:</label>
                            <input type="text" value={countryCode} onChange={(event) => setCountryCode(event.target.value)} />
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="btn btn-primary btn-block" style={{
                            marginTop: '40px'}}>Sign Up</button>
                    </div>
                </div>
            )}
        </form>
    );
}

export default CompanyForm;
