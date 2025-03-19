import React from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Certificate = ({ data, onGoBack }) => {

  const today = new Date();
    
  // Format: "Wednesday, February 7, 2025"
  const formattedDate = today.toLocaleDateString("en-US", {
      month: "long",   // Full month name (January, February, etc.)
      day: "numeric",  // Day of the month (1, 2, 3, etc.)
      year: "numeric"  // Full year (2025, etc.)
  });


    
  return (
    <div className="certificate-container">
      {!data || !data.certificate_details ? (
        <p>No certificate data available.</p>
      ) : (
        <>
          <div className="certificate-header">
            <div className="verified-badge">
                <button className="btn-bg2" onClick={onGoBack}><ArrowBackIcon /> Back</button>

             <p></p>


            </div>
            <h1 className="status"
              style={{
                color: data.status === "valid" ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {data.status === "valid" ? "✔ Verified" : "Invalid"}
            </h1>
          </div>
          <div className="certificate-body">
            <p>
              Certificate Number: <span>{data.certificate_details.certificate_id}</span>
            </p>
            <p>
              Certificate Title: <span>{data.certificate_details.certificate_title}</span>
            </p>
            <p>
              Issued Number: <span>{data.certificate_details.issuedNumber}</span>
            </p>
            <p>
              Date of Issue: <span>{data.certificate_details.issue_date}</span>
            </p>
            <p>
              Issuing Body: <span>{data.certificate_details.organization_name}</span>
            </p>

            <h6 className="ahh-h6">
              Verification date: {formattedDate}<br></br>
              <a href="www.cmvp.net">www.cmvp.net</a>
            </h6>
           
          </div>
        </>
      )}
    </div>
  );
};

export default Certificate;
