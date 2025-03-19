import config from '../../config.jsx';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import AngleDownIcon from './Img/angle-down.svg';
import RestoreIcon from './Img/restore_icon.svg';
import VerifiedIcon from './Img/verified-badge2.svg';
import TrashIcon from './Img/trash.svg';
import Skeleton from 'react-loading-skeleton'; // Optional: Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Optional: for better styles
import FlashMessage from "../FlashMessage/FlashMessage.jsx";

export default function DeletedUploadedCert() {
    const organizationID = localStorage.getItem("authUserId");
        const [currentPage, setCurrentPage] = useState(1);
        const [nextPage, setNextPage] = useState(null);
        const [prevPage, setPrevPage] = useState(null);
    

    const [isUploadBoxTogglerActive, setIsUploadBoxTogglerActive] = useState(false);
    const [isUploadEnvHidden, setIsUploadEnvHidden] = useState(false);
    const [selectedCategory1, setSelectedCategory1] = useState(""); // Category for filtering
    const [certificates, setCertificates] = useState([]);
    const [loadingCertificateId, setLoadingCertificateId] = useState(null);  // Track the loading certificate
    const [flash, setFlash] = useState(null);
    const [certificateList, setCertificateList] = useState([]);
    const [certificateCategories, setCertificateCategories] = useState([]);
    
    const showMessage = (message, type) => {
        setFlash({ message, type });
    };

    // Fetch the soft deleted certificates when the component mounts
    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const response = await axios.get(`${config.API_BASE_URL}/api/certificates/soft-deleted-certificates/${organizationID}/`);
                setCertificates(response.data.results); // Use 'results' from the response
                setCertificateList(response.data.results || []); // Default to an empty array

                setNextPage(response.data.next);
                setPrevPage(response.data.previous);
                setCurrentPage(1)
                // setCurrentPage(page);

            } catch (error) {
                console.error("Error fetching certificates:", error);
            }
        };
        fetchCertificates();
    }, []);

    // Fetch categories from the API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${config.API_BASE_URL}/api/certificates/certificateCategory/${organizationID}`);
                setCertificateCategories(response.data); // Store categories
            } catch (error) {
                showMessage('Failed to fetch certificate categories. Please try again.', 'failure');
            }
        };
        fetchCategories();
    }, []);

    // Toggle the visibility of the upload environment section
    const toggleUploadEnvVisibility = () => {
        setIsUploadEnvHidden(!isUploadEnvHidden);
        setIsUploadBoxTogglerActive(!isUploadBoxTogglerActive);
    };

    const handleChange2 = (event) => {
        setSelectedCategory1(event.target.value);  // Set selected category for filtering
    };

    // Function to handle the restoration of a certificate
    const restoreCertificate = async (certificateId) => {
        setLoadingCertificateId(certificateId); // Set the loading state to the current certificate ID
        try {
            const response = await axios.post(`${config.API_BASE_URL}/api/certificates/${certificateId}/restore/`);
            showMessage("Certificate data restored successfully", "success");
            setCertificates(prevCertificates => prevCertificates.filter(cert => cert.certificate_id !== certificateId));

            window.location.reload();
        } catch (error) {
            console.error("Error restoring certificate:", error);
        } finally {
            setLoadingCertificateId(null); // Reset the loading state after the request finishes
        }
    };

    // Function to permanently delete a certificate
    const deleteCertificate = async (certificateId) => {

        // console.log("certificateId")
        // console.log(`${config.API_BASE_URL}/api/certificates/${certificateId}/delete-permanently/`)
        // console.log("certificateId")

        // alert(certificateId)

        setLoadingCertificateId(certificateId); // Set the loading state to the current certificate ID
        try {
            const response = await axios.delete(`${config.API_BASE_URL}/api/certificates/${certificateId}/delete-permanently/`);
            showMessage("Certificate permanently deleted", "success");
            setCertificates(prevCertificates => prevCertificates.filter(cert => cert.certificate_id !== certificateId));
        } catch (error) {
            console.error("Error deleting certificate:", error);
            showMessage("Failed to permanently delete certificate. Please try again.", "failure");
        } finally {
            setLoadingCertificateId(null); // Reset the loading state after the request finishes
        }
    };

    // Filter certificate list based on the selected category
    const filteredCertificates =
        selectedCategory1 === "" // If no category selected, show all certificates
            ? certificateList
            : certificateList.filter(
                (cert) => cert.certificate_category === selectedCategory1
            );

    return (
        <div className="Uploaded_Cert_page">
            <div className="ToP_Upload_env">
                {flash && (
                    <FlashMessage
                        message={flash.message}
                        type={flash.type}
                        onClose={() => setFlash(null)} // Remove flash message after timeout
                    />
                )}

                <h3 
                    className={`Upload_Box_Toggler ${isUploadBoxTogglerActive ? 'Active_Upload_Box_Toggler' : ''}`} 
                    onClick={toggleUploadEnvVisibility}
                >
                    Deleted Certificates <img src={AngleDownIcon} alt="Angle Down Icon" />
                </h3>
                <div className="Upload_Conunter">
                    <span>{certificates.length}</span>
                    <p><b>Deleted</b> certificates</p>
                </div>
            </div>

            <div className={`Upload_env_main ${isUploadEnvHidden ? 'Hide_Envi_Box' : ''}`}>
                <div className="Cert_Carti_Sel_Sec">
                    <h3>Deleted Certificates</h3>

                    <div className="Cart_select_Sec">
                        <select value={selectedCategory1} onChange={handleChange2}>
                            <option value="">All Certificates</option>
                            {certificateCategories.length > 0 ? (
                                certificateCategories.map((category) => (
                                    <option
                                        key={category.unique_certificate_category_id}
                                        value={category.unique_certificate_category_id}
                                    >
                                        {category.name}
                                    </option>
                                ))
                            ) : (
                               
                                <Skeleton count={1} width="100%" height={40} />
                            )}
                        </select>
                    </div>
                </div>

                <div className="Table_Sec">
                    <table className="Upload_Table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Certificate number</th>
                                <th>Certificate title</th>
                                <th>Type of Examination / Event</th>
                                <th>Issued to</th>
                                <th>Date of issue</th>
                                <th>Issue number</th>
                                <th>Issued by</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCertificates.length === 0 ? (
                                <tr>
                                    <td colSpan="11" style={{ textAlign: "center", padding: "10px" }}>
                                        No certificates deleted from this category yet.
                                    </td>
                                </tr>
                            ) : (
                                filteredCertificates.map((cert, index) => (
                                    <tr key={cert.id}>
                                        <td><span className="serial_Number_span">{index + 1}</span></td>
                                        <td>{cert.certificate_id}</td>
                                        <td>{cert.client_name}</td>
                                        <td>{cert.issue_date ? "Welding" : "N/A"}</td>
                                        <td>{cert.client_name}</td>
                                        <td>{cert.issue_date}</td>
                                        <td>{cert.issuedNumber}</td>
                                        <td>{cert.organization_name}</td>
                                        <td>
                                            <span className="Status_Respn"><img src={VerifiedIcon} alt="Verified Icon" /> Verified</span>
                                        </td>
              
                                        <td>
                                            <div className="td_Btns">
                                                {/* <button className="deleted_LAbel">Deleted <img src={TrashIcon} alt="Trash Icon" /></button> */}
                                                <button 
                                                    className="deleted_LAbel"
                                                    onClick={() => deleteCertificate(cert.certificate_id)}
                                                    disabled={loadingCertificateId === cert.certificate_id}
                                                >
                                                    {loadingCertificateId === cert.certificate_id ? "Deleting..." : "Delete "}
                                                    {loadingCertificateId === cert.certificate_id && <span className="loader">...</span>}
                                                    <img src={TrashIcon} alt="Trash Icon" />
                                                </button>
                                            
                                                <button 
                                                    className="restore_btn" 
                                                    onClick={() => restoreCertificate(cert.certificate_id)}
                                                    disabled={loadingCertificateId === cert.certificate_id}
                                                >
                                                    {loadingCertificateId === cert.certificate_id ? "Restoring..." : "Restore"}
                                                    {loadingCertificateId === cert.certificate_id && <span className="loader">...</span>}
                                                    <img src={RestoreIcon} alt="Restore Icon" />
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {/* Skeleton Loading for Table Rows */}
                    {certificates.length === 0 && (
                        <Skeleton count={1} height={40} />
                    )}
                </div>

                <div className="pagination">
                    <button disabled={!prevPage} onClick={() => setCurrentPage(prev => prev - 1)}>« </button>
                    <span>Page {currentPage}</span>
                    <button disabled={!nextPage} onClick={() => setCurrentPage(prev => prev + 1)}> »</button>
                </div>
      
            </div>
        </div>
    );
}
