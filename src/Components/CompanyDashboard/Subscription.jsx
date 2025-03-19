import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../../config";
import CheckIcon from '@mui/icons-material/Check';

import CheckCmvp from '../../assets/Img/check-cmvp.svg';



export default function Subscription() {
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
                // console.log("Fetched Plans Data: ", data.results);
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
                    const response = await fetch(`${config.API_BASE_URL}/api/subscription/auth/api/user-multiple-subscriptions/${authUserId}/`, {
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


//   const handleSubscribeClick = async (planId) => {
//         setIsSubscribing(planId);
//         const authToken = sessionStorage.getItem("authToken");
//         const authUserId = sessionStorage.getItem("authUserId");
    
//         if (!authToken) {
//             setFlashMessage("Please login or register to continue");
//             setTimeout(() => {
//                 setFlashMessage("");
//                 navigate("/login");
//             }, 3000);
//             setIsSubscribing(null);
//             return;
//         }
    
//         const payload = {
//             user: authUserId,
//             subscription_plan: planId,
//             subscribed_duration: 1  // Default to 1 month
//         };
    
//         try {
//             const response = await fetch(`${config.API_BASE_URL}/api/subscription/auth/api/user-subscriptions/`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${authToken}`
//                 },
//                 body: JSON.stringify(payload)
//             });
    
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.detail || "Failed to subscribe");
//             }
    
//             const result = await response.json();

//             sessionStorage.setItem("is_subscribed", true); // Store subscription data in local storage

//             navigate("/dashboard");
//             // window.location.href = result.payment_link;  // Redirect to Remita payment page

//         } catch (error) {
//             console.error("Error subscribing:", error);
//             setFlashMessage(error.message || "An unexpected error occurred");
//             setTimeout(() => setFlashMessage(""), 3000);
//         } finally {
//             setIsSubscribing(null);
//         }
//     };
    

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


    const isLoggedIn = sessionStorage.getItem("authToken")


    return (

                    <div  className="Pricing_Sec">
                    <div className="Pricing_top">
                        <h3 className="big-text">Subscription Plans</h3>
                        <p className="paopa">Subscription plans for certificate management and verification portal (CMVP).</p>
                    </div>


                    <div className="oahhs_Sec kjaiik2">
                    <div className={`oahhs_Card ${isLoggedIn ? "current-sub-card" : ""}`}>
                            <h3>FREE plan</h3>
                            <p>All-in-one certificate management package available for a limited time.</p>
                            <button>free <span>/one month</span></button>
                            <ul>
                                <li><CheckIcon /> Access to Portal for 14 days after Registration</li>
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

                                    <li><CheckIcon /> {plan.features.num_daily_certificate_upload === "UNLIMITED"
                                        ? "Create unlimited certificates daily"
                                        : `Create ${plan.features.num_daily_certificate_upload} certificates daily`}
                                    </li>

                                    <li><CheckIcon /> 
                                        {plan.features.num_daily_certificate_upload === "UNLIMITED"
                                        ? "Add unlimited certificate categories"
                                        : `Add ${plan.features.num_daily_certificate_upload} certificate categories`}
                                    </li>
                                    {plan.features.access_deleted_certificates_files && <li><CheckIcon /> Access to deleted certificates and files</li>}
                                    {plan.features["24/7_support"] && <li><CheckIcon /> 24/7 support</li>}
                                </ul>

                                <Link
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSubscribeClick(plan);
                                        // handleSubscribeClick(plan.unique_subscription_plan_id);
                                    }}
                                    className="btn-bg"
                                    >
                                    {isSubscribing === plan.unique_subscription_plan_id ? "Subscribing..." : "Subscribe"}
                                </Link>
                                {flashMessage && <div className="flash-message">{flashMessage}</div>}
                            </div>
                        ))}
                    </div>


                                </div>
                  

    );
}
