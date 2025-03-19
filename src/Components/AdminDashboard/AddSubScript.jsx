import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Use useNavigate instead of useHistory
import './Css/Dash.css';
import config from "../../config";

export default function AddSubScript() {
    const [planData, setPlanData] = useState({
        name: "",
        duration_in_months: 12,
        price_per_month: 0,
        features: {
            storage: "",
            num_certificate_categories: 0,
            num_daily_certificate_upload: 0,
            access_deleted_certificates_files: false,
            // maximum_login_users: 0,
            twentyFourSevenSupport: false // Updated to camelCase
        }
    });
    const [loading, setLoading] = useState(false); // Track loading state
    const navigate = useNavigate(); // Use useNavigate instead of useHistory

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name in planData.features) {
            setPlanData((prevData) => ({
                ...prevData,
                features: { ...prevData.features, [name]: value === "true" ? true : value === "false" ? false : value }
            }));
        } else {
            setPlanData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
    
        const requestPayload = {
            name: planData.name,
            duration_in_months: planData.duration_in_months,
            price_per_month: String(planData.price_per_month), // Ensure price is sent as a string
            features: {
                storage: planData.features.storage,
                num_certificate_categories: planData.features.num_certificate_categories,
                num_daily_certificate_upload: planData.features.num_daily_certificate_upload,
                access_deleted_certificates_files: planData.features.access_deleted_certificates_files, // Boolean already
                //maximum_login_users: planData.features.maximum_login_users,
                "24/7_support": planData.features.twentyFourSevenSupport // Updated to match API format
            }
        };
    
        try {
            // console.log("requestPayload")
            // console.log(requestPayload)
            // console.log("requestPayload")

            const response = await fetch(`${config.API_BASE_URL}/api/subscription/auth/api/subscription-plans/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestPayload),
            });
    
            if (response.ok) {
                navigate("/admin-dashboard/subscriptions"); // Redirect to subscription list after success
            } else {
                const errorData = await response.json();
                console.error("Error:", errorData);
            }
        } catch (error) {
            console.error("Error creating subscription plan:", error);
        } finally {
            setLoading(false); // Stop loading after the request
        }
    };
    

    return (
        <div className="DDD-Seco hhga-uua">
            <div className="SSS-Nbahs">
                <div className="Dash-Intro">
                    <h2>Add Subscription Plan</h2>
                </div>
                <form className="add-SUp-Form" onSubmit={handleSubmit}>
                    <div className="Supt-Input">
                        <label>What's the plan name?</label>
                        <input
                            type="text"
                            name="name"
                            value={planData.name}
                            onChange={handleChange}
                            placeholder="Enter plan name"
                            required
                        />
                    </div>

                    <div className="Supt-Input">
                        <label>Select currency</label>
                        <select>
                            <option>Naira (₦)</option>
                            <option>Dollar ($)</option>
                        </select>
                    </div>

                    <div className="Supt-Input">
                        <label>What's the amount per month?</label>
                        <input
                            type="number"
                            name="price_per_month"
                            value={planData.price_per_month}
                            onChange={handleChange}
                            placeholder="Enter amount per month"
                            required
                        />
                    </div>

                    <div className="Supt-Input">
                        <label>How many certificate categories can be added?</label>
                        <select
                            name="num_certificate_categories"
                            value={planData.features.num_certificate_categories}
                            onChange={handleChange}
                        >
                            <option value="0">--Select--</option>
                            {[5, 10, 15, 20, 25, 30, "UNLIMITED"].map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="Supt-Input">
                        <label>How many certificates can be uploaded daily?</label>
                        <select
                            name="num_daily_certificate_upload"
                            value={planData.features.num_daily_certificate_upload}
                            onChange={handleChange}
                        >
                            <option value="0">--Select--</option>
                            {[5, 10, 15, 20, 25, 30, "UNLIMITED"].map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="Supt-Input">
                        <label>Can files like PDF, JPEG, PNG be uploaded?</label>
                        <select
                            name="access_deleted_certificates_files"
                            value={planData.features.access_deleted_certificates_files}
                            onChange={handleChange}
                        >
                            <option value="false">--Select--</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>

                    {/* <div className="Supt-Input">
                        <label>Maximum login users</label>
                        <select
                            name="maximum_login_users"
                            value={planData.features.maximum_login_users}
                            onChange={handleChange}
                        >
                            <option value="0">--Select--</option>
                            {[5, 10, 15, 20, 25, 30, "UNLIMITED"].map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div> */}

                    <div className="Supt-Input">
                        <label>24/7 support</label>
                        <select
                            name="twentyFourSevenSupport" // Updated to camelCase
                            value={planData.features.twentyFourSevenSupport}
                            onChange={handleChange}
                        >
                            <option value="false">--Select--</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>

                    <div className="Supt-Input">
                        <button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Add Subscription Plan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
