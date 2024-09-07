import React, { Fragment } from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { format } from "date-fns";

const ReceiptModal = ({ order, close }) => {
  const SaveAsPDFHandler = () => {
    const dom = document.getElementById("print");
    toPng(dom)
      .then((dataUrl) => {
        const img = new Image();
        img.crossOrigin = "annoymous";
        img.src = dataUrl;
        img.onload = () => {
          // Initialize the PDF.
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "in",
            format: [5.5, 8.5],
          });

          // Define reused data
          const imgProps = pdf.getImageProperties(img);
          const imageType = imgProps.fileType;
          const pdfWidth = pdf.internal.pageSize.getWidth();

          // Calculate the number of pages.
          const pxFullHeight = imgProps.height;
          const pxPageHeight = Math.floor((imgProps.width * 8.5) / 5.5);
          const nPages = Math.ceil(pxFullHeight / pxPageHeight);

          // Define pageHeight separately so it can be trimmed on the final page.
          let pageHeight = pdf.internal.pageSize.getHeight();

          // Create a one-page canvas to split up the full image.
          const pageCanvas = document.createElement("canvas");
          const pageCtx = pageCanvas.getContext("2d");
          pageCanvas.width = imgProps.width;
          pageCanvas.height = pxPageHeight;

          for (let page = 0; page < nPages; page++) {
            // Trim the final page to reduce file size.
            if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
              pageCanvas.height = pxFullHeight % pxPageHeight;
              pageHeight = (pageCanvas.height * pdfWidth) / pageCanvas.width;
            }
            // Display the page.
            const w = pageCanvas.width;
            const h = pageCanvas.height;
            pageCtx.fillStyle = "white";
            pageCtx.fillRect(0, 0, w, h);
            pageCtx.drawImage(img, 0, page * pxPageHeight, w, h, 0, 0, w, h);

            // Add the page to the PDF.
            if (page) pdf.addPage();

            const imgData = pageCanvas.toDataURL(`image/${imageType}`, 1);
            pdf.addImage(imgData, imageType, 0, 0, pdfWidth, pageHeight);
          }
          // Output / Save
          pdf.save(`receipt-${order._id}.pdf`);
        };
      })
      .catch((error) => {
        console.error("oops, something went wrong!", error);
      });
  };

  return (
    <div className="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
      <div className="p-4 text-[#555C68]" id="print">
        <h1 className="text-center text-lg font-lato-bold text-gray-900">
          TRANSACTION RECEIPT
        </h1>
        <div className="mt-6">
          <div className="mb-4 grid grid-cols-2">
            <span className="font-lato-bold">Transaction ID:</span>
            <span>{order._id}</span>
            <span className="font-lato-bold">Cashier:</span>
            <span>{order.clerk.name}</span>
            <span className="font-lato-bold">Date:</span>
            <span>{format(order.orderDate, "yyyy-MM-dd - p")}</span>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-y border-black/10 text-sm font-lato-bold">
                <th>ITEM</th>
                <th className="text-center">QTY</th>
                <th className="text-right">PRICE</th>
                <th className="text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {order["products"].map((item) => (
                <tr key={item.product._id} className="text-sm font-lato">
                  <td className="w-full">{item.product.name}</td>
                  <td className="min-w-[50px] text-center">{item.quantity}</td>
                  <td className="min-w-[80px] text-right">
                    &#8369;{Number(item.product.price).toFixed(2)}
                  </td>
                  <td className="min-w-[90px] text-right">
                    &#8369;{Number(item.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex flex-col items-end space-y-2">
            <div className="flex w-full justify-between border-t border-black/10 pt-2">
              <span className="font-lato-bold">Total Items:</span>
              <span>{order.totalItems}</span>
            </div>
            <div className="flex w-full justify-between">
              <span className="font-lato-bold">Total Amount:</span>
              <span>&#8369;{order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex w-full justify-between">
              <span className="font-lato-bold">Payment Bill:</span>
              <span>&#8369;{order.bill.toFixed(2)}</span>
            </div>
            <div className="flex w-full justify-between border-t border-black/10 py-2">
              <span className="font-lato-bold">Change:</span>
              <span className="font-bold">
                &#8369;{order.change.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex space-x-2 px-4 pb-6">
        <button
          className="flex w-full items-center justify-center space-x-1 rounded-md py-2 font-lato-bold bg-[#ffc100] text-[#555C68]"
          onClick={SaveAsPDFHandler}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span>Download</span>
        </button>
        <button
          onClick={() => {
            close();
          }}
          className="flex w-full items-center justify-center space-x-1 rounded-md py-2 font-lato-bold text-[#ffc100] border border-[#ffc100]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
          <span>Close</span>
        </button>
      </div>
    </div>
  );
};

export default ReceiptModal;
