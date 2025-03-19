import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import RemitaBDG from '../assets/Img/remita-bdg.png';
import CheckIcon from '@mui/icons-material/Check';
import axios from "axios";
import config from "../config";

function Payment() {
    const [paymentProof, setPaymentProof] = useState(null);
    const location = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false); // Added state
    const { user, subscription_plan, plan_name, plan_price, plan_features } = location.state || {};
    const [isYearly, setIsYearly] = useState(false);
    const [count, setCount] = useState(1);
    const monthlyPrice = plan_price;
    const yearlyPrice = monthlyPrice * 12;
    const amount = isYearly ? yearlyPrice * count : monthlyPrice * count;
    const vat = amount * 0.075; // 7.5% VAT
    const total = amount + vat;

    const featureLabels = {
        storage: "Storage",
        twentyFourSevenSupport: "24/7 Support",
        num_certificate_categories: "Number of Certificate Categories",
        num_daily_certificate_upload: "Number of Daily Certificate Uploads",
        access_deleted_certificates_files: "Access to Deleted Certificates & Files",
    };
    

    const subscriptionBenefits = Object.entries(plan_features).map(([key, value]) => {
        // Get a friendly label, default to formatted key if not in dictionary
        let formattedKey = featureLabels[key] || key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
        
        // Convert boolean values to "Yes" or "No"
        let formattedValue = typeof value === "boolean" ? (value ? "Yes" : "Yes") : value;
    
        return `${formattedKey}: ${formattedValue}`;
    });
    

    // Toggle Monthly/Yearly selection
    const handleToggle = () => {
        setIsYearly(prevState => {
            setCount(1); // Reset count when toggling
            return !prevState;
        });
    };

    // Handle count increase/decrease
    const handleCountChange = (type) => {
        setCount(prevCount => {
            const maxCount = isYearly ? 1 : 12; // Max 1 year, max 12 months
            if (type === "increase" && prevCount < maxCount) return prevCount + 1;
            if (type === "decrease" && prevCount > 1) return prevCount - 1;
            return prevCount;
        });
    };

    const handleFileChange = (event) => {
        setPaymentProof(event.target.files[0]);
    };

    // Handle payment confirmation

    const handlePaymentConfirmation = async () => {
        if (!paymentProof) {
            Swal.fire({
                title: "Error",
                text: "Please upload proof of payment before confirming.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        setIsSubmitting(true); // Start loading

        try {
            const formData = new FormData();
            formData.append("email", sessionStorage.getItem("authEmail"));
            formData.append("fullName", sessionStorage.getItem("authName"));
            formData.append("phone", sessionStorage.getItem("authPhone"));
            formData.append("amount_paid", total);
            formData.append("subscription_duration", isYearly ? `${count} Year(s)` : `${count} Month(s)`);
            formData.append("subscription_type", plan_name);
            formData.append("payment_proof", paymentProof);

            const response = await axios.post(
                `${config.API_BASE_URL}/api/accounts/auth/send-subscription-email/`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (response.status === 200 || response.message === "Email sent successfully") {
                Swal.fire({
                    title: "Thank you!",
                    text: "We will confirm your payment and update your subscription within 48 hours.",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            } else {
                throw new Error("Failed to send confirmation email.");
            }
        } catch (error) {
            console.error("Error sending payment confirmation email:", error);
            Swal.fire({
                title: "Error",
                text: "There was an issue sending your payment confirmation. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
        } finally {
            setIsSubmitting(false); // Stop loading
        }
    };

    return (
        <div className="Payment-sec">
            <div className="site-container">
                <div className="payment-main">
                    
                    {/* Plan Selection */}
                    <div className="payment-main-top">
                        <h3>{plan_name}</h3>
                        <p>
                            <span>Monthly</span>
                            <button 
                                className={isYearly ? "toggle-button-monthly-yearly" : ""} 
                                onClick={handleToggle}
                            ></button>
                            <span>Yearly</span>
                        </p>
                    </div>

                    <div className="payment-body">
                        
                        {/* Payment Method Section */}
                        <div className="payment-part-1">
                            <div className="payment-part-1-Main">
                                <h3>Payment method</h3>
                                <div className="hhhas-btns">
                                    <button>Bank Transfer</button>
                                    <a href="#"><img src={RemitaBDG} alt="Remita Payment" /></a>
                                </div>
                                <form className="bank-dlt-form">
                                    <h5>Account Details</h5>

                                    <div className="bank-dlt-form-input">
                                        <label>Bank Name:</label>
                                        <input type="text" readOnly value="First Bank" />
                                    </div>

                                    <div className="bank-dlt-form-input">
                                        <label>Account Name:</label>
                                        <input type="text" readOnly value="Proliance LTD" />
                                    </div>

                                    <div className="bank-dlt-form-input">
                                        <label>Account No.:</label>
                                        <input type="text" readOnly value="1234567890" />
                                    </div>

                                    <div className="bank-dlt-form-input">
                                        <label>Currency:</label>
                                        <input type="text" readOnly value="NGN" />
                                    </div>

                                    <div className="bank-dlt-form-input">
                                        <label>TIN:</label>
                                        <input type="text" readOnly value="20657895-0001" />
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Subscription Details Section */}
                        <div className="payment-part-2">
                            <ul>
                                {subscriptionBenefits.map((benefit, index) => (
                                    <li key={index}>
                                        <CheckIcon /> {benefit}
                                    </li>
                                ))}
                            </ul>

                            {/* Number of Months/Years Selection */}
                            <h2>
                                <b>Number of {isYearly ? "Year(s)" : "Month(s)"}</b>
                                <button>
                                    <span onClick={() => handleCountChange("decrease")}>-</span>
                                    <span>{count}</span>
                                    <span onClick={() => handleCountChange("increase")}>+</span>
                                </button>
                            </h2>

                            {/* Pricing Breakdown */}
                            <h3 className="ash-1">
                                <span>Amount</span>
                                <span>NGN{amount.toLocaleString()}</span>
                            </h3>

                            <h3 className="ash-2">
                                <span>VAT (7.5%)</span>
                                <span>NGN{vat.toLocaleString()}</span>
                            </h3>

                            <h3 className="ash-3">
                                <span>Total</span>
                                <span>NGN{total.toLocaleString()}</span>
                            </h3>

                            {/* <div className="mm-poaymmsn">
                                <label>Upload Proof of payment</label>
                                <input type="file" />
                            </div> */}
                            <div className="mm-poaymmsn">
                                <label>Upload Proof of payment</label>
                                <input type="file" onChange={handleFileChange} />
                            </div>

                            {/* Confirmation Button with Loader */}
                            <button
                                className="confrim-btn"
                                onClick={handlePaymentConfirmation}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "I’ve Sent the Money"}
                            </button>
                        </div>

                    </div> {/* End of payment-body */}
                </div> {/* End of payment-main */}
            </div> {/* End of site-container */}
        </div>
    );
}

export default Payment;
