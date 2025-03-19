import React, { useState } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null); // Track which question is open

  const faqData = [
    {
      question: 'What is the purpose of the platform?',
      answer:
        'The platform is designed to provide a secure, cloud-based system for businesses to effectively manage, store, and track issued certificates (Records). It aims to enhance traceability, security, and data protection, while preventing certificate forgery.',
    },
    {
      question: 'Who can benefit from using the platform?',
      answer: (
        <>
          <p>The platform is ideal for businesses that issue certificates, such as:</p>
           <ul className="faq-list">
            <li><span className="bullet">•</span>  Inspection Bodies</li>
            <li><span className="bullet">•</span>  Calibration and Testing Labs</li>
            <li><span className="bullet">•</span>  Training Organizations, Schools and Institutions</li>
            <li><span className="bullet">•</span>  Certification Bodies</li>
          </ul>
        </>
      ),
    },
    {
      question: 'How does the platform help prevent certificate forgery?',
      answer:
        'The platform features an automated and seamless Certificate Verification Portal. This system enables anyone to verify the authenticity of a certificate online, reducing the risk of forgery and ensuring trust in issued certificates.',
    },
    {
      question: 'What are the key objectives of the platform?',
      answer: (
        <>
          <p>The platform aims to:</p>
           <ul className="faq-list">
            <li><span className="bullet">•</span>  Provide a secure, cloud-based system for managing certificates.</li>
            <li><span className="bullet">•</span>  Prevent and reduce certificate forgery through an automated verification process.</li>
            <li><span className="bullet">•</span>  Reduce certificate forgery incidents in the conformity assessment industry.</li>
          </ul>
        </>
      ),
    },
    {
      question: 'How does the platform ensure data security?',
      answer:
        'The platform incorporates robust security measures, such as encrypted storage, access control, and secure data backups, ensuring that certificate records are protected from unauthorized access and tampering.',
    },
    {
      question: 'What kind of certificates can be managed on the platform?',
      answer: (
        <>
          <p>The platform supports various types of certificates, including:</p>
           <ul className="faq-list">
            <li><span className="bullet">•</span>  Inspection certificates</li>
            <li><span className="bullet">•</span>  Calibration certificates and Test reports</li>
            <li><span className="bullet">•</span>  Training completion certificates</li>
            <li><span className="bullet">•</span>  School results and certificates</li>
            <li><span className="bullet">•</span>  Any records requiring verification by a third party or for internal use</li>
          </ul>
        </>
      ),
    },
    {
      question: 'Can issued certificates be verified by third parties?',
      answer:
        'Yes, third parties such as clients, regulators, and other stakeholders can verify certificates through your unique verification portal, ensuring transparency and trustworthiness.',
    },
    {
      question: 'How can I generate my Unique Verification Link?',
      answer:
        'Your unique verification is automatically generated upon complete registration and confirmation of your account. The link is available for copy and use in the company dashboard.',
    },
    {
      question: 'How can I integrate my Unique Verification Link to my existing company website?',
      answer:
        'We will provide support to assist you in creating a page on your existing website using your unique verification link. This may attract a cost that is negotiable and within your budget. Also, your company website managers can also provide the required support.',
    },
    {
      question: 'How does the platform improve traceability?',
      answer:
        'The platform organizes and retains records of issued certificates, providing a detailed history and audit trail for each certificate, making it easy to trace and authenticate.',
    },
    {
      question: 'Can third parties view full uploaded certificate information?',
      answer:
        'No, third parties can only view specific information to confirm if the issued certificate is original and from the issued entity. Third parties cannot view information such as the picture of the uploaded certificate, complete certificate information, or download a copy of the issued certificate.',
    },
    {
      question: 'Does the platform comply with data protection regulations?',
      answer:
        'Yes, the platform is designed to adhere to data protection regulations, ensuring that all stored and processed information is handled securely and in compliance with relevant laws. Refer to our privacy policy.',
    },
    {
      question: 'How can businesses get started with the platform?',
      answer:
        'Businesses can sign up for the platform by creating an account. Once registered, they can upload, manage, and track their certificates while leveraging the verification portal to enhance security and prevent forgery.',
    },
  ];

  // Handle toggling of active accordion items
  const toggleAccordion = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null); // Close accordion if it's already active
    } else {
      setActiveIndex(index); // Open clicked accordion
    }
  };

  return (
    <div>
         <div className="TThero-Blam">
                <div className="site-container">
                    <h2 className="big-text">Frequently Asked Questions</h2>
                    </div>
                </div>
    <div className="faq-section">
      <div className="site-container">
        <div className="faq_Main">
           <ul>
            {faqData.map((item, index) => (
              <li key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
                <div className="faq-content">
                  <div className="faq-question" onClick={() => toggleAccordion(index)}>
                    <h3>{item.question}</h3>
                    <span>{activeIndex === index ? '-' : '+'}</span> {/* Toggle icon */}
                  </div>
                  <div className={`faq-answer ${activeIndex === index ? 'show' : ''}`}>
                    {typeof item.answer === 'string' ? <p>{item.answer}</p> : item.answer}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    </div>

  );
};

export default FAQ;
