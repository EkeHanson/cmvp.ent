import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Css/Dash.css";
import config from "../../config";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Optional: for better styles
import SearchIcon from './Img/searchicon.svg';

const SubscriptionTable = () => {

  const [searching, setSearching] = useState(false); // Loader for search
  const [searchQuery, setSearchQuery] = useState(""); // Search input state


  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search input
  const [currentPageUrl, setCurrentPageUrl] = useState(
    `${config.API_BASE_URL}/api/accounts/auth/subscription/organizations/subscriptions/`
  );
  const [activatingOrgId, setActivatingOrgId] = useState(null); // Track which organization is being activated/deactivated

  const fetchData = (url) => {
    setLoading(true);
    axios.get(url)
      .then((response) => {
        setData(response.data.results || []);

        // console.log(response.data.results || []);

        setNextPage(response.data.next);
        setPrevPage(response.data.previous);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(currentPageUrl);
  }, [currentPageUrl]);

  const handlePageChange = (url) => {
    if (url) {
      setCurrentPageUrl(url);
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this organization?"
    );
    if (confirmDelete) {
      axios
        .delete(`${config.API_BASE_URL}/api/accounts/auth/organization/${id}/`)
        .then(() => {
          setData((prevData) => prevData.filter((org) => org.id !== id));
          alert("Organization removed successfully!");
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to delete the organization.");
        });
    }
  };

  const handleActivateDeactivate = (organization) => {
    const { id, is_activated } = organization;
    const newStatus = !is_activated;
    setActivatingOrgId(id); // Set the organization ID being processed

    // console.log("is_activated")
    // console.log(is_activated)
    // console.log("is_activated")

    axios
      .patch(`${config.API_BASE_URL}/api/accounts/auth/organizations/${organization.unique_subscriber_id}/update-by-subscriber-id/`,
        { is_activated: newStatus }
      )
      .then(() => {
        setData((prevData) =>
          prevData.map((org) =>
            org.id === id ? { ...org, is_activated: newStatus } : org
          )
        );
      })
      .catch((err) => {
        console.error("Error updating organization status:", err);
        alert("Failed to update organization status.");
      })
      .finally(() => {
        setActivatingOrgId(null); // Reset the organization ID being processed
      });
  };

  const calculateDaysDifference = (endDate) => {
    if (!endDate) return 0;
    const currentDate = new Date();
    const endDateObj = new Date(endDate);
    const diffTime = endDateObj - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 1 ? diffDays : 0;
  };


  const handleSearch = () => {
    if (!searchQuery.trim()) {
      fetchData(currentPageUrl); // Reload original data if input is empty
      return;
    }

    setSearching(true);

    axios.get(`${config.API_BASE_URL}/api/accounts/auth/search/organizations/searching/?name=${encodeURIComponent(searchQuery)}`)
    
      .then((response) => {
        setData(response.data.results || []);
      })
      .catch((err) => {
        console.error("Search error:", err);
        setError("Failed to fetch search results.");
      })
      .finally(() => {
        setSearching(false);
      });
  };

  
  return (
    <div className="JJha-DhA">

      
      {/* Search Section */}
      <div className="Search_Sec admin-Search_Sec">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="mobile_Search_toggler" onClick={handleSearch}>
          <img src={SearchIcon} alt="Search Icon" />
        </button>
      </div>

      {searching && <p className="searching-loader">Searching...</p>}


      
      <div className="Dash-Intro subscripp-header">
        <h2>Registered Users with Their Subscription Plans</h2>
        <Link
          to="/admin-dashboard/add-subscription-plan"
          className="add-subscription-plan"
        >
          <span className="material-icons">add</span>
          Add Subscription Plan
        </Link>
      </div>

      <div className="Sec-table">
        <table>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Name</th>
              <th>Plan</th>
              <th>Duration</th>
              <th>Subscription Date</th>
              <th>Expiration Date</th>
              <th>Status</th>
              <th>Uploaded Documents</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Skeleton loader for each row
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td><Skeleton height={20} width={30} /></td>
                  <td><Skeleton height={20} width={150} /></td>
                  <td><Skeleton height={20} width={100} /></td>
                  <td><Skeleton height={20} width={80} /></td>
                  <td><Skeleton height={20} width={120} /></td>
                  <td><Skeleton height={20} width={120} /></td>
                  <td><Skeleton height={20} width={60} /></td>
                  <td><Skeleton height={20} width={50} /></td>
                  <td><Skeleton height={20} width={100} /></td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan="9">Error: {error}</td>
              </tr>
            ) : (
              data.map((organization, index) => (
                <tr key={organization.id}>
                  <td>{index + 1}</td>
                  <td>{organization.name}</td>
                  <td>{organization.subscription_plan_name}</td>
                  <td>{calculateDaysDifference(organization.subscription_end_time)} Days</td>
                  <td>
                    {organization.subscription_start_time
                      ? new Date(organization.subscription_start_time).toLocaleDateString("en-GB")
                      : "Not Subscribed"}
                  </td>
                  <td>
                    {organization.subscription_end_time
                      ? new Date(organization.subscription_end_time).toLocaleDateString("en-GB")
                      : "Not Subscribed"}
                  </td>
                  <td>
                    <button
                      className={organization.is_activated ? "active-BGD" : "expired-BGD"}
                    >
                      {organization.is_activated ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td>{organization.num_certificates_uploaded}</td>
                  <td>
                    <div className="action-btns">
                      <button
                        className={organization.is_activated ? "activate-btn active" : "activate-btn inactive"}
                        onClick={() => handleActivateDeactivate(organization)}
                        disabled={activatingOrgId === organization.id}
                      >
                        {activatingOrgId === organization.id
                          ? organization.is_activated
                            ? "Deactivating..."
                            : "Activating..."
                          : organization.is_activated
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                      <Link
                        to={{
                          pathname: "/admin-dashboard/user-profile",
                          search: `?num_certificates_uploaded=${encodeURIComponent(
                            organization.num_certificates_uploaded
                          )}&name=${encodeURIComponent(
                            organization.name
                          )}&phone=${encodeURIComponent(
                            organization.phone
                          )}&address=${encodeURIComponent(
                            organization.address
                          )}&id=${organization.id}&subscription_start_time=${encodeURIComponent(
                            organization.subscription_start_time
                          )}&subscription_end_time=${encodeURIComponent(
                            organization.subscription_end_time
                          )}&subscription_plan_name=${encodeURIComponent(
                            organization.subscription_plan_name
                          )}&subscription_duration=${encodeURIComponent(
                            organization.subscription_duration
                          )}&email=${encodeURIComponent(
                            organization.email
                          )}&date_joined=${encodeURIComponent(
                            organization.date_joined
                          )}`,
                        }}
                        className="prof-bank-btn"
                      >
                        Profile
                      </Link>
                      <button onClick={() => handleDelete(organization.id)}>
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination dack-pgn">
        <button
          onClick={() => handlePageChange(prevPage)}
          disabled={!prevPage || loading}
          className={!prevPage || loading ? "disabled" : ""}
        >
          &laquo;
        </button>

        <span>Page {new URL(currentPageUrl).searchParams.get("page") || 1}</span>

        <button
          onClick={() => handlePageChange(nextPage)}
          disabled={!nextPage || loading}
          className={!nextPage || loading ? "disabled" : ""}
        >
          &raquo;
        </button>
      </div>
    </div>
  );
};

export default SubscriptionTable;