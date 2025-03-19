import React, { useState, useEffect, useContext } from "react";
import FlashMessage from '../assets/FlashMessage'; 
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import config from "../config";

import PageFixeImg from '../assets/Img/fixed_bg.png';
import MarkedImg from '../assets/Img/marked.svg';

import CompLogo from '../assets/Img/comp_logo.png';

import Certificate from './Certificate';




import { Link, useNavigate } from "react-router-dom";



function Verification() {

  const [backgroundImage, setBackgroundImage] = useState(null); // State to store background image URL


  const currentYear = new Date().getFullYear(); // Get the current year


  const { orgID } = useParams(); // Get orgId from URL

  const [responseData, setResponseData] = useState(null); // New state for API response

 
  const [organizationData, setOrganizationData] = useState(null); // For organization data
  const [organizationDatalogo, setOrganizationDataLogo] = useState(null); // For organization data

  
  const [organizationData_name, setOrganizationData_name] = useState(null); // For organization data
  const [loading, setLoading] = useState(false); // State for loader
  const [certificateNumber, setCertificateNumber] = useState('');
  const [issuedDate, setIssuedDate] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");  // New state for flash message

  useEffect(() => {
    const fetchBackgroundImage = async () => {
        try {
            const response = await fetch(
                `${config.API_BASE_URL}/api/accounts/auth/organization/background_image/selected/${orgID}/`
            );
            const data = await response.json();

            if (response.ok) {
                // Set the background image URL
                const backgroundImageUrl = data.background_image;
                setBackgroundImage(backgroundImageUrl); // Save the background image URL
            } else {
                console.error("Error fetching background image:", data.message);
            }
        } catch (error) {
            console.error("Error fetching background image:", error);
        }
    };

    fetchBackgroundImage();
}, [orgID]);



const handleFormSubmit = async (event) => {
  event.preventDefault();

  if (certificateNumber.trim() && issuedDate) {  // Trim spaces before validation
      setLoading(true); // Start the loader
      try {
          // Format issued_date to 'YYYY-MM-DD'
          const formattedDate = issuedDate.getFullYear() + '-' + 
                                String(issuedDate.getMonth() + 1).padStart(2, '0') + '-' + 
                                String(issuedDate.getDate()).padStart(2, '0');

          // Call API to verify the certificate
          const response = await fetch(`${config.API_BASE_URL}/api/certificates/verify-certificate/${orgID}/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  certificate_id: certificateNumber.trim(), // Trim spaces before sending
                  issued_date: formattedDate,
              }),
          });

          const data = await response.json();
          if (response.ok) {
              setResponseData(data);
              setShowResult(true);
          } else {
              console.error('Verification Failed :', data.message);
              setErrorMessage(data.message || 'An error occurred');
          }
      } catch (error) {
          console.error('Error verifying certificate:', error);
          setErrorMessage('Error verifying certificate: ' + error.message);
      } finally {
          setLoading(false); // Stop the loader
      }
  }
};



// Fetch organization data
useEffect(() => {
  const fetchOrganizationData = async () => {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/api/accounts/auth/organizations/${orgID}/`
      );
      const data = await response.json();
      if (response.ok) {
        setOrganizationData(data);
        setOrganizationData_name(data.name);
        setOrganizationDataLogo(data.logo)
        
      } else {
        console.error("Error fetching organization data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching organization data:", error);
    }
  };

  fetchOrganizationData();
}, [orgID]);


const handleGoBack = () => {
  setCertificateNumber('');
  setIssuedDate(null);
  setShowResult(false); // Remove the Showresult class
};





  const handleCloseFlashMessage = () => {
    setErrorMessage(null);
  };
  



  return (
    <div className={`Verification-Landing-page ${showResult ? 'Showresult' : ''}`}>
     <div className='Verification_page'>

     <img 
            src={`${organizationDatalogo}`} 
            alt="CEO" 

            className="oo_comp_Logo"
        />

      <div className="Fixed_BG_OO">

         {backgroundImage ? (
                <img src={`${config.API_BASE_URL}${backgroundImage}`} className="Fixed-ImgBg" alt="Background" />
            ) : (
                <img src={PageFixeImg} className="Fixed-ImgBg" alt="Fallback Background" />
            )}

      </div>

      <div className="Comp_Intro_Sec">
        <div className="COm_oopal">
      
          <h2 className="big-text hggga-text">{organizationData_name} </h2>
          <h4 className="ajuh-h4">Verification Portal</h4>
        </div>

        <div className="seargs_sec">
           <form className="Verification_Search_Form" onSubmit={handleFormSubmit}>
            <div className="HGa_Grid">
              <div className="V_Form_Input">
                <label>Certificate number</label>
                <input 
                  type="text" 
                  placeholder="Enter certificate number" 
                  value={certificateNumber}
                  onChange={(e) => setCertificateNumber(e.target.value.replace(/\s/g, ""))} // Remove spaces dynamically
                  onKeyDown={(e) => e.key === " " && e.preventDefault()} // Prevent space key
                  required
              />
              </div>
              

              <div className="V_Form_Input">
                <label>Enter date</label>
                   <DatePicker
                    selected={issuedDate}
                    onChange={(date) => setIssuedDate(date)}
                     placeholderText="Issued date"
                     dateFormat="yyyy/MM/dd"
                     className="DatePicker_Input"
                     showYearDropdown
                     showMonthDropdown
                    dropdownMode="select"
                    required
                 />
           </div>

           </div>

           {errorMessage && (
          <FlashMessage
            message={errorMessage}
            type="error"
            onClose={handleCloseFlashMessage}
          />
        )}

           <div className="V_Form_Input">
              <button type="submit" disabled={loading} className="btn-bg-oo" >
                    {loading ? "Verifying..." : "Verify certificate"}
                 </button>
              </div>

           </form>
        </div>

        <p className="italic-p">... your trusted platform for verifying  issued certificates.</p>


      </div>
     </div>


     <section className="Search_Reasult_Sec">
          
          <div className="site-container">

          {showResult && responseData && (
            <Certificate data={responseData} onGoBack={handleGoBack} />
          )}

         </div>
     </section>


          <footer className="very_footer">
          <p>Powered by <Link to="/">cmvp.net</Link></p>
          <span>© {currentYear}</span>
          </footer>

     </div>
  )
}

export default Verification
