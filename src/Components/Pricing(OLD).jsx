import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../config";
import CheckIcon from '@mui/icons-material/Check';

import CheckCmvp from '../assets/Img/check-cmvp.svg';
import FlashMessage from "./FlashMessage/FlashMessage"

export default function Pricing() {

    const [flash, setFlash] = useState(null);
    
    const showMessage = (message, type) => {
        setFlash({ message, type });
        };

    const [plans, setPlans] = useState([]);
    const [isSubscribing, setIsSubscribing] = useState(null);
    const [isLoading, setIsLoading] = useState(false); 
    

    const navigate = useNavigate();
    const [flashMessage, setFlashMessage] = useState(""); // State for flash message

    useEffect(() => {
        // Fetch subscription plans
        const fetchPlans = async () => {
            try {
                const response = await fetch(`${config.API_BASE_URL}/api/subscription/auth/api/subscription-plans/`);
                const data = await response.json();
                setPlans(data.results); // The actual plans are in `results` array
                console.log("Fetched Plans Data: ", data.results);
            } catch (error) {
                console.error("Error fetching subscription plans:", error);
            }
        };
        fetchPlans();



        // Check if the user is logged in and fetch subscription details
        const fetchSubscriptionDetails = async () => {
            const authToken = sessionStorage.getItem("authToken");
            const authUserId = sessionStorage.getItem("authUserId");

            if (authToken && authUserId) {
                try {
                    const response = await fetch(`${config.API_BASE_URL}/api/subscription/auth/api/user-subscription/${authUserId}/`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${authToken}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch subscription details");
                    }

                    const data = await response.json();

                    sessionStorage.setItem("subscriptionDetails", JSON.stringify(data)); // Store subscription data in local storage
                    //console.log("Subscription Details: ", data);

                } catch (error) {
                    console.error("Error fetching subscription details:", error);
                }
            }
        };
        fetchSubscriptionDetails();
    }, []); 


  const handleSubscribeClick = async (planId) => {
        setIsSubscribing(planId);
        const authToken = sessionStorage.getItem("authToken");
        const authUserId = sessionStorage.getItem("authUserId");
    
        if (!authToken) {
            setFlashMessage("Please login or register to continue");
            setTimeout(() => {
                setFlashMessage("");
                navigate("/login");
            }, 3000);
            setIsSubscribing(null);
            return;
        }
    
        const payload = {
            user: authUserId,
            subscription_plan: planId,
            subscribed_duration: 1  // Default to 1 month
        };
    
        try {
            const response = await fetch(`${config.API_BASE_URL}/api/subscription/auth/api/user-subscriptions/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify(payload)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to subscribe");
            }
    
            const result = await response.json();

            navigate("/dashboard");
            // window.location.href = result.payment_link;  // Redirect to Remita payment page

        } catch (error) {
            console.error("Error subscribing:", error);
            setFlashMessage(error.message || "An unexpected error occurred");
            setTimeout(() => setFlashMessage(""), 3000);
        } finally {
            setIsSubscribing(null);
        }
    };
    
    

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const transactionStatus = queryParams.get("status");
        const transactionId = queryParams.get("transactionId");
    
        if (transactionStatus && transactionId) {
            fetch(`${config.API_BASE_URL}/api/subscription/auth/payment-confirmation/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("authToken")}`
                },
                body: JSON.stringify({
                    status: transactionStatus,
                    transactionId: transactionId
                })
            })
            .then(response => response.json())
            .then(data => {
                setFlashMessage(data.message);
                setTimeout(() => navigate("/dashboard"), 3000);
            })
            .catch(error => {
                console.error("Error confirming payment:", error);
                setFlashMessage("Payment confirmation failed.");
            });
        }
    }, []);



    
    return (
        <div className="Landing-page MMha-page subscript-page">

                <div className="Top_Plannsia oaiia">
                    <div className="site-container">
                    <div  className="Pricing_Sec">
                    <div className="Pricing_top UUya_Ooa">
                        <h3 className="big-text">CMVP Subscription Plan</h3>
                        <p>Subscription plans for CMVP is tailored to meet the specific needs of different organizations. </p>
                    </div>

                    <div className="oahhs_Sec">
                    <div className="oahhs_Card current-sub-card">
                            <h3>FREE plan</h3>
                            <p>All-in-one certificate management package available for a limited time.</p>
                            <button>free <span>/one month</span></button>
                            <ul>
                                <li><CheckIcon /> Access to Portal for 15 days after Registration</li>
                                <li><CheckIcon /> Add 3 certificate categories daily</li>
                                <li><CheckIcon /> Upload 5 certificates daily</li>
                                <li><CheckIcon /> Access to deleted certificates and files</li>
                                <li><CheckIcon /> 24/7 support</li>
                            </ul>
                            {/* <a href="#">Free Trial</a> */}
                            <Link to="/signup">Free Trial</Link>
                        </div>
                        {plans.map((plan) => (
                            <div className="oahhs_Card" key={plan.id}>
                                <h3>{plan.name.toUpperCase()}</h3>
                                <p>Custom plan tailored for your certificate management needs.</p>
                                <button>NGN {parseFloat(plan.price_per_month).toLocaleString()} <span>/per month</span></button>
                                <ul>
                                    <li><CheckIcon /> Access to portal</li>
                                    <li><CheckIcon /> Add up to {plan.features.num_certificate_categories} certificate categories</li>
                                    <li><CheckIcon /> Upload up to {plan.features.num_daily_certificate_upload} certificates daily</li>
                                    {plan.features.access_deleted_certificates_files && <li><CheckIcon /> Access to deleted certificates and files</li>}
                                    {plan.features["24/7_support"] && <li><CheckIcon /> 24/7 support</li>}
                                </ul>
                                {/* <a href="#" onClick={() => handleSubscribeClick(plan.id)}>Subscribe</a> */}

                                <Link
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSubscribeClick(plan.unique_subscription_plan_id);
                                    }}
                                    className="btn-bg"
                                    >
                                    {isSubscribing === plan.unique_subscription_plan_id ? "Subscribing..." : "Subscribe"}
                                </Link>
                                {flashMessage && <div className="flash-message">{flashMessage}</div>}
                            </div>
                        ))}
                    </div>



                                    <div className='hag_Top hhags' data-aos="fade-up">
                                    <div className='hag_Top_1'>
                                        <img src={CheckCmvp}></img>
                                    </div>
                                    <div className='hag_Top_2'>
                                        <h2 className='big-text'>Meet your records <span>management compliance</span> needs with <span>CMVP</span></h2>
                                        <Link to="/about-cmvp">About CMVP</Link>
                                    </div>
                                    </div>
                                </div>


                

                    </div>
                </div>

           


        </div>
    );
}
