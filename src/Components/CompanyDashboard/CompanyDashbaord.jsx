// import React, { useState } from "react";
// import { Routes, Route } from "react-router-dom";
// import "./Css/Dash.css";
// import "./Css/Dash2.css";
// import NavBar from "./NavBar";
// import PortalPage from "./Portal";
// import DashFooter from "./Dashfooter";
// import UploadedCert from "./UploadedCert";
// import DeletedUploadedCert from "./DeletedUploadedCert";
// import Notification from "./Notification";
// import LogonInfo from "./LogonInfo";
// import Profile from "./Profile";
// import Pricing from "./Pricing";
// import Subscription from "./Subscription";

// import SettingIcon from "./Img/settings-icon.svg";

// import BackgroundSelecttion from './BackgroundSelecttion';

// import ImageColorExtractor from '../ImageColorExtractor';

// import { ColorProvider } from "../ColorContext";

// export default function CompanyDashbaord() {





//   // State to control visibility of BackgroundSelecttion
//   const [showBackgroundSelection, setShowBackgroundSelection] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState[false]

//   // Toggle BackgroundSelecttion visibility
//   const handleBackgroundSelectionToggle = () => {
//     setShowBackgroundSelection(prevState => !prevState);
//   };

//   return (
//     <div className="CompanyDashbaord">
//       <NavBar />

//       {/* Button should only show when BackgroundSelecttion is hidden */}
//       {!showBackgroundSelection && (
//         <button 
//           className="Close_BGG_SEC_Box btn-bg2" 
//           onClick={handleBackgroundSelectionToggle}
//         >
//           <img src={SettingIcon} alt="Settings Icon" />
//         </button>
//       )}

//       {/* BackgroundSelecttion should only be shown when state is true */}
//       {showBackgroundSelection && (
//         <ColorProvider>
//           <ImageColorExtractor />
//           <BackgroundSelecttion />
//         </ColorProvider>
//       )}

//       <div className="MainPage_Content">
//         <div className="Large-container">
//           <Routes>
//             <Route path="/" element={<PortalPage />} />

//           <Route path="/" element={<PortalPage />} />

//             <Route path="/pricing" element={<Pricing />} />
//             <Route path="/uploaded-certificates" element={<UploadedCert />} />
//             <Route path="/deleted-certificates" element={<DeletedUploadedCert />} />
//             <Route path="/logon-info" element={<LogonInfo />} />
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/subscription" element={<Subscription />} />

//           </Routes>
//         </div>

//         <Routes>
//           <Route path="/notification" element={<Notification />} />
//         </Routes>
//       </div>

//       <div className="Large-container">
//         <DashFooter />
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom"; // Import useNavigate
import "./Css/Dash.css";
import "./Css/Dash2.css";
import NavBar from "./NavBar";
import PortalPage from "./Portal";
import DashFooter from "./Dashfooter";
import UploadedCert from "./UploadedCert";
import DeletedUploadedCert from "./DeletedUploadedCert";
import Notification from "./Notification";
import LogonInfo from "./LogonInfo";
import Profile from "./Profile";
import Pricing from "./Pricing";
import Subscription from "./Subscription";

import SettingIcon from "./Img/settings-icon.svg";
import BackgroundSelecttion from './BackgroundSelecttion';
import ImageColorExtractor from '../ImageColorExtractor';
import { ColorProvider } from "../ColorContext";

export default function CompanyDashbaord() {
  const navigate = useNavigate(); // Hook for navigation
  const [showBackgroundSelection, setShowBackgroundSelection] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("authToken"));

  // Redirect user to login if not logged in
  useEffect(() => {
    if (!sessionStorage.getItem("authToken")) {
      navigate("/login"); // Redirect to login page
    }
  }, [navigate]); // Runs when component mounts

  // Toggle BackgroundSelecttion visibility
  const handleBackgroundSelectionToggle = () => {
    setShowBackgroundSelection(prevState => !prevState);
  };

  return (
    <div className="CompanyDashbaord">
      <NavBar />

      {!showBackgroundSelection && (
        <button 
          className="Close_BGG_SEC_Box btn-bg2" 
          onClick={handleBackgroundSelectionToggle}
        >
          <img src={SettingIcon} alt="Settings Icon" />
        </button>
      )}

      {showBackgroundSelection && (
        <ColorProvider>
          <ImageColorExtractor />
          <BackgroundSelecttion />
        </ColorProvider>
      )}

      <div className="MainPage_Content">
        <div className="Large-container">
          <Routes>
            <Route path="/" element={<PortalPage />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/uploaded-certificates" element={<UploadedCert />} />
            <Route path="/deleted-certificates" element={<DeletedUploadedCert />} />
            <Route path="/logon-info" element={<LogonInfo />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/subscription" element={<Subscription />} />
          </Routes>
        </div>

        <Routes>
          <Route path="/notification" element={<Notification />} />
        </Routes>
      </div>

      <div className="Large-container">
        <DashFooter />
      </div>
    </div>
  );
}
