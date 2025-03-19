import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Img/logo-lit.png";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import InfoIcon from "@mui/icons-material/Info";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import CloseIcon from "@mui/icons-material/Close";

import MenuIcon from '@mui/icons-material/Menu';

import ContactPhoneIcon from '@mui/icons-material/ContactPhone';

function Navbar({ className }) {

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [activeToggle, setActiveToggle] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const navigate = useNavigate(); // Hook to handle navigation

  // Detect outside click to close dropdown
  const handleClickOutside = (e) => {
    if (
      !e.target.closest(".Drop_Down") &&
      !e.target.closest(".nav-content") &&
      !isMobile // Don't close automatically on mobile
    ) {
      setIsDropdownVisible(false);
      setActiveToggle(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMobile]);

  // Detect scroll to add class
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle window resize to check mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
      if (window.innerWidth > 1000) {
        setIsDropdownVisible(false); // Close dropdown when resizing to desktop
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    if (isMobile) {
      setIsDropdownVisible(true); // Always open on mobile
    } else {
      setIsDropdownVisible((prevState) => !prevState);
    }
    setActiveToggle((prevState) => !prevState);
  };

  // Handle link clicks to ensure navigation works
  const handleLinkClick = (e) => {
    e.preventDefault(); // Prevent default behavior
    setIsDropdownVisible(false);
    setActiveToggle(false);

    setTimeout(() => {
      navigate(e.target.getAttribute("href"));
    }, 0);
  };

  // Manage authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(!!sessionStorage.getItem("authToken"));
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
  };

  const handleMobileNavToggle = () => {
    setIsMobileNavOpen(true);
  };

  const handleMobileNavClose = () => {
    setIsMobileNavOpen(false);
    setIsDropdownVisible(false);
    setActiveToggle(false);

    
  };
  const handleReload = () => {
  window.location.reload()
    
  };

  const DrophandleMobileNavClose = () => {
    setIsMobileNavOpen(false);

    if (isMobile) {
      setIsDropdownVisible(true); // Always open on mobile
    } else {
      setIsDropdownVisible((prevState) => !prevState);
    }
    setActiveToggle((prevState) => !prevState);
    
  };

  
  useEffect(() => {
    const hasHardReloaded = sessionStorage.getItem("hasHardReloaded")
    if (isLoggedIn && !hasHardReloaded) {
      sessionStorage.setItem("hasHardReloaded", "true");
      window.location.reload();
    }
  }, []);
  
  return (
    <div className={`Navbar ${className} ${isScrolled ? "Scrolled_Nav" : ""} ${isMobileNavOpen ? "Mobile_Toggle_Nav" : ""}`}>
      <div className="site-container">
        <div className="NavBar-Main">
          {/* Logo Section */}
          <div className="nav-content first-Nav-link">
            <Link to="/" className="site-logo">
              <img src={Logo} className="pc-logo" alt="Logo" />
            </Link>
          </div>
          
          <button className="mobile-Nav-togger" onClick={handleMobileNavToggle}>
            <MenuIcon />
          </button>

          {/* Back Button Section */}
          <div className="nav-content hidden-Nav-links">
            <div className="Nav-Links">
              <button onClick={() => navigate(-1)}>
                <ArrowBackIcon />
                Go Back
              </button>
            </div>
          </div>

          <div className="nav-body" onClick={handleMobileNavClose}></div>

          {/* Main Navigation Section */}
          <div className="nav-content last-Nav-link hgahhs_Grand">
            <div className="Mobile_Top_Menu">
              <button onClick={handleMobileNavClose}><CloseIcon /></button>
            </div>
            <div className="Nav-Links">
              {/* Resources Dropdown */}
              <button onClick={toggleDropdown} className={activeToggle ? "active_Toggle" : ""}>
                Resources <ArrowDropDownIcon />
              </button>

              {/* Dropdown Menu */}
              {(isDropdownVisible || isMobile) && (
                <div className="Drop_Down">
                  <Link to="/about-cmvp" onClick={DrophandleMobileNavClose}>
                    <InfoIcon />
                    About CMVP
                  </Link>
                  <br />
                  <Link to="/contact-us" onClick={DrophandleMobileNavClose}>
                    <ContactPhoneIcon />
                    Contact Us
                  </Link>
                  <br />
                  <Link to="/faq" onClick={DrophandleMobileNavClose}>
                    <QuestionAnswerIcon />
                    FAQ
                  </Link>
                  <br />
                  <Link to="/how-it-works" onClick={DrophandleMobileNavClose}>
                    <SettingsIcon />
                    How it works
                  </Link>
                </div>
              )}

              {/* Other Navigation Links */}
              <Link to="/pricing" onClick={handleMobileNavClose}>Subscription Plans</Link>

            <Link to="/company-verification" onClick={handleMobileNavClose}>Company Verification Links</Link>


             

              {/* Authentication Links */}
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard" className="bordered-link" onClick={handleMobileNavClose}>Account</Link>
                  <Link to="/login" className="bordered-link sign-up-btn" onClick={handleLogout}>Log Out</Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="bordered-link" onClick={handleMobileNavClose}>Log In</Link>
                  <Link to="/signup" className="bordered-link sign-up-btn" onClick={handleMobileNavClose}>Sign Up</Link>
                </>
              )}

            {/* <Link to="/" className="verify-certificate-btn" onClick={handleReload}>Reload</Link> */}
           
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Navbar;
