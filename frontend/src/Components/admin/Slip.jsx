import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

const OrderSlip = ({ order, onClose }) => {
  const [qrImage, setQrImage] = useState(null);

  // Generate QR Code
  useEffect(() => {
    const orderText = `Order ID: ${order._id}\nName: ${order.customerInfo?.name}\nPhone: ${order.customerInfo?.phone}\nTotal: Rs ${order.totalPrice}`;

    QRCode.toDataURL(orderText, { width: 200, margin: 1 }, (err, url) => {
      if (!err) setQrImage(url);
    });
  }, [order]);


  const downloadPDF = () => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const PAGE_WIDTH = 210; 
  const HALF_PAGE_HEIGHT = 110; 

  // Border
  doc.setLineWidth(0.5);
  doc.rect(5, 5, PAGE_WIDTH - 10, HALF_PAGE_HEIGHT);

  // Title
  doc.setFontSize(20);
  doc.text("Order Slip", 15, 20);

  
  // portrait width = 210 → usable ~200mm
  if (qrImage) {
    doc.addImage(qrImage, "PNG", 140, 20, 45, 45);
    // x=140 => fits right side nicely
    // y=20
    // width/height = 45mm
  }

  // Order Info
  doc.setFontSize(12);
  doc.text(`Order ID: ${order._id}`, 15, 40);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 15, 47);

  // Customer Info
  doc.setFontSize(14);
  doc.text("Customer Information", 15, 62);

  doc.setFontSize(12);
  doc.text(`Name: ${order.customerInfo?.name}`, 15, 70);
  doc.text(`Phone: ${order.customerInfo?.phone}`, 15, 77);
  doc.text(`Email: ${order.customerInfo?.email || "N/A"}`, 15, 84);

  // Shipping
  doc.setFontSize(14);
  doc.text("Shipping Address", 15, 100);

  doc.setFontSize(12);
  doc.text(
    `${order.shippingAddress?.address}, ${order.shippingAddress?.city}, ${order.shippingAddress?.country}`,
    15,
    108
  );

  // Total Price
  doc.setFontSize(16);
  doc.text(`Total: Rs ${order.totalPrice}`, 140, 75);

  doc.save(`order_${order._id}.pdf`);
};




  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">

        <button
          className="absolute top-3 right-4 text-3xl text-gray-600 hover:text-red-600"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-3">📄 Order Slip</h2>

        <p className="text-sm text-gray-700">
          <strong>Order ID:</strong> {order._id}
        </p>

        <p className="text-sm text-gray-700 mt-2">
          <strong>Customer:</strong> {order.customerInfo.name}
        </p>

        <p className="text-sm text-gray-700">
          <strong>Phone:</strong> {order.customerInfo.phone}
        </p>

        <p className="text-sm text-gray-700 underline mt-3">
          Shipping Address
        </p>

        <p className="text-sm text-gray-500">
          {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
          {order.shippingAddress.country}
        </p>

        {/* QR Code Display */}
        <div className="mt-5 flex justify-center">
          {qrImage ? (
            <img
              src={qrImage}
              alt="QR Code"
              className="w-40 h-40 rounded-lg border shadow"
            />
          ) : (
            <p className="text-gray-500 text-sm">Generating QR...</p>
          )}
        </div>

        <button
          onClick={downloadPDF}
          className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition shadow"
        >
          Download PDF Slip
        </button>
      </div>
    </div>
  );
};

export default OrderSlip;
