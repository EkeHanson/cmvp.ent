import React, { useState, useEffect } from "react";
import axios from "axios";
import AngleDownIcon from './Img/angle-down.svg';
import DownloadIcon from './Img/download_icon.svg';
import VerifiedIcon from './Img/verified-badge2.svg';
import ArrowLeft from './Img/arrow-left.svg';
import PhotoIcon from './Img/photo-icon.svg';
import Skeleton from 'react-loading-skeleton'; // Optional: Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Optional: for better styles

import FlashMessage from "../FlashMessage/FlashMessage.jsx";
import config from '../../config.jsx'

export default function UploadedCert() {
    const [currentPage, setCurrentPage] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);


    const organizationID = sessionStorage.getItem("authUserId");

    const [flash, setFlash] = useState(null);

    const showMessage = (message, type) => {
      setFlash({ message, type });
    };

    const organizationName = sessionStorage.getItem("authName");

    const [isUploadBoxTogglerActive, setIsUploadBoxTogglerActive] = useState(false);
    const [isUploadEnvHidden, setIsUploadEnvHidden] = useState(false);
    const [isCertificateSectionVisible, setIsCertificateSectionVisible] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [certificateID, setCertificateID] = useState(null);
    const [numCertificateUploaded, setNumCertificateUploaded] = useState("0");
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false); // Loader state
    const [loadingDownload, setLoadingDownload] = useState(false); // Loader state for download

    const [certificateList, setCertificateList] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [certificateCategories, setCertificateCategories] = useState([]);


    const [selectedCategory1, setSelectedCategory1] = useState("");


    const [certificateData, setCertificateData] = useState({
        organization_id: organizationID,
        certificate_id: "",
        certificate_title: "", // Ensure this field is included
        certificate_category: "",
        client_name: "",
        dateOfIssue: "",
        issueNumber: "",
        issuedBy: organizationName,
        type: '',
        issue_date: "",
        examination_type: "",
        issuedNumber: ""
    });
    

    const toggleUploadEnvVisibility = () => {
        setIsUploadEnvHidden(!isUploadEnvHidden);
        setIsUploadBoxTogglerActive(!isUploadBoxTogglerActive);
    };

    const handleCloseButtonClick = () => {
        setIsCertificateSectionVisible(false);
    };


    const handlePreviewButtonClick = async (certificate_id) => {
        try {
            const response = await axios.get(`${config.API_BASE_URL}/api/certificates/create/${certificate_id}/`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            });
    
            setCertificateData(response.data); // Populate the form with the fetched certificate data
            const fetchedData = response.data;
            // Prepopulate the image preview if cert.image exists

            // Prepopulate the select dropdown with the fetched certificate category
            setSelectedCategory(fetchedData.certificate_category);
            
            if (response.data.pdf_file) {
                setImagePreview(response.data.pdf_file);
                setCertificateID(response.data.id);
            } else {
                setImagePreview(null); // Reset if no image is present
            }
    
            setIsCertificateSectionVisible(true); // Show the form for editing

        } catch (error) {
            console.error("Error fetching certificate details:", error);
            alert("Failed to fetch certificate details. Please try again.");
        }
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


    const triggerFileInput = () => {
        document.getElementById('fileInput').click();
    };

    const handleDragEnter = () => setIsDragging(true);
    const handleDragLeave = () => setIsDragging(false);
    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCertificateData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const organizationID = sessionStorage.getItem("authUserId");

        const formData = new FormData();
        formData.append("organization", organizationID); 
        formData.append("certificate_id", certificateData.certificate_id);  // `number` on frontend -> `certificate_id` on backend
        formData.append("client_name", certificateData.client_name);   // `issuedTo` -> `client_name`

        formData.append("certificate_category", selectedCategory); 

        formData.append("issue_date", certificateData.issue_date); 
        formData.append("certificate_title", certificateData.certificate_title); // Ensure this line is present
        formData.append("examination_type", certificateData.examination_type); // Ensure this line is present
        formData.append("issuedNumber", certificateData.issuedNumber); // Ensure this line is present

        formData.append("issuedBy", certificateData.issuedBy); 

        formData.append("expiry_date", "");  // Optional
        if (selectedFile) {
            formData.append("pdf_file", selectedFile);
        }
    
        try {

            const response = await axios.patch(`${config.API_BASE_URL}/api/certificates/create/${certificateID}/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${sessionStorage.getItem("authUserId")}`
                }
            });

            showMessage('Certificate Updated successfully!', 'success')

            window.location.reload();

        } catch (error) {
            console.error("Error creating certificate:", error);
            alert("Failed to create certificate. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        setSelectedCategory(event.target.value);
        // Optionally update certificateData with the selected category
        setCertificateData(prevData => ({
            ...prevData,
            type: event.target.value // Assuming "type" is the field for category
        }));
    };


    useEffect(() => {
        const fetchCertificateData = async (page = 1) => {
            setLoading(true);
            try {
                const response = await axios.get(`${config.API_BASE_URL}/api/certificates/organization/${organizationID}/`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
                    },
                    params: { page },
                });

                setCertificateList(response.data.results || []);
                setNumCertificateUploaded(response.data.count);

                setNextPage(response.data.next);
                setPrevPage(response.data.previous);
                setCurrentPage(page);

            } catch (error) {
                showMessage('Error fetching certificate data', 'failure');
                setCertificateList([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificateData(currentPage);
    }, [organizationID, currentPage]);

    
   // Soft delete certificate by id with confirmation
const handleSoftDelete = async (certificate_id) => {
    // Ask for confirmation before proceeding with deletion
    const isConfirmed = window.confirm("Are you sure you want to delete this certificate?");

    if (!isConfirmed) {
        return; // Exit the function if the user cancels the deletion
    }

    try {
        // Make the request to perform the soft delete
        await axios.post(`${config.API_BASE_URL}/api/certificates/${certificate_id}/delete/`, null, {
        });

        // Remove the deleted certificate from the state list
        setCertificateList(certificateList.filter(cert => cert.certificate_id !== certificate_id));

        showMessage('Certificate has been deleted successfully', 'success')
        // alert("Certificate has been deleted (soft delete).");
    } catch (error) {
        //console.error("Error deleting certificate:", error);
        //alert("Failed to delete certificate. Please try again.");
        showMessage('Failed to delete certificate. Please try again.', 'failure')
    }
};

   

    const handleDownloadReceipt = async (receiptUrl, name) => {
        setLoadingDownload(true); // Start loader for download state

        try {
            const response = await axios.get(receiptUrl, {
                responseType: 'blob', // Ensure response is treated as a Blob
            });

            // Fallback if Content-Type is not provided
            const contentType = response.data.type || 'application/pdf';
            const blob = new Blob([response.data], { type: contentType });
            
            // Create URL for the Blob
            const downloadUrl = window.URL.createObjectURL(blob);
            
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = name; // Set the file name
            
            // Append link to the document and initiate download
            document.body.appendChild(link);
            link.click();
            
            // Clean up the URL and link element
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(link);
            showMessage('Your Certificate  is downloading ', 'success')

        } catch (error) {
            console.error('Error downloading receipt:', error);
            //alert("An error occurred during the download. Please try again.");
            showMessage('An error occurred during the download. Please try again. ', 'failure')
        } finally {
            setLoadingDownload(false); // Stop loader
        }
    };

    // Fetch categories from the API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${config.API_BASE_URL}/api/certificates/certificateCategory/${organizationID}`);

                setCertificateCategories(response.data); // Store categories

            } catch (error) {
                showMessage('Failed to fetch certificate categories. Please try again.', 'failure')
            }
        };

        fetchCategories();
    }, []);



   
    const handleChange1 = (event) => {
        const category = event.target.value;
        console.log("Selected Category:", category);
        setSelectedCategory(category);
        setCertificateData(prevData => ({
            ...prevData,
            certificate_category: category // Ensure this matches the API field name
        }));

    };
    

    
  // Handle select change
  const handleChange2 = (event) => {
    setSelectedCategory1(event.target.value);

  };

  // Filter certificate list based on the selected category
  const filteredCertificates =
    selectedCategory1 === ""
      ? certificateList // Show all certificates if no category is selected
      : certificateList.filter(
          (cert) => cert.certificate_category === selectedCategory1
        );



    
            
    return (
        <div className="Uploaded_Cert_page">

        {flash && (
                <FlashMessage
                message={flash.message}
                type={flash.type}
                onClose={() => setFlash(null)}
                />
            )}

            <section className={`Certificate_Sec ${isCertificateSectionVisible ? 'PopOut_Certificate_Sec' : ''}`}>
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
                                    <h3>Edit certificate</h3>
                                    <div className="Certificate_Form">

                                        
                        {flash && (
                                <FlashMessage
                                message={flash.message}
                                type={flash.type}
                                onClose={() => setFlash(null)} // Remove flash message after timeout
                                />
                            )}

                                <div className="Cert_Form_input Cert_Form_input_Select Cert_Form_input_Selct">
                                    <select value={selectedCategory} onChange={handleChange1}>
                                        <option value="">Select certificate category</option>
                                        {certificateCategories.map((category) => (
                                            <option key={category.id} value={category.unique_certificate_category_id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                            </div>

                                        <div className="Cert_Form_input">
                                            <label>Certificate ID</label>
                                            <input
                                                type="text"
                                                name="certificate_id"  // Maps to `certificate_id`
                                                value={certificateData.certificate_id}
                                                onChange={handleInputChange}
                                                placeholder="Enter Certificate ID"
                                            />
                                        </div>
                                        <div className="Cert_Form_input">
                                            <label>Certificate title</label>

                                        <input
                                            type="text"
                                            name="certificate_title"
                                            value={certificateData.certificate_title || ""}
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
                                            <label>Date of Issue</label>
                                            <input
                                                type="date"
                                                name="issue_date"  // Maps to `issue_date`
                                                value={certificateData.issue_date}
                                                onChange={handleInputChange}
                                                placeholder="Enter Date of Issue"
                                            />
                                        </div>
                                        <div className="Cert_Form_input">
                                            <label>Issue number</label>
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
                                    <h4>Upload file</h4>
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
                                        <button type="submit" disabled={loading} className="btn-bg2">
                                            {loading ? "Updating Certificate..." : "Save changes"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            <div className="ToP_Upload_env">
                <h3 
                    className={`Upload_Box_Toggler ${isUploadBoxTogglerActive ? 'Active_Upload_Box_Toggler' : ''}`} 
                    onClick={toggleUploadEnvVisibility}
                >
                    Uploaded Certificates <img src={AngleDownIcon} alt="Angle Down Icon" />
                </h3>
                <div className="Upload_Conunter">
                    <span>{numCertificateUploaded}</span>
                    <p>
                        <b>Uploaded</b> {numCertificateUploaded > 1 ? 'certificates' : 'certificate'}
                    </p>
                </div>
            </div>


            <div className={`Upload_env_main ${isUploadEnvHidden ? 'Hide_Envi_Box' : ''}`}>
            <div className="Cert_Carti_Sel_Sec">
                <h3>Training certificate</h3>

                <div className="Cart_select_Sec">
                <select value={selectedCategory1} onChange={handleChange2}>
                <option value="">All Certificates</option>
                {certificateCategories.map((category) => (
                <option
                    key={category.unique_certificate_category_id}
                    value={category.unique_certificate_category_id}
                >
                    {category.name} 
                </option>
                ))}
            </select>
            </div>

        </div>

        <div className="Table_Sec">
            <table className="Upload_Table">
            <thead>
                <tr>
                <th>S/N</th>
                <th>Certificate number</th>
                <th>Client name</th>
                <th>Date of issue</th>
                <th>Issue number</th>
                <th>Issued by</th>
                <th>Status</th>
                <th>Uploaded / E-copy</th>
                <th>Action</th>
                </tr>
            </thead>
            <tbody>
                        {loading ? (
                        // Display Skeleton loader for rows
                        Array.from({ length: 5 }).map((_, index) => (
                            <tr key={index}>
                            <td><Skeleton height={30} width={50} /></td>
                            <td><Skeleton height={30} width={100} /></td>
                            <td><Skeleton height={30} width={150} /></td>
                            <td><Skeleton height={30} width={120} /></td>
                            <td><Skeleton height={30} width={100} /></td>
                            <td><Skeleton height={30} width={120} /></td>
                            <td><Skeleton height={30} width={80} /></td>
                            <td><Skeleton height={30} width={150} /></td>
                            <td><Skeleton height={30} width={100} /></td>
                            </tr>
                        ))
                        ) : filteredCertificates.length > 0 ? (
                        filteredCertificates.map((cert, index) => (
                            <tr key={index}>
                            <td><span className="serial_Number_span">{index + 1}</span></td>
                            <td>{cert.certificate_id}</td>
                            <td>{cert.client_name}</td>
                            <td>{new Date(cert.issue_date).toLocaleDateString()}</td>
                            <td>{cert.issuedNumber || cert.certificate_id}</td>
                            <td>{cert.issuedBy || cert.organization_name}</td>
                            <td>
                                <span className="Status_Respn">
                                <img src={VerifiedIcon} alt="Verified Icon" /> Verified
                                </span>
                            </td>
                            <td>
                                <div className="Uploaded_Cert_Div">
                                {cert.pdf_file ? (
                                    <button onClick={() => handleDownloadReceipt(cert.pdf_file, `${cert.client_name}.pdf`)}>
                                    Download
                                    </button>
                                ) : (
                                    <span>Not uploaded</span>
                                )}
                                </div>
                            </td>
                            <td>
                                <div className="td_Btns">
                                <button onClick={() => handlePreviewButtonClick(cert.id)}>Edit</button>
                                <button onClick={() => handleSoftDelete(cert.certificate_id)}>Delete</button>
                                </div>
                            </td>
                            </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan="9" style={{ textAlign: 'center', padding: '10px' }}>
                            No certificate created for this category yet
                            </td>
                        </tr>
                        )}
            </tbody>
                    
            </table>

            <div className="pagination">
                <button disabled={!prevPage} onClick={() => setCurrentPage(prev => prev - 1)}>« </button>
                <span>Page {currentPage}</span>
                <button disabled={!nextPage} onClick={() => setCurrentPage(prev => prev + 1)}> »</button>
            </div>
    
        </div>
            </div>
        </div>
    );
}
