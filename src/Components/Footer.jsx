import React, { useState } from "react";
import config from "../config";
import Logo from "../assets/Img/logo-lit.png";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress for the loader
import FlashMessage from "./FlashMessage/FlashMessage"

function Footer() {

    const [flash, setFlash] = useState(null);
    
    const showMessage = (message, type) => {
          setFlash({ message, type });
        };
    
  const [email, setEmail] = useState(""); // Email state
  const [isLoading, setIsLoading] = useState(false); // Loading state



  const handleSubscribe = async () => {
    if (!email) {
      showMessage("Please enter a valid email", "failure");
      return;
    }

    setIsLoading(true); // Set loading to true when the request starts

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/newslettersubscription/auth/api/subscribe/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // Send email as JSON payload
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("Subscription successful!", "success");
        setEmail(""); // Clear email input after successful
      } else {
        showMessage(data.message || "Subscription failed", "error");
      }
    } catch (error) {
      showMessage("Something went wrong. Please try again.", "error");
    } finally {
      setIsLoading(false); // Set loading to false after request completes
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="Footer">
      <div className="site-container">
        <div className="top_Footer">
          <div className="foot_cnt_1">
            <Link to="/">
              <img src={Logo} alt="Logo" />
            </Link>

            <div className="NewSletter">

            {flash && (
                  <FlashMessage
                  message={flash.message}
                  type={flash.type}
                  onClose={() => setFlash(null)} // Remove flash message after timeout
                  />
                )}


              <h3>Subscribe now for Updates</h3>
              <div className="NewSletter-input">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleSubscribe} disabled={isLoading}>
                  {isLoading ? (
                   "Subscribibg ... "// Show spinner while loading
                  ) : (
                    <ArrowForwardIcon />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="foot_cnt_2">
            <div className="foot_cnt_Nav">
              <Link to="/about-cmvp">About CMVP</Link>
              <Link to="/how-it-works">How it Works</Link>
              <Link to="/pricing">Subscription Plans</Link>
              <Link to="/contact-us">Contact Us</Link>
              <Link to="/faq">FAQ</Link>
            </div>
            <div className="foot_cnt_Nav">
              <Link to="/terms-of-use">
                Terms of Use
              </Link>
              <Link to="/privacy-policy">
                Privacy Policy
              </Link>
            </div>

            <div className="connect-sec">
              <div className="social-media">
                {/* Social media links */}
              </div>
            </div>
          </div>
        </div>
        <div className="sub-footer">
          <p>
            <a href="https://www.prolianceltd.com/">Powered by Proliance LTD</a>
          </p>
          <span>© {currentYear} CMVP. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
}

export default Footer;