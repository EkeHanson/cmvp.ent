import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Css/Dash.css";
import config from "../../config";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import SearchIcon from './Img/searchicon.svg';

export default function RegUsers() {
  const [searching, setSearching] = useState(false); // Loader for search
  const [searchQuery, setSearchQuery] = useState(""); // Search input state

  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // Track ongoing deletions
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  
  const [currentPageUrl, setCurrentPageUrl] = useState(
    `${config.API_BASE_URL}/api/accounts/auth/subscription/organizations/subscriptions/`
  );

  const fetchData = (url) => {
    setLoading(true);
    axios.get(url)
    .then((response) => {
    // console.log("Fetched Data:", response.data);
      setData(response.data.results || []);
     
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


  // Function to handle delete
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this organization?"
    );
    if (confirmDelete) {
      setDeletingId(id); // Indicate the deletion is ongoing
      axios
        .delete(`${config.API_BASE_URL}/api/accounts/auth/organization/${id}/`)
        .then(() => {
          setData((prevData) =>
            prevData.filter((organization) => organization.id !== id)
          );
          setDeletingId(null);
          alert("Organization deleted successfully!");
        })
        .catch((err) => {
          console.error(err);
          setDeletingId(null);
          alert("An error occurred while deleting the organization.");
        });
    }
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




  if (loading) {
    return (
      <div className="DDD-Seco">
        <div className="JJha-DhA">
          <Skeleton count={5} height={30} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="DDD-Seco">
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="DDD-Seco">
      <div className="JJha-DhA">
        <div className="Dash-Intro">
          <h2>Registered Users</h2>
        </div>

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


        <div className="Sec-table">
          <table border="1" cellPadding="10" cellSpacing="0">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone number</th>
                <th>Address</th>
                <th>RC Number</th>
                <th>Registration Date</th>
                <th>Current Plan</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((organization, index) => (
                <tr key={organization.id}>
                  <td>{index + 1}</td>
                  <td>{organization.name}</td>
                  <td>{organization.email}</td>
                  <td>{organization.phone}</td>
                  <td>{organization.address}</td>
                  <td>00012</td>
                  <td>
                    {new Date(
                      organization.date_joined
                    ).toLocaleDateString("en-GB")}
                  </td>
                  <td>{organization.subscription_plan_name}</td>
                  <td>
                    <div className="action-btns">
                      <Link
                        to={{
                          pathname: "/admin-dashboard/user-profile",
                          search: `?num_certificates_uploaded=${encodeURIComponent(
                            organization.num_certificates_uploaded
                          )}
                          &name=${encodeURIComponent(organization.name)}
                          &phone=${encodeURIComponent(organization.phone)}
                          &address=${encodeURIComponent(
                            organization.address
                          )}
                          &id=${organization.id}
                          &subscription_start_time=${encodeURIComponent(
                            organization.subscription_start_time
                          )}
                          &subscription_end_time=${encodeURIComponent(
                            organization.subscription_end_time
                          )}
                          &subscription_plan_name=${encodeURIComponent(
                            organization.subscription_plan_name
                          )}
                          &subscription_duration=${encodeURIComponent(
                            organization.subscription_duration
                          )}
                          &email=${encodeURIComponent(organization.email)}
                          &date_joined=${encodeURIComponent(
                            organization.date_joined
                          )}`,
                        }}
                        className="prof-bank-btn"
                      >
                        View Profile
                      </Link>

                      <button
                        onClick={() => handleDelete(organization.id)}
                        disabled={deletingId === organization.id}
                      >
                        {deletingId === organization.id ? "Deleting..." : "Remove"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
    </div>
  );
}
