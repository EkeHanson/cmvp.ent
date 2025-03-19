import React, { useState, useEffect } from "react";
import axios from "axios";
import './Css/Dash.css';

import CopyIcon from './Img/copyicon.svg';
import AngleDownIcon from './Img/angle-down.svg';
import ArrowRightLit from './Img/arrow-right-lit.svg';
import DropArrow1 from './Img/droparrow1.svg';
import DropArrow2 from './Img/droparrow2.svg';
import ArrowLeft from './Img/arrow-left.svg';
import PhotoIcon from './Img/photo-icon.svg';
import config from '../../config.jsx';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

import FlashMessage from "../FlashMessage/FlashMessage.jsx";

export default function PortalPage() {

    
    useEffect(() => {
        if (!sessionStorage.getItem("hasReloaded")) {
        sessionStorage.setItem("hasReloaded", "true");
        window.location.reload();
        }
    }, []);

    const organizationID =  sessionStorage.getItem("authUserId");
    const organizationName =  sessionStorage.getItem("authName");
    const organizationSubscribed =  sessionStorage.getItem("is_subscribed");

    const [flash, setFlash] = useState(null);

    const showMessage = (message, type) => {
      setFlash({ message, type });
    };

    const [numDailyCertificateUpload, setNumDailyCertificateUpload] = useState(0); // State to store num_daily_certificate_upload
    const [uploadedCount, setUploadedCount] = useState(0);
    const [deletedCount, setDeletedCount] = useState(0);
    const [copyMessage, setCopyMessage] = useState('Copy verification Url');
    const [imagePreview, setImagePreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isCertificateSectionVisible, setIsCertificateSectionVisible] = useState(false);
    const [isUploadEnvHidden, setIsUploadEnvHidden] = useState(false);
    const [isUploadBoxTogglerActive, setIsUploadBoxTogglerActive] = useState(false);
    const [isAddCertCartiVisible, setIsAddCertCartiVisible] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    
    const [isLoading1, setIsLoading1] = useState(false);

    const [categories1, setCategories1] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
              
    const [certificateData, setCertificateData] = useState({
        
        organization_id: organizationID,
        certificate_category: "",
        certificate_id: "",
        certificate_title: "",
        type: "",
        client_name: "",
        dateOfIssue: "",
        issuedNumber: "",
        examination_type: "",
        issuedBy: ""
    });


    useEffect(() => {
        // Check if the user is logged in and fetch subscription details
        const fetchSubscriptionDetails = async () => {
            const authToken = sessionStorage.getItem("authToken");
            const authUserId = sessionStorage.getItem("authUserId");
    
            if (authToken && authUserId && organizationSubscribed) {
                try {
                    const response = await fetch(`${config.API_BASE_URL}/api/subscription/auth/api/user-subscriptions/active/?user=${authUserId}/`, {
                    
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${authToken}`,
                        },
                    });
    
                    if (!response.ok) {
                        throw new Error("Failed to fetch subscription details");
                    }
    
                    const data = await response.json();
                    //localStorage.setItem("subscriptionDetails", JSON.stringify(data)); // Store subscription data in local storage
                   //console.log("Subscription Details: ", data);

                    setNumDailyCertificateUpload(data.allowed_num_0f_cert_upload)
    
                } catch (error) {
                    
                    console.error("Error fetching subscription details:", error);
                }
            }
            setNumDailyCertificateUpload(localStorage.getItem("numDailyCertificateUpload"))
        };
    
        fetchSubscriptionDetails();
    }, []); // Empty dependency array, runs on component mount
    
    useEffect(() => {
        // Fetch the uploaded certificates count
        const fetchUploadedCertificates = async () => {
            if (organizationID) {
            try {
                const response = await axios.get(`${config.API_BASE_URL}/api/certificates/organization/${organizationID}/`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                
                setUploadedCount(response.data.count);
            } catch (error) {
                console.error("Error fetching uploaded certificates count:", error);
            }
        }
        };

        

        // Fetch the deleted certificates count
        const fetchDeletedCertificates = async () => {
            if (organizationID) {
            try {
                const response = await axios.get(`${config.API_BASE_URL}/api/certificates/soft-deleted-certificates/${organizationID}/`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                //console.log(response.data); // Log the response structure
                setDeletedCount(response.data.results.length); // Update based on correct structure
            } catch (error) {
                console.error("Error fetching deleted certificates count:", error);
            }
        }
        };

        fetchUploadedCertificates();
        fetchDeletedCertificates();
    }, []);

    const handleCopy = () => {
        const copyText = document.getElementById("portalUrl");
        copyText.select();
        document.execCommand("copy");

        setCopyMessage('Copied!');
        setTimeout(() => setCopyMessage('Copy portal Url'), 2000);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        // File size validation: 2MB = 2 * 1024 * 1024 bytes
        const maxSizeInBytes = 2 * 1024 * 1024;
        if (file && file.size > maxSizeInBytes) {
            showMessage("File size should not exceed 2MB.", "failure");
            return;
        }
    
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDragEnter = () => {
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const triggerFileInput = () => {
        document.getElementById('fileInput').click();
    };

    const handleUploadButtonClick = () => {
        setIsCertificateSectionVisible(true);
    };

    const handleCloseButtonClick = () => {
        setIsCertificateSectionVisible(false);
    };

    const toggleUploadEnvVisibility = () => {
        setIsUploadEnvHidden(!isUploadEnvHidden);
        setIsUploadBoxTogglerActive(!isUploadBoxTogglerActive);
    };

    const handleChange = (event) => {
        setCategoryName(event.target.value);

        
    };

    const showAddCertCarti = () => {
        setIsAddCertCartiVisible(true);
    };

    const hideAddCertCarti = () => {
        window.location.reload();
        setIsAddCertCartiVisible(false);
        setCategoryName('');
    };


    const handleInputChange = (event) => {
        const { name, value } = event.target;
    
        if (name === "certificate_category") {
            setSelectedCategory(value); // Update selected category independently
        } else {
            setCertificateData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };
    
   
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        // console.log('selectedCategory:', selectedCategory); // Log the selectedCategory value
    
        if (!selectedCategory) {
           // alert("Please select a certificate category.");

            showMessage("Please select a certificate category.", "failure")

            setLoading(false);
            return; // Prevent form submission
        }
        const formData = new FormData();
        formData.append("organization", certificateData.organization_id); 


        formData.append("certificate_category", selectedCategory); 
        formData.append("certificate_id", certificateData.number);
        formData.append("client_name", certificateData.client_name);
        formData.append("issue_date", certificateData.dateOfIssue); 

        formData.append("examination_type", certificateData.examination_type); // Ensure this line is present
        formData.append("issuedNumber", certificateData.issuedNumber); // Ensure this line is present

        formData.append("examination_type", certificateData.examination_type); // Ensure this line is present
        formData.append("issuedNumber", certificateData.issuedNumber); // Ensure this line is present
        

        formData.append("certificate_title", certificateData.certificate_title); // Ensure this line is present

        formData.append("issuedBy", certificateData.issuedBy); 
        
        formData.append("expiry_date", "");  // Optional
        if (selectedFile) {
            formData.append("pdf_file", selectedFile);
        }

    
        try {
            const response = await axios.post(`${config.API_BASE_URL}/api/certificates/create/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                }
            });
            // alert("Certificate created successfully!");

            showMessage("Certificate created successfully!", "success")
            
            window.location.reload();
        } catch (error) {
            // console.error("Error creating certificate:", error);
            // alert("Failed to create certificate. Please try again.");
                    // Extract and display the specific error message
            const errorMessage = error.response?.data?.error || "Please change CertificateID to be unique or select the  category";
            console.error("Error creating certificate:", error);
            // alert(errorMessage);
            showMessage(errorMessage, "failure")

        } finally {
            setLoading(false);
        }
    };




  
    const handleChange1 = (event) => {
      setCategoryName(event.target.value);
    };
  

    const handleSubmit1 = async (event) => {
        event.preventDefault();
        setIsLoading1(true);
    
        try {
          const response = await axios.post(`${config.API_BASE_URL}/api/certificates/categories/`, {
            name: categoryName,
            organization: organizationID
          });
    
          // Handle successful response (e.g., show success message)
         // console.log('Category created successfully:', response.data);

          setCategoryName(''); 
          setIsLoading1(false); 
          // alert("Certificate Category Created successfully")
          showMessage("Certificate Category Created successfully", "sucecess")

        } catch (error) {
          // Handle error (e.g., display error message)
          console.error('Error creating category:', error);
          setIsLoading1(false); 
        }
      };

      useEffect(() => {
        const fetchData = async () => {
            if (organizationID) {
          try {
            const response = await axios.get(`${config.API_BASE_URL}/api/certificates/certificateCategory/${organizationID}`);
            setCategories1(response.data);
          } catch (error) {
            console.error('Error fetching categories:', error);
          }
        }
        };
    
        fetchData();
      }, []);




    return (
        <div className="PortalPage">
            <section className={`Certificate_Sec ${isCertificateSectionVisible ? 'PopOut_Certificate_Sec' : ''}`}>
                <div className={`Add_Cert_Carti ${isAddCertCartiVisible ? 'Active_Add_Cert_Carti' : ''}`}>
                    <div className="site-container">

                        <div className="Add_Cert_Carti_box">
                            {flash && (
                                <FlashMessage
                                message={flash.message}
                                type={flash.type}
                                onClose={() => setFlash(null)} // Remove flash message after timeout
                                />
                            )}

                            <div className="Add_CCt_Input">
                                <input
                                type="text"
                                placeholder="Enter category name"
                                value={categoryName}
                                onChange={handleChange1}
                                />
                            </div>
                            <div className="Add_CCt_btns">
                                <button
                                className="Add_Cert_Certegory btn-bg"
                                onClick={handleSubmit1}
                                disabled={isLoading1} 
                                >
                                {isLoading1 ? 'Adding...' : 'Add category'} 
                                </button>
                                <button className="Close_Cert_Certegory" onClick={hideAddCertCarti}>
                                Close
                                </button>
                            </div>
                            </div>


                    </div>
                </div>
                <div className="Certificate_Sec_Main">
                    <div className="site-container">
                        <div className="Top_CC_Mn">
                            <button className="Close_Certificate_Sec" onClick={handleCloseButtonClick}>
                                <img src={ArrowLeft} alt="Arrow Left" />
                            </button>
                        </div>
                        <form className="Main_CC_Mn" onSubmit={handleSubmit}>
                            <div className="L_CC_Mn">
                                <div className="L_CC_Mn_main">


                                    <h3>Upload certificate</h3>
                                    <div className="Certificate_Form">

                                        {flash && (
                                            <FlashMessage
                                            message={flash.message}
                                            type={flash.type}
                                            onClose={() => setFlash(null)} // Remove flash message after timeout
                                            />
                                        )}

                                        <div className="Cert_Form_input Cert_Form_input_Select Cert_Form_input_Selct">


                                        <select
                                            name="certificate_category"
                                            value={selectedCategory}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select certificate category</option>
                                            {categories1.map((category) => (
                                                <option key={category.id} value={category.unique_certificate_category_id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>



                                        <div className="Add_Cart_Btn" onClick={showAddCertCarti}>
                                            Add category
                                        </div>

                                        </div>

                                        <div className="Cert_Form_input">
                                            <lable>Certificate ID</lable>
                                            <input
                                                type="text"
                                                name="number"  // Maps to `certificate_id`
                                                value={certificateData.number}
                                                onChange={handleInputChange}
                                                placeholder="Enter Certificate ID"
                                            />

                                        </div>
                                        <div className="Cert_Form_input">
                                            <label>Certificate title</label>
                                            <input
                                                type="text"
                                                name="certificate_title"
                                                value={certificateData.certificate_title}
                                                onChange={handleInputChange}
                                                placeholder="Enter Certificate title"
                                            />
                                        </div>
                                        <div className="Cert_Form_input">
                                            <label>Type of examination / Event (optional)</label>
                                            <input
                                                type="text"
                                                name="examination_type"
                                                value={certificateData.examination_type}
                                                onChange={handleInputChange}
                                                placeholder="Enter Type of examination / Event (optional)"
                                            />
                                        </div>
                                        <div className="Cert_Form_input">
                                            <label>Issued To</label>
                                            <input
                                                type="text"
                                                name="client_name"  // Maps to `client_name`
                                                value={certificateData.client_name}
                                                onChange={handleInputChange}
                                                placeholder="Enter Issued To"
                                            />
                                        </div>
                                        <div className="Cert_Form_input">
                                            <lable>Date of Issue</lable>
                                            <input
                                                type="date"
                                                name="dateOfIssue"  // Maps to `issue_date`
                                                value={certificateData.dateOfIssue}
                                                onChange={handleInputChange}
                                                placeholder="Enter Date of Issue"
                                            />
                                        </div>
                                        <div className="Cert_Form_input">
                                            <lable>Issue number</lable>
                                            <input
                                                type="text"
                                                name="issuedNumber"
                                                value={certificateData.issuedNumber}
                                                onChange={handleInputChange}
                                                placeholder="Enter Issue number"
                                            />
                                        </div>
                                        <div className="Cert_Form_input">
                                            <label>Issued by</label>
                                            <input
                                                type="text"
                                                name="issuedBy"
                                                value={certificateData.issuedBy}
                                                onChange={handleInputChange}
                                                placeholder="Enter Issued by"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="R_CC_Mn">
                                <div className="R_CC_Mn_Main">
                                    <h4>Upload file </h4>
                                    <p>
                                        <b>Note:</b> The uploaded file is solely for internal records management purposes and will not be visible to the verifier or the general public.
                                    </p>

                                    <div 
                                        className={`Image_Upload_div ${isDragging ? 'dragging' : ''}`} 
                                        onClick={triggerFileInput}
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onDragEnter={handleDragEnter}
                                        onDragLeave={handleDragLeave}
                                    >
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="uploadedImage" />
                                        ) : (
                                            <>
                                                <img src={PhotoIcon} className="photo_Icon" alt="Photo Icon" />
                                                <span>Drag and drop file (pdf, Jpeg, PNG)</span>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        id="fileInput"
                                        style={{ display: 'none' }}
                                        onChange={handleImageUpload}
                                    />

                                    <div className="Submit_Sec">
                                        <button type="submit" disabled={loading} className="btn-bg btn-bg2">
                                            {loading ? "Submitting..." : "Save changes"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>


            <div className="Copy_Url_Sec">

            <div className="Port_into">
                        <h2><WorkspacePremiumIcon /> {organizationName} CMVP Portal</h2>
                        <p>
                            Welcome to your CMVP portal.
                        </p>
                    </div>
                    
                <div className="Copy_Url_box" onClick={handleCopy}>
                    <div className="Copy_Url_box_Main">
                        <h3>{copyMessage}</h3>
                        <input
                            id="portalUrl"
                            type="text"
                            value={`${config.WEB_PAGE_BASE_URL}/verification/${organizationID}/${organizationName}/`}
                            readOnly
                        />
                    </div>
                    <button className="Copy_Url_Btn">
                        <img src={CopyIcon} alt="Copy Icon" />
                    </button>
                </div>
                

            </div>

            <div className="Main_Port_Sec">
                <div className="fsite-container">


                    <div className="ToP_Upload_env">
                        <h3
                            className={`Upload_Box_Toggler ${
                                isUploadBoxTogglerActive ? 'Active_Upload_Box_Toggler' : ''
                            }`}
                            onClick={toggleUploadEnvVisibility}
                        >
                            Upload <img src={AngleDownIcon} alt="Angle Down Icon" />
                        </h3>
                        <div className="Upload_Conunter">
                            <span>0%</span>
                            <p>
                                You can only upload <b>{numDailyCertificateUpload || sessionStorage.getItem("number_of_allowed_cert_upload")}</b> certificates a day
                            </p>
                        </div>
                    </div>

                    <div className={`Upload_env_main ${isUploadEnvHidden ? 'Hide_Envi_Box' : ''}`}>
                        <button className="CertUpload_Btn btn-bg2" onClick={handleUploadButtonClick}>
                            <CloudUploadIcon /> Upload Certificate
                        </button>

                            <div className="Upload_env_main_Foot">
                            <p>
                                {uploadedCount} uploaded<img src={DropArrow1} alt="Drop Arrow 1" />
                            </p>
                            <p>
                                {deletedCount} deleted <img src={DropArrow2} alt="Drop Arrow 2" />
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
