import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import "./Css/Dash.css";
import config from '../../config';
import UserBanner from "./Img/user-banner.jpg";

export default function UserProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);

  const [organization, setOrganization] = useState(null);
  // Extract user details from the query parameters
  const userDetails = {
    fullName: queryParams.get("name") || "N/A",
    email: queryParams.get("email") || "N/A",
    phone: queryParams.get("phone") || "N/A",
    id: queryParams.get("id") || "N/A",
    address: queryParams.get("address") || "N/A",

    subscription_start_time: queryParams.get("subscription_start_time") || "N/A",
    subscription_end_time: queryParams.get("subscription_end_time") || "N/A",
    subscription_plan_name: queryParams.get("subscription_plan_name") || "N/A",
    subscription_duration: queryParams.get("subscription_duration") || "N/A",
    num_certificates_uploaded: queryParams.get("num_certificates_uploaded") || "N/A",

    // logo: queryParams.get("logo") || "N/A",
    RegDate: new Date(queryParams.get("date_joined")).toLocaleDateString("en-GB") || "N/A",
  };

  useEffect(() => {
    if (userDetails.id !== "N/A") {
      axios
        .get(`${config.API_BASE_URL}/api/accounts/auth/organization/${userDetails.id}`)
        .then((response) => {
          setOrganization(response.data);
        })
        .catch((error) => {
          console.error("Error fetching organization data:", error);
        });
    }
  }, [userDetails.id]);


  const handleBackClick = () => {
    navigate(-1);
  };





     // Function to handle delete
     const handleDelete = (id) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this organization?");
      if (confirmDelete) {
        axios
          .delete(`${config.API_BASE_URL}/api/accounts/auth/organization/${id}/`)
          .then(() => {
            // Update the state to reflect the deletion
            // setData((prevData) => prevData.filter((organization) => organization.id !== id));
            alert("Organization deleted successfully!");
          })
          .catch((err) => {
            console.error(err);
            alert("An error occurred while deleting the organization.");
          });
      }
    };

    const formatDateWithoutTime = (dateString) => {
      if (!dateString || dateString === "N/A") return "Not Subscribed";
      
      // If the date contains a time portion (T and Z), remove it
      const dateOnly = dateString.split("T")[0];
      return dateOnly;
    };
    

    

  return (
    <div className="DDD-Seco ooiais-de">
      <div className="JJha-DhA">
        <div className="profile-sec">
          <div className="profile-container" id="profile">
            <div className="profile-header">
              <h1>Profile</h1>
              {organization ? (
                <img src={organization.logo} alt="Organization Logo" />
              ) : (
                <p>Loading...</p>
              )}
              {/* <img src={userDetails.logo} alt="User Banner" /> */}
              {/* <img src={UserBanner} alt="User Banner" /> */}
            </div>
            <hr />
            <div className="profile-details">
              <p>
                <strong>Full Name:</strong> {userDetails.fullName}
              </p>
              <p>
                <strong>Email:</strong> {userDetails.email}
              </p>
              <p>
                <strong>Phone:</strong> {userDetails.phone}
              </p>
              <p>
                <strong>Address:</strong> {userDetails.address}
              </p>
              <p>
                <strong>Registration Date:</strong> {userDetails.RegDate}
              </p>
            </div>
            <hr />
            <div className="profile-body">
              <table>
                <thead>
                  <tr>
                    <th>S/N</th>
                    <th>Plan</th>
                    <th>Duration</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>
                    <th>Documents</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    
                    <td>{userDetails.subscription_plan_name}</td>

                    <td>{userDetails.subscription_duration} days </td>

                    {/* <td>{userDetails.subscription_start_time || "Not Subscribed"}</td>
                    
                    <td>{userDetails.subscription_end_time || "Not Subscribed"}</td> */}


                    <td>{formatDateWithoutTime(userDetails.subscription_start_time)}</td>
                    <td>{formatDateWithoutTime(userDetails.subscription_end_time)}</td>
                  
                    <td className="active-BGD">Active</td>

                    <td>{userDetails.num_certificates_uploaded || 0}</td>
                  </tr>

                </tbody>
              </table>
            </div>
            <hr />
            <div className="profile-footer">
              <div className="action-btns">
                <button type="button" className="back-btn" onClick={handleBackClick}>
                  Back
                </button>
                <button onClick={() => handleDelete(userDetails.id)}>Remove</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
