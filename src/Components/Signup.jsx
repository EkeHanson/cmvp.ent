import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";
import { Link } from "react-router-dom";
import axios from "axios";
import FlashMessage from "./FlashMessage/FlashMessage"

import ShowPassIcon from "../assets/Img/showPass-icon.svg";
import HidePassIcon from "../assets/Img/hidePass-icon.svg";

const Signup = () => {

  const [flash, setFlash] = useState(null);

  const showMessage = (message, type) => {
      setFlash({ message, type });
    };


  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false); // Track checkbox state

  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password"); // State for confirm password visibility
  const [formData, setFormData] = useState({
    email: "",
    companyName: "",
    company_official_mail: "",
    phone: "",
    address: "",
    registration_number: "",
    password: "",
    confirmPassword: "",
    logo: null,
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (name === "phone" && value.length > 15) {
      return;
    }

    if (name === "password") {
      setPasswordStrength(assessPasswordStrength(value));
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isChecked) {
      setErrorMessage("You must agree to the Terms of Use and Privacy Policy.");
      showMessage("You must agree to the Terms of Use and Privacy Policy.", "failure")
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("email", formData.email);
    formDataToSend.append("name", formData.companyName);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("registration_number", formData.registration_number);
    formDataToSend.append("company_official_mail", formData.company_official_mail);
    formDataToSend.append("password", formData.password);

    if (formData.logo) {
      formDataToSend.append("logo", formData.logo);
    }

    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/api/accounts/auth/organization/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    
      setSuccessMessage(
        "Account created successfully. Please check your email to confirm your account."
      );
      setFormData({
        email: "",
        companyName: "",
        phone: "",
        address: "",
        password: "",
        registration_number: "",
        confirmPassword: "",
        company_official_mail: "",

        logo: null,
      });
    
      showMessage("Account created successfully. Please check your email to confirm your account.", "success");
      navigate(`/verification-code/:code/${formData.email}`);
    
    } catch (error) {
      console.error("Signup error:", error.response?.data);
    
      if (error.response?.data?.errors) {
        const errorDetails = error.response.data.errors;
        let errorMessages = "";
    
        Object.keys(errorDetails).forEach((field) => {
          errorMessages += `${field}: ${errorDetails[field].join(", ")}\n`;
        });
    
        setErrorMessage(errorMessages);
        showMessage(errorMessages, "failure");

      } else {
        setErrorMessage("Failed to create an account. Please try again.");
        navigate(`/verification-code/:code/${formData.email}`);
      }
    } finally {
      setIsLoading(false);
    }
    
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


  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  return (
    <div>
      <section className="Get-Seecos signup-desis">
        <div className="site-container">
          <div className="Reg_Sec">
            <div className="Reg_Box">
              <div className="Reg_Box_Header">
                <h3>Get started with CMVP</h3>
                <p>FOR BUSINESS</p>
              </div>
              
              {flash && (
                  <FlashMessage
                  message={flash.message}
                  type={flash.type}
                  onClose={() => setFlash(null)} // Remove flash message after timeout
                  />
                )}

              <form className="Reg_Form" onSubmit={handleFormSubmit}>
                <div className="Reg_Input">
                <label>Registration Email (Your Company Email )</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Registration Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="OO-D-flex">
                  <div className="Reg_Input">
                    <label>Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      placeholder="Enter Company Name"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="Reg_Input">
                    <label>Phone number</label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="Enter Phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="Reg_Input">
                    <label>Company Official Email</label>
                    <input
                      type="text"
                      name="company_official_mail"
                      placeholder="Enter Company Official Email"
                      value={formData.company_official_mail}
                      onChange={handleInputChange}
                    />
                  </div>

                <div className="Reg_Input">
                  <label>Company Registration Number</label>
                  <input
                    type="text"
                    name="registration_number"
                    placeholder="Enter Company Registration Number"
                    value={formData.registration_number}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                

                <div className="Reg_Input">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>



                <div className="Reg_Input">
                  <label>Country</label>
                  <select>
                    <option>--Select Country--</option>
                    <option>Nigeria</option>
                  </select>
                </div>

                
                <div className="Reg_Input">
                  <label>City</label>
                  <select>
                    <option>--Select City--</option>
                    <option>Umahia Abia state</option>
                  </select>
                </div>



                <div className="Reg_Input Upload-input">
                  <label>Upload Company Logo</label>
                  <input
                    type="file"
                    name="logo"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="Reg_Input pass-Input">
                  <input
                    type={passwordType}
                    name="password"
                    id="passwordField"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <span onClick={togglePasswordVisibility}>
                    <img
                      src={passwordType === "password" ? ShowPassIcon : HidePassIcon}
                      alt={passwordType === "password" ? "Show Password" : "Hide Password"}
                    />
                  </span>
                </div>

                <div className="Reg_Input pass-Input">
                  <input
                    type={confirmPasswordType}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <span onClick={toggleConfirmPasswordVisibility}>
                    <img
                      src={confirmPasswordType === "password" ? ShowPassIcon : HidePassIcon}
                      alt={confirmPasswordType === "password" ? "Show Password" : "Hide Password"}
                    />
                  </span>
                </div>

                <div className="Reg_Input hgahs-ooa">
                <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
                  <p>
                   I agree that I have read, concent to CMVP{" "}
                    <a href="/terms-of-use" target='_blank'>Terms of Use</a> and {" "}
                    <a href="/privacy-policy" target='_blank'>Privacy Policy</a>.

                  </p>
                </div>

                <div className="Reg_Input">
                  <div className="password-strength">
                    <p>Password Strength: {passwordStrength}</p>
                    <div
                      className={`strength-bar ${
                        passwordStrength.toLowerCase()
                      }`}
                    ></div>
                  </div>

                  <button
                    type="submit"
                    className="btn-bg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing Up..." : "Sign Up"}
                  </button>
                </div>
              </form>

              {errorMessage && <p className="error-message">{errorMessage}</p>}
              {successMessage && <p className="success-message">{successMessage}</p>}

              <div className="Reg_Box_Foot">
                <p>
                  Already have an account? <Link to="/login">Log in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;