import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import config from "../config";
import FlashMessage from "./FlashMessage/FlashMessage";

const VerificationCode = () => {
  const [flash, setFlash] = useState(null);
  const showMessage = (message, type) => setFlash({ message, type });

  const [inputs, setInputs] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(25);
  const [isResendVisible, setResendVisible] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  

  const pathSegments = location.pathname.split("/");
  const urlCode = pathSegments[pathSegments.length - 2].replace(/:/g, ""); // Remove colons
  const email = decodeURIComponent(pathSegments[pathSegments.length - 1]); // Extract email safely


  // ✅ Pre-fill verification code if found in URL
  useEffect(() => {
    if (/^\d{6}$/.test(urlCode)) {
      setInputs(urlCode.split("")); // Split code into array for input fields


      setTimeout(() => verifyCode(urlCode), 900); // Trigger verification automatically
    }
  }, [urlCode]);

  // ✅ Function to verify the code
  const verifyCode = async (code = inputs.join("")) => {
    if (code.length !== 6) {
      showMessage("Invalid or missing verification code.", "failure");
      return;
    }

    // console.log("Verifying Code:", code);
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${config.API_BASE_URL}/api/accounts/auth/api/verify-email/`, { token: code });

      console.log("Response:", response.data);

      if (response.status === 200) {
        sessionStorage.setItem("authToken", response.data.access);
        sessionStorage.setItem("authEmail", response.data.email);
        sessionStorage.setItem("authUserId", response.data.unique_subscriber_id);
        sessionStorage.setItem("authName", response.data.name);
        sessionStorage.setItem("authPhone", response.data.phone);
        sessionStorage.setItem("authAddress", response.data.address);
        sessionStorage.setItem("loginTime", response.data.login_time);

        showMessage("Email verification successful!", "success");
        navigate("/");
      }
    } catch (error) {

      console.error("Verification Error:", error);

      if (error.response) {
        const errorMsg = error.response.data.error || "Verification failed. Please try again.";
        showMessage(errorMsg, "failure");
      } else {
        showMessage("Error verifying code. Please check your connection and try again.", "failure");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle input change
  const handleInputChange = (index, event) => {
    const value = event.target.value;
    if (!/^\d$/.test(value)) return;

    setInputs((prev) => {
      const newInputs = [...prev];
      newInputs[index] = value;

      // Move focus to next input field
      const nextInput = document.getElementById(`input-${index + 1}`);
      if (nextInput) nextInput.focus();

      return newInputs;
    });
  };

  // ✅ Handle paste event (pre-fill all inputs)
  const handlePaste = (event) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData("text").trim();
    
    if (/^\d{6}$/.test(pasteData)) {
      setInputs(pasteData.split(""));
      verifyCode(pasteData); // Automatically verify if valid
    }
  };

  // ✅ Automatically verify when all 6 digits are filled manually
  useEffect(() => {
    if (inputs.join("").length === 6) {
      setTimeout(() => verifyCode(), 200); // Delay to ensure state updates properly
    }
  }, [inputs]);

  // ✅ Handle resend request
  const handleResend = async () => {
    setTimer(15);
    setResendVisible(false);
    setInputs(Array(6).fill(""));  // Reset the inputs
    setMessage("");  // Clear any existing message
  
    setLoading(true);
  
    try {
      await axios.post(`${config.API_BASE_URL}/api/accounts/auth/api/resend-verification/`, {email});
      showMessage("New verification email sent", "success");
    } catch (error) {
      console.error("Verification Error:", error);
      if (error.response) {
        const errorMsg = error.response.data.error || "Verification failed. Please try again.";
        showMessage(errorMsg, "failure");
      } else {
        showMessage("Error verifying code. Please check your connection and try again.", "failure");
      }
    } finally {
      setLoading(false);
    }
  };
  

  // ✅ Countdown timer for resend button
  useEffect(() => {
    if (timer === 0) {
      setResendVisible(true);
      return;
    }
    const intervalId = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(intervalId);
  }, [timer]);


  return (
    <>
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}

      <section className="Get-Seecos login-desis">
        <div className="site-container">
          <div className="Reg_Sec">
            <div className="Reg_Box">
              {flash && (
                <FlashMessage
                  message={flash.message}
                  type={flash.type}
                  onClose={() => setFlash(null)}
                />
              )}

              <div className="Reg_Box_Header">
                <h3>Verification Code</h3>
                <p>We Sent a 6-digit code to <span className="sppa-span">{email}</span></p>
              </div>

              <div className="Gland-Quest jjaao">
                <div className="Gland-Quest-data gghaja-flex">
                  {inputs.map((input, index) => (
                    <input
                      key={index}
                      id={`input-${index}`}
                      type="text"
                      maxLength={1}
                      value={input}
                      onChange={(e) => handleInputChange(index, e)}
                      onPaste={handlePaste}
                      disabled={loading}
                    />
                  ))}
                </div>
              </div>

              {message && <p className="message">{message}</p>}

              <div className="ghha-foot">
                <p>
                  Didn't receive the code?{" "}
                  {timer > 0 ? <span>Resend in {timer} sec</span> : isResendVisible && <button onClick={handleResend}>Resend</button>}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VerificationCode;
