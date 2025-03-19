import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import config from "../config";
import axios from "axios";

import ShowPassIcon from "../assets/Img/showPass-icon.svg";
import HidePassIcon from "../assets/Img/hidePass-icon.svg";

const ForgotPassPageReset = () => {
     const navigate = useNavigate();
    const { uidb64, token } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordType, setPasswordType] = useState("password");
    const [passwordStrength, setPasswordStrength] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
  
    const togglePasswordVisibility = () => {
      setPasswordType((prevType) =>
        prevType === "password" ? "text" : "password"
      );
    };
  
    const assessPasswordStrength = (password) => {
      if (!password) return "";
      const strengthCriteria = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[a-z]/.test(password),
        /\d/.test(password),
        /[!@#$%^&*(),.?":{}|<>]/.test(password),
      ];
  
      const metCriteria = strengthCriteria.filter(Boolean).length;
  
      switch (metCriteria) {
        case 0:
        case 1:
          return "Weak";
        case 2:
        case 3:
          return "Moderate";
        case 4:
        case 5:
          return "Strong";
        default:
          return "";
      }
    };
  
    const handleNewPasswordChange = (e) => {
      const password = e.target.value;
      setNewPassword(password);
      setPasswordStrength(assessPasswordStrength(password));
  
      // Check for minimum length requirement and update the error message
      if (password.length < 8) {
        setError("Password must be at least 8 characters long.");
      } else {
        setError(null); // Clear the error if the password meets the requirement
      }
    };
  
    const handleConfirmPasswordChange = (e) => {
      setConfirmPassword(e.target.value);
    };
  
    const handleFormSubmit = async (e) => {
      e.preventDefault();
      setMessage(null);
      setError(null);
  
      if (newPassword.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
      }
  
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
  
      if (passwordStrength === "Weak") {
        setError("Password is too weak. Please choose a stronger password.");
        return;
      }
  
      setIsSubmitting(true);
  
      try {
        const response = await axios.post(
          `${config.API_BASE_URL}/api/accounts/auth/reset-password/${uidb64}/${token}/`,
          { new_password: newPassword }
        );
        setMessage("Your password has been successfully reset.");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordStrength("");

        setTimeout(() => {
            navigate("/login");
          }, 1000);

      } catch (err) {
        console.error(err.response?.data);
        setError(
          err.response?.data?.error || "An error occurred. Please try again later."
        );
      } finally {
        setIsSubmitting(false);
      }
    };
  
    
    return (
      <div>
        <section className="Get-Seecos login-desis">
          <div className="site-container">
            <div className="Reg_Sec">
              <div className="Reg_Box">
                <div className="Reg_Box_Header">
                  <h3>Reset Your Password</h3>
                  <p>Enter your new password below.</p>
                </div>
                <form className="Reg_Form" onSubmit={handleFormSubmit}>
                  <div className="Reg_Input pass-Input">
                    <input
                      type={passwordType}
                      name="newPassword"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      required
                    />
                    <span id="togglePassword" onClick={togglePasswordVisibility}>
                      <img
                        src={passwordType === "password" ? ShowPassIcon : HidePassIcon}
                        alt={passwordType === "password" ? "Show Password" : "Hide Password"}
                      />
                    </span>
                  </div>
                  <div className="password-strength">
                    <p>Password Strength: {passwordStrength}</p>
                    <div
                      className={`strength-bar ${passwordStrength.toLowerCase()}`}
                    ></div>
                  </div>
                  <div className="Reg_Input">
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      required
                    />
                  </div>
                  <div className="Reg_Input">
                    <button
                      type="submit"
                      className="btn-bg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Reset Password"}
                    </button>
                  </div>
                </form>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
                <div className="Reg_Box_Foot">
                  <p>
                    <Link to="/login">Login</Link> instead!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };
  
  export default ForgotPassPageReset;
  