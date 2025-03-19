// import React, { useState, useContext, useRef, useEffect } from "react";
// import { useDropzone } from "react-dropzone";
// import axios from 'axios';
// import "./Css/Dash.css";
// import { ColorContext } from "../ColorContext";
// import SettingIcon from "./Img/settings-icon.svg";
// import CloseIcon from "./Img/close_icon.svg";
// import LitDashLogo from "./Img/liteDashLogo.png";
// import SeltImg1 from "./Img/AllSelImgs/1.jpg";
// import SeltImg2 from "./Img/AllSelImgs/2.jpg";
// import SeltImg3 from "./Img/AllSelImgs/3.jpg";
// import SeltImg4 from "./Img/AllSelImgs/4.jpg";
// import SeltImg5 from "./Img/AllSelImgs/5.jpg";
// import SeltImg6 from "./Img/AllSelImgs/6.jpg";
// import DefaultSampleImage from "../PageFixeImg.jpg";
// import config from "../../config.js";


// export default function BackgroundSelection() {
//   const { backgroundColor, setBackgroundColor } = useContext(ColorContext);
//   const [isUploading, setIsUploading] = useState(false);

//   const [selectedImage, setSelectedImage] = useState(null);
//   const [fileName, setFileName] = useState(null);
//   const [error, setError] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
//   const [showBackgroundSelection, setShowBackgroundSelection] = useState(true);
//   const [successMessage, setSuccessMessage] = useState(null); // State for success message
//   const [showSettingsButton, setShowSettingsButton] = useState(false); // State for visibility of settings button

//   const images = [SeltImg1, SeltImg2, SeltImg3, SeltImg4, SeltImg5, SeltImg6];

//   const backgroundSelectRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (backgroundSelectRef.current && !backgroundSelectRef.current.contains(event.target)) {
//         setShowPreview(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   useEffect(() => {
//     if (successMessage) {
//       const timer = setTimeout(() => setSuccessMessage(null), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [successMessage]);

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => setError(null), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error]);

//   const extractColor = (imageSrc) => {
//     const img = new Image();
//     img.src = imageSrc;
//     img.crossOrigin = "anonymous";
//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");
//       canvas.width = img.width;
//       canvas.height = img.height;
//       ctx.drawImage(img, 0, 0);

//       const x = Math.floor(img.width / 2);
//       const y = Math.floor(img.height / 2);
//       const pixelData = ctx.getImageData(x, y, 1, 1).data;

//       const hex = `#${((1 << 24) + (pixelData[0] << 16) + (pixelData[1] << 8) + pixelData[2])
//         .toString(16)
//         .slice(1)
//         .toUpperCase()}`;
//       setBackgroundColor(hex);
//     };
//   };

//   const handleBoxClick = (image) => {
//     setSelectedImage(image);
//     extractColor(image);
//     setShowPreview(true);
//   };

//   // const handleFileChange = (file) => {
//   //   if (file && file.type === "image/jpeg") {
//   //     setFileName(file.name);
//   //     const reader = new FileReader();
//   //     reader.onloadend = () => {
//   //       const imageSrc = reader.result;
//   //       setSelectedImage(imageSrc);
//   //       extractColor(imageSrc);
//   //       setShowPreview(true);
//   //     };
//   //     reader.readAsDataURL(file);
//   //     setError(null);
//   //   } else {
//   //     setError("Please select a JPEG image.");
//   //   }
//   // };


//    const handleFileChange = (file) => {
//     // if (file && file.type === "image/jpeg") {
//       setFileName(file.name);
//       setError(null);
//       uploadFile(file); // Automatically trigger the upload
//     // } else {
//     //   setError("Please select a JPEG image.");
//     // }
//   };

//   const uploadFile = async (file) => {
//     setIsUploading(true);  // Start loading
//     const formData = new FormData();
//     formData.append("backgroundImage", file);
//     formData.append("organization", localStorage.getItem("authUserId"));
  
//     try {
//         const response = await axios.post(
//             `${config.API_BASE_URL}/api/accounts/auth/background_image/`,
//             formData,
//             {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             }
//         );
//         console.log("Upload successful", response.data);
//         setSuccessMessage("Upload successful!");
//     } catch (error) {
//         console.error("Upload failed", error);
//         const apiErrorMessage = error.response?.data?.error || "Failed to upload the image. Please try again.";
//         setError(apiErrorMessage);
//     } finally {
//         setIsUploading(false);  // End loading
//     }
//   };
  


//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop: (acceptedFiles) => {
//       const file = acceptedFiles[0];
//       handleFileChange(file);
//     },
//     accept: ".jpg, .jpeg",
//     maxSize: 2 * 1024 * 1024,
//   });

//   const handleClose = () => {
//     setShowBackgroundSelection(false);
//     setShowSettingsButton(true); // Show settings button when background selection is closed
//   };

//   const handleBackgroundSelectionToggle = () => {
//     setShowSettingsButton(false); // Hide settings button when background selection is shown
//     setShowBackgroundSelection(true); // Show background selection
//   };

//   const company_name = localStorage.getItem("authName");
//   const company_unique_id = localStorage.getItem("authName");



//   return (
//     <>
//       {showBackgroundSelection && (
//         <div className="BackgroundSelecttion" ref={backgroundSelectRef}>
//           {showPreview && (
//             <div className="BGG_Prev">
//               <img
//                 src={selectedImage || DefaultSampleImage}
//                 className="BGG_Prev_BG"
//                 alt="Selected Background"
//               />
//               <div
//                 className="BGG_Prev_Gradi"
//                 style={{
//                   background: `linear-gradient(135deg, ${backgroundColor}, #0D2818)`,
//                   transition: "background 0.5s ease",
//                 }}
//               ></div>
//               <div className="ggg_1">
//                 <img src={LitDashLogo} alt="Logo" />
//               </div>
//               <div className="ggg_2">
//                 <h3>
//                   {company_name} <br />
//                   <span>Certificate</span> Verification
//                 </h3>
//                 <p
//                   style={{
//                     background: `linear-gradient(135deg, ${backgroundColor}, #0D2818)`,
//                     transition: "background 0.5s ease",
//                   }}
//                 >
//                   Verify certificate
//                 </p>
//               </div>

//               <div className="ggg_3">
//                 <p>Powered by Proliance LTD (ISO 9001 certified company)</p>
//               </div>
//             </div>
//           )}

          
//           <div className="BGG_Box">
//             <div className="BGG_Box_Top">
//               <span>
//                 <img src={CloseIcon} alt="Close Icon" onClick={handleClose} />
//               </span>
//             </div>
//             <div className="BGG_Box_Sub">
//               <p>
//                 Customize your <br />
//                 verification page
//               </p>
//             </div>

//             <div className="BGG_Box_Thumbs">
//               {images.map((image, index) => (
//                 <button
//                   key={index}
//                   onClick={() => handleBoxClick(image)}
//                   className="BGG_Box_Thumbs_Btn"
//                 >
//                   <img src={image} alt={`Thumbnail ${index + 1}`} />
//                 </button>
//               ))}
//             </div>

//             <div className="BGG_Box_Selected_Thumbs">
//             <p>Upload Background</p>
//             <div {...getRootProps()} className="dropzone">
//               <input {...getInputProps()} />
//               <button>
//                 <span>
//                   {fileName ? fileName : "Drag and Drop file here or choose file"}
//                 </span>
//               </button>
//             </div>
//             <h6>
//               Supported formats: JPEG <span>Max size: 2MB</span>
//             </h6>
//             {isUploading ? (
//               <h5>Uploading...</h5>
//                 ) : (
//                   <>
//                     {error && <h5>{error}</h5>}
//                     {successMessage && <h5 style={{ color: 'green' }}>{successMessage}</h5>}
//                   </>
//                 )}
//               </div>


//               <div className="BGG_Box_PUb_Btn">
//                 <button>Set Background</button>
//               </div>
//             </div>
//           </div>
//         )}

//                 {showSettingsButton && (
//                   <button
//                     className="Close_BGG_SEC_Box"
//                     onClick={handleBackgroundSelectionToggle}
//                   >
//                     <img src={SettingIcon} alt="Settings Icon" />
//                   </button>
//                 )}
//     </>
//   );
// }




import React, { useState, useContext, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from 'axios';
import "./Css/Dash.css";
import { ColorContext } from "../ColorContext";
import SettingIcon from "./Img/settings-icon.svg";
import CloseIcon from "./Img/close_icon.svg";
import LitDashLogo from "./Img/liteDashLogo.png";
import DefaultSampleImage from "../PageFixeImg.jpg";
import config from "../../config";

export default function BackgroundSelection() {
  const { backgroundColor, setBackgroundColor } = useContext(ColorContext);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showBackgroundSelection, setShowBackgroundSelection] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null); 
  const [showSettingsButton, setShowSettingsButton] = useState(false); 
  const [images, setImages] = useState([]); // State to hold images from API
  const [isSettingBackground, setIsSettingBackground] = useState(false);


  const backgroundSelectRef = useRef(null);

  const organizationID = localStorage.getItem("authUserId")

 useEffect(() => {
  const fetchImages = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/api/accounts/auth/organization/${organizationID}/backgorundImage/`);
      setImages(response.data.results.map(item => ({
        id: item.id,  // Ensure id is part of each item
        backgroundImage: item.backgroundImage
      })));

      // console.log("response.data.result")
      // console.log(response.data.results)
      // console.log("response.data.result")

    } catch (error) {
      console.error("Error fetching images", error);
    }
  };

  fetchImages();
}, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (backgroundSelectRef.current && !backgroundSelectRef.current.contains(event.target)) {
        setShowPreview(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const extractColor = (imageSrc) => {
    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const x = Math.floor(img.width / 2);
      const y = Math.floor(img.height / 2);
      const pixelData = ctx.getImageData(x, y, 1, 1).data;

      const hex = `#${((1 << 24) + (pixelData[0] << 16) + (pixelData[1] << 8) + pixelData[2])
        .toString(16)
        .slice(1)
        .toUpperCase()}`;
      setBackgroundColor(hex);
    };
  };

  // const handleBoxClick = (image) => {
  //   setSelectedImage(image);
  //   extractColor(image);
  //   setShowPreview(true);
  // };
  
  const handleBoxClick = (image) => {
    setSelectedImage(image);  // Ensure image includes an id
    extractColor(image.backgroundImage);  // Assuming backgroundImage is the URL
    setShowPreview(true);
  };

   const handleFileChange = (file) => {
    // if (file && file.type === "image/jpeg") {
      setFileName(file.name);
      setError(null);
      uploadFile(file); // Automatically trigger the upload
    // } else {
    //   setError("Please select a JPEG image.");
    // }
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("backgroundImage", file);
    formData.append("organization", localStorage.getItem("authUserId"));
  
    try {
        const response = await axios.post(
            `${config.API_BASE_URL}/api/accounts/auth/background_image/`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        //console.log("Upload successful", response.data);
        setSuccessMessage("Upload successful!");

        setTimeout(() => {
          window.location.reload();
        }, 1000);

    } catch (error) {
        console.error("Upload failed", error);
        const apiErrorMessage = error.response?.data?.error || "Failed to upload the image. Please try again.";
        setError(apiErrorMessage);
    } finally {
        setIsUploading(false); 
    }
  };
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      handleFileChange(file);
    },
    accept: ".jpg, .jpeg",
    maxSize: 2 * 1024 * 1024,
  });

  const handleClose = () => {
    setShowBackgroundSelection(false);
    setShowSettingsButton(true); 
  };

  const handleBackgroundSelectionToggle = () => {
    setShowSettingsButton(false); 
    setShowBackgroundSelection(true); 
  };

  const company_name = sessionStorage.getItem("authName");


// const handleSetBackground = async () => {
//   if (!selectedImage) {
//     setError("No image selected");
//     return;
//   }

//   try {
//     const response = await axios.post(
//       `${config.API_BASE_URL}/api/accounts/auth/organization/background_image/${selectedImage.id}/select/`
//     );
//     setSuccessMessage("Background image set successfully!");
//   } catch (error) {
//     console.error("Failed to set background image", error);
//     setError("Failed to set background image.");
//   }
// };


// const handleSetBackground = async () => {
//   if (!selectedImage) {
//     setError("No image selected");
//     return;
//   }

//   try {
//     const response = await axios.post(
//       `${config.API_BASE_URL}/api/accounts/auth/organization/background_image/${selectedImage.id}/select/`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//         }
//       }
//     );
//     setSuccessMessage("Background image set successfully!");

//     setTimeout(() => {
//       window.location.reload();
//     }, 1000);

//   } catch (error) {
//     console.error("Failed to set background image", error);
//     setError("Failed to set background image.");
//   }
// };

const handleSetBackground = async () => {
  if (!selectedImage) {
    setError("No image selected");
    return;
  }

  // Set loading state to true
  setIsSettingBackground(true);

  try {
    const response = await axios.post(
      `${config.API_BASE_URL}/api/accounts/auth/organization/background_image/${selectedImage.id}/select/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        }
      }
    );
    setSuccessMessage("Background image set successfully!");

    setTimeout(() => {
      window.location.reload();
    }, 1000);

  } catch (error) {
    console.error("Failed to set background image", error);
    setError("Failed to set background image.");
  } finally {
    // Set loading state to false after request completion
    setIsSettingBackground(false);
  }
};


  return (
    <>
      {showBackgroundSelection && (
        <div className="BackgroundSelecttion" ref={backgroundSelectRef}>
          {showPreview && (
            <div className="BGG_Prev">
              <img
                src={selectedImage?.backgroundImage || DefaultSampleImage}
                className="BGG_Prev_BG"
                alt="Selected Background"
              />

              <div
                className="BGG_Prev_Gradi"
                style={{
                  background: `linear-gradient(135deg, ${backgroundColor}, #0D2818)`,
                  transition: "background 0.5s ease",
                }}
              ></div>
              <div className="ggg_1">
                <img src={LitDashLogo} alt="Logo" />
              </div>
              <div className="ggg_2">
                <h3>
                  {company_name} <br />
                  <span>Certificate</span> Verification
                </h3>
                <p
                  style={{
                    background: `linear-gradient(135deg, ${backgroundColor}, #0D2818)`,
                    transition: "background 0.5s ease",
                  }}
                >
                  Verify certificate
                </p>
              </div>

              <div className="ggg_3">
                <p>Powered by Proliance LTD (ISO 9001 certified company)</p>
              </div>
            </div>
          )}

          <div className="BGG_Box">
            <div className="BGG_Box_Top">
              <span>
                <img src={CloseIcon} alt="Close Icon" onClick={handleClose} />
              </span>
            </div>
            <div className="BGG_Box_Sub">
              <p>
                Customize your <br />
                verification page
              </p>
            </div>

            <div className="BGG_Box_Thumbs">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleBoxClick(image)}
                  className="BGG_Box_Thumbs_Btn"
                >
                  <img src={image.backgroundImage} alt={`Thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>

            <div className="BGG_Box_Selected_Thumbs">
              <p>Upload Background</p>
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <button>
                  <span>
                    {fileName ? fileName : "Drag and Drop file here or choose file"}
                  </span>
                </button>
              </div>
              <h6>
                Supported formats: JPEG <span>Max size: 2MB</span>
              </h6>
              {isUploading ? (
                <h5>Uploading...</h5>
              ) : (
                <>
                  {error && <h5>{error}</h5>}
                  {successMessage && <h5 style={{ color: 'green' }}>{successMessage}</h5>}
                </>
              )}
            </div>

            <div className="BGG_Box_PUb_Btn">
            <button onClick={handleSetBackground} className="btn-bg">
              {isSettingBackground ? (
                <>
                  <span>Setting Background Image...</span>
                  <div className="loader"></div> {/* Add loader icon/spinner */}
                </>
              ) : (
                "Set Background"
              )}
            </button>
          </div>

            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        </div>
      )}

      {showSettingsButton && (
        <button
          className="Close_BGG_SEC_Box"
          onClick={handleBackgroundSelectionToggle}
        >
          <img src={SettingIcon} alt="Settings Icon" />
        </button>
      )}
    </>
  );
}
