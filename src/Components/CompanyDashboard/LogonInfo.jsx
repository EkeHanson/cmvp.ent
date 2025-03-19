import React, { useState, useEffect } from "react";
import axios from "axios";
import config from '../../config.jsx';
import AngleDownIcon from './Img/angle-down.svg';

export default function LogonInfo() {
    const organizationID = sessionStorage.getItem("authUserId");
    const organizationName = sessionStorage.getItem("authName");

    const [uploadedCount, setUploadedCount] = useState(0);
    const [deletedCount, setDeletedCount] = useState(0);
    const [ipAddress, setIpAddress] = useState(""); // State to store IP address
    const [currentDate, setCurrentDate] = useState(""); // State to store current date
    const [logoutTime, setLogoutTime] = useState(""); // State to store logout time
    const [estimatedTimeOnPortal, setEstimatedTimeOnPortal] = useState(""); // State for estimated time on portal
    const [isUploadBoxTogglerActive, setIsUploadBoxTogglerActive] = useState(false);
    const [isUploadEnvHidden, setIsUploadEnvHidden] = useState(false);

    const toggleUploadEnvVisibility = () => {
        setIsUploadEnvHidden(!isUploadEnvHidden);
        setIsUploadBoxTogglerActive(!isUploadBoxTogglerActive);
    };

    const [loginTime, setLoginTime] = useState("");

    useEffect(() => {
        const storedLoginTime = sessionStorage.getItem("loginTime");
        setLoginTime(storedLoginTime || "Not Available");

        // Function to parse "hh:mm AM/PM" into a Date object
        const parseTime = (timeString) => {
            if (!timeString) return null;

            const [time, modifier] = timeString.split(" ");
            const [hours, minutes] = time.split(":").map(Number);
            const parsedHours = modifier === "PM" && hours !== 12 ? hours + 12 : hours % 12;

            const now = new Date();
            now.setHours(parsedHours, minutes, 0, 0);
            return now;
        };

        // Update logout time every second
        const interval = setInterval(() => {
            const now = new Date();
            const formattedTime = now.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setLogoutTime(formattedTime);

            if (storedLoginTime) {
                const loginDate = parseTime(storedLoginTime);

                if (loginDate) {
                    const timeDiffMs = now - loginDate;
                    const timeDiffHrs = Math.floor(timeDiffMs / (1000 * 60 * 60));
                    const timeDiffMins = Math.floor((timeDiffMs % (1000 * 60 * 60)) / (1000 * 60));
                    setEstimatedTimeOnPortal(`${timeDiffHrs}hr ${timeDiffMins}mins`);
                } else {
                    setEstimatedTimeOnPortal("Invalid login time");
                }
            }
        }, 1000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);
    
    useEffect(() => {
        // Fetch the uploaded certificates count
        const fetchUploadedCertificates = async () => {
            try {
                const response = await axios.get(`${config.API_BASE_URL}/api/certificates/organization/${organizationID}/`, {
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }
                });
                setUploadedCount(response.data.count);
            } catch (error) {
                console.error("Error fetching uploaded certificates count:", error);
            }
        };

        // Fetch the deleted certificates count
        const fetchDeletedCertificates = async () => {
            try {
                const response = await axios.get(`${config.API_BASE_URL}/api/certificates/soft-deleted-certificates/${organizationID}/`, {
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }
                });
                setDeletedCount(response.data.results.length);
            } catch (error) {
                console.error("Error fetching deleted certificates count:", error);
            }
        };

        // Fetch the IP address
        const fetchIpAddress = async () => {
            try {
                const response = await axios.get("https://api.ipify.org?format=json");
                setIpAddress(response.data.ip);
            } catch (error) {
                console.error("Error fetching IP address:", error);
            }
        };

        // Set the current date
        const fetchCurrentDate = () => {
            const today = new Date();
            const formattedDate = today.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short", // Abbreviated month format
                year: "numeric",
            });
            setCurrentDate(formattedDate);
        };

        fetchUploadedCertificates();
        fetchDeletedCertificates();
        fetchIpAddress();
        fetchCurrentDate();
    }, []);

    return (
        <div className="Uploaded_Cert_page">
            <div className="ToP_Upload_env">
                <h3
                    className={`Upload_Box_Toggler ${isUploadBoxTogglerActive ? 'Active_Upload_Box_Toggler' : ''}`}
                    onClick={toggleUploadEnvVisibility}
                >
                    Logon information<img src={AngleDownIcon} alt="Angle Down Icon" />
                </h3>
                <div className="Upload_Conunter">
                    <span>02</span>
                    <p><b>User</b> logon details</p>
                </div>
            </div>

            <div className={`Upload_env_main ${isUploadEnvHidden ? 'Hide_Envi_Box' : ''}`}>
                <div className="Table_Sec">
                    <table className="Upload_Table">
                        <thead>
                            <tr>
                                <th>S/N</th>
                                <th>IP</th>
                                <th>Date</th>
                                <th>Login time</th>
                                <th>Logout time</th>
                                <th>Estimated time on portal</th>
                                <th>Uploaded files</th>
                                <th>Deleted files</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key="1">
                                <td>1</td>
                                <td>{ipAddress || "Fetching..."}</td>
                                <td>{currentDate || "Loading..."}</td>
                                <td>{loginTime}</td>
                                <td>{logoutTime || "Loading..."}</td>
                                <td>{estimatedTimeOnPortal || "Calculating..."}</td>
                                <td>{uploadedCount}</td>
                                <td>{deletedCount}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
