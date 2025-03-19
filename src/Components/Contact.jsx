import React, { useState } from "react";
import { Link } from "react-router-dom";
import config from "../config";

import ChatIcon from '../assets/Img/contact-chat-icon.svg';
import LocationIcon from '../assets/Img/location-icon.svg';
import CallIcon from '../assets/Img/call-icon.svg';


export default function HelpPage() {

    // State for form inputs
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        serviceInterest: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/accounts/auth/send-contact-email/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`Failed to send message: ${response.statusText}`);
            }

            const data = await response.json();
            alert("Message sent successfully!");
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                serviceInterest: "",
                message: ""
            });
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send the message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="CnMMha-page">
               <div className="TThero-Blam">
                <div className="site-container">
                    <h2 className="big-text">Contact us</h2>
                    </div>
                </div>


            <div className="contact-Dlts">
                <div className="site-container GG_Padded">
                    <div className="Contact_SeccO_1">
                        <h2>Need Help?</h2>
                        <p>Please fill the form to submit your enquiry, providing as much information as possible, and we'll get back to you as swiftly as possible.</p>
                        <ul>
                        <li>
                                <span className="DDl_Span">
                                    <img src={LocationIcon} alt="Location icon" />
                                </span>
                                <div className="DDl_Div">
                                    <h4>Plot 5 Owule Ojuan Street, off Peter Odili Road, Trans Amadi, Port Harcourt, Rivers</h4>
                                </div>
                            </li>

                            <li>
                                <span className="DDl_Span">
                                    <img src={CallIcon} alt="Call icon" />
                                </span>
                                <div className="DDl_Div">
                                    <h4><a href="tel:+2348079701019">+234 807 970 1019</a><br></br> <a href="tel:+2349114597013">+234 911 459 7013</a></h4>
                                </div>
                            </li>

                            <li>
                                <span className="DDl_Span">
                                    <img src={ChatIcon} alt="Chat icon" />
                                </span>
                                <div className="DDl_Div">
                                    <h4><a href="mailto:support@cmvp.net">support@cmvp.net</a></h4>
                                </div>
                            </li>
                            
                           
                        </ul>
                    </div>

                    <div className="message_Sec">
                        <form className="message-form" onSubmit={handleSubmit}>
                            {/* <div className="message-DFlex">
                                <div className="message-form-input">
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="Full Name"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="message-form-input">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div> */}
                            {/* <div className="message-DFlex">
                                <div className="message-form-input">
                                    <input
                                        type="text"
                                        name="phone"
                                        placeholder="Phone Number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                              
                            </div> */}

                                <div className="message-DFlex">
                                <div className="message-form-input">
                                    <input
                                        type="text"
                                        name="text"
                                        placeholder="First Name*"
                                        required
                                    />
                                </div>

                                <div className="message-form-input">
                                    <input
                                        type="text"
                                        name="text"
                                        placeholder="Last Name*"
                                        required
                                    />
                                </div>
                              
                            </div>

                            <div className="message-form-input">
                                    <input
                                        type="text"
                                        name="text"
                                        placeholder="Company Email*"
                                        required
                                    />
                                </div>

                                <div className="message-form-input">
                                    <input
                                        type="text"
                                        name="text"
                                        placeholder="Company Name*"
                                        required
                                    />
                                </div>


                            <div className="message-form-input">
                                <textarea
                                    name="message"
                                    placeholder="Your message..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="message-form-input">
                                <button type="submit" disabled={isSubmitting} className="btn-bg bbao">
                                    {isSubmitting ? "Sending..." : "Send Message"}
                                </button>
                            </div>


                           
                        </form>
                    </div>
                </div>

                <div className="site-container">

                <div className="gaghsui-sess">
                <p>All our services are carried out with the clear understanding that our customer data privacy is important, and we are committed to the protection of personal information in accordance with the General Data Protection Regulation (GDPR), the Nigeria Data Protection Act (NDPA), and other relevant global privacy regulations. For more information about our Data & Privacy Policy, please visit <Link to="/privacy-policy">Privacy Policy</Link></p>
                </div>

                </div>
            </div>


        </div>
    );
}
