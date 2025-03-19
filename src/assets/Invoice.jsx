import React, { useState } from 'react';
import './Invoice.css'; 
import InvoiceLogo from './Img/invoice-logo.png';


const Invoice = ({ invoiceData }) => {

    // console.log("invoiceData")
    // console.log(invoiceData)
    // console.log("invoiceData")

    // const [invoiceData, setInvoiceData] = useState({

    //     soldTo: {
    //         name: "Company Name",
    //         address: "Company Address",
    //         country: "Country",
    //     },

    //     billTo: {
    //         name: "Company Name",
    //         address: "Company Address",
    //         country: "Country",
    //     },
    //     invoiceSummary: {
    //         billingProfile: "Company Name",
    //         invoiceNumber: "G075888949",
    //         invoiceDate: "03/02/2025",
    //         totalAmount: "NGN 4,000",
    //     },

    //     billingPeriod: "02/02/2025 - 02/02/2025",
    //     billingDescription: "This bill contains the charges for your purchases and services consumed from CMVP.",
    //     billingSummary: {
    //         charges: 30.00,
    //         credits: 0.00,

    //         subtotal: 30.00,
    //         vat: 2.25,
    //         total: "NGN 32.25",
    //     }
    // });

    return (
        <div className='invoice-Envn'>
            <div className='top-invoice'>
                <img src={InvoiceLogo} alt="Invoice Logo" />
                <h2>Invoice</h2>
            </div>
            <div className='sss-Suab-si'>
                <div className='sss-Suab-si-1'>
                    <ul>
                        <li>PROLIANCE LTD</li>
                        <li>5 Owule OJuan Street, off Peter Odili Road, Trans Amadi Port Harcourt, Rivers State.</li>
                        <li>NG</li>
                        <li>TIN: 20657895-0001</li>
                    </ul>
                    <div className='dd-fls-ul'>
                        <ul>
                            <h3>Sold To</h3>
                            <li>{invoiceData.soldTo.name}</li>
                            <li>{invoiceData.soldTo.address}</li>
                            <li>{invoiceData.soldTo.country}</li>
                        </ul>
                        <ul>
                            <h3>Bill To</h3>
                            <li>{invoiceData.billTo.name}</li>
                            <li>{invoiceData.billTo.address}</li>
                            <li>{invoiceData.billTo.country}</li>
                        </ul>
                    </div>
                </div>
                <div className='sss-Suab-si-2'>
                    <h2>Invoice Summary</h2>
                    <ul>
                        <li>Billing Profile <span>{invoiceData.invoiceSummary.billingProfile}</span></li>
                        <li>Invoice Number <span>{invoiceData.invoiceSummary.invoiceNumber}</span></li>
                        <li>Invoice Date In UTC <span>{invoiceData.invoiceSummary.invoiceDate}</span></li>
                    </ul>
                    <h3>Total Amount <span>{invoiceData.invoiceSummary.totalAmount}</span></h3>
                </div>
            </div>
            <div className='yatysh-ssec'>
                <h2>This invoice is for the billing period {invoiceData.billingPeriod}</h2>
                <p>{invoiceData.billingDescription}</p>
            </div>
            <div className='ggauy-sec'>
                <h2>Billing Summary</h2>
                <ul>
                    <li>Charges <span>{Number(invoiceData.billingSummary.charges).toFixed(2)}</span></li>
                    <li>Credits <span>{Number(invoiceData.billingSummary.credits).toFixed(2)}</span></li>
                    <li>Subtotal <span>{Number(invoiceData.billingSummary.subtotal).toFixed(2)}</span></li>
                    <li>VAT (7.50%) <span>{Number(invoiceData.billingSummary.vat).toFixed(2)}</span></li>
                    <li>Total (including Tax) <span>{invoiceData.billingSummary.total}</span></li>
                </ul>

            </div>
        </div>
    );
};

export default Invoice;
