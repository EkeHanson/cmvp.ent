import React, { useState } from "react";
import { Link } from "react-router-dom";
import config from "../config";
import axios from "axios";
import FlashMessage from "./FlashMessage/FlashMessage"

const ForgotPassPage = () => {

  const [flash, setFlash] = useState(null);

  const showMessage = (message, type) => {
      setFlash({ message, type });
    };

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/api/accounts/auth/password-reset/`,
        { email }
      );
      setMessage("Password reset instructions have been sent to your email.");
      showMessage("Password reset instructions have been sent to your email.", "success")
      //alert("Password reset instructions have been sent to your email.");
      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "An error occurred. Please check the email address and try again."
      );
      showMessage("An error occurred. Please check the email address and try again.", "failure")

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

                {flash && (
                  <FlashMessage
                  message={flash.message}
                  type={flash.type}
                  onClose={() => setFlash(null)} // Remove flash message after timeout
                  />
                )}
                
                <h3>Forgot Password?</h3>
                <p>Enter your email address below</p>
              </div>
              <form className="Reg_Form" onSubmit={handleFormSubmit}>
                <div className="Reg_Input">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleInputChange}
                    required
                  />
                </div>


                <div className="Reg_Input">
                  <button
                    type="submit"
                    className="btn-bg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassPage;


// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import config from "../config";
// import axios from "axios";
// import FlashMessage from "../assets/FlashMessage";

// const ForgotPassPage = () => {
//   const [email, setEmail] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [flashMessage, setFlashMessage] = useState(null); // Manage flash message

//   const handleInputChange = (e) => {
//     setEmail(e.target.value);
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     setFlashMessage(null); // Reset any existing flash message
//     setIsSubmitting(true);

//     try {
//       await axios.post(`${config.API_BASE_URL}/api/accounts/auth/password-reset/`, { email });
//       setFlashMessage({ message: "Password reset instructions have been sent to your email.", type: "success" });
//       setEmail("");
//     } catch (err) {
//       setFlashMessage({
//         message: err.response?.data?.detail || "An error occurred. Please check the email address and try again.",
//         type: "error",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div>
//       <section className="Get-Seecos login-desis">
//         <div className="site-container">
//           <div className="Reg_Sec">
//             <div className="Reg_Box">
//               <div className="Reg_Box_Header">
//                 <h3>Forgot Password?</h3>
//                 <p>Enter your email address below</p>
//               </div>
//               <form className="Reg_Form" onSubmit={handleFormSubmit}>
//                 <div className="Reg_Input">
//                   <input
//                     type="email"
//                     name="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
//                 <div className="Reg_Input">
//                   <button type="submit" className="btn-bg" disabled={isSubmitting}>
//                     {isSubmitting ? "Sending..." : "Send Reset Link"}
//                   </button>
//                 </div>
//               </form>

//               {/* Render FlashMessage when flashMessage is set */}
//               {flashMessage && (
//                 <FlashMessage
//                   message={flashMessage.message}
//                   type={flashMessage.type}
//                   onClose={() => setFlashMessage(null)}
//                 />
//               )}

//               <div className="Reg_Box_Foot">
//                 <p>
//                   <Link to="/login">Login</Link> instead!
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default ForgotPassPage;
