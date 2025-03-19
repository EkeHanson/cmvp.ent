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



const handleSubscribeClick = (plan) => {
    setIsSubscribing(plan.unique_subscription_plan_id);

    // console.log("plan")
    // console.log(plan)
    // console.log("plan")

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

    // Store subscription details in state and navigate to the payment page
    navigate("/payment", { state: { 
        user: authUserId,
        subscription_plan: plan.unique_subscription_plan_id,
        plan_name: plan.name,
        plan_price: plan.price_per_month,
        plan_features: plan.features,
    }});
};


const isLoggedIn = sessionStorage.getItem("authToken")

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
                    {/* <div className="oahhs_Card current-sub-card"> */}
                    <div className={`oahhs_Card ${isLoggedIn ? "current-sub-card" : ""}`}>
                            <h3>FREE plan</h3>
                            <p>All-in-one certificate management package available for a limited time.</p>
                            <button>free <span>/one month</span></button>
                            <ul>
                                <li><CheckIcon /> Access to Portal for 14 days after Registration</li>
                                <li><CheckIcon /> Add up to 3 certificate categories</li>
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
                                    <li><CheckIcon /> {plan.features.num_daily_certificate_upload === "UNLIMITED"
                                        ? "Create unlimited certificates daily"
                                        : `Create ${plan.features.num_daily_certificate_upload} certificates daily`}
                                    </li>

                                    <li><CheckIcon /> 
                                        {plan.features.num_daily_certificate_upload === "UNLIMITED"
                                        ? "Add unlimited certificate categories"
                                        : `Add ${plan.features.num_daily_certificate_upload} certificate categories`}
                                    </li>

                                    {/* <li><CheckIcon /> Add up to {plan.features.num_certificate_categories} certificate categories</li>
                                    <li><CheckIcon /> Upload up to {plan.features.num_daily_certificate_upload} certificates daily</li>
                                     */}

                                    {plan.features.access_deleted_certificates_files && <li><CheckIcon /> Access to deleted certificates and files</li>}
                                    {plan.features["24/7_support"] && <li><CheckIcon /> 24/7 support</li>}
                                </ul>
                                <Link
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSubscribeClick(plan);
                                    }}
                                    className="btn-bg"
                                >
                                    Subscribe
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
