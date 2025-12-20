import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ================= SAFE LOGO LOADER ================= */
const loadLogo = (src) =>
    new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext("2d").drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = () => resolve(null);
    });

/* ================= NUMBER TO WORDS (INDIAN) ================= */
const numberToWords = (num) => {
    const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const w = (n) => {
        if (n < 20) return a[n];
        if (n < 100) return b[Math.floor(n / 10)] + " " + a[n % 10];
        if (n < 1000) return a[Math.floor(n / 100)] + " Hundred " + w(n % 100);
        if (n < 100000) return w(Math.floor(n / 1000)) + " Thousand " + w(n % 1000);
        return w(Math.floor(n / 100000)) + " Lakh " + w(n % 100000);
    };
    return w(Math.floor(num)).trim();
};

const GenerateInvoice = () => {
    const LOGO_URL = "/WhatsApp Image 2025-06-09 at 23.55.48_ce077dfb.jpg";

    const COMPANY = {
        name: "Manoneit Solutions",
        address:
            "H/N-A/35, Rajeev Nagar Gali, Kanti Factory Road, Gandhi Nagar, Kankarbagh, Patna-800020",
        gst: "10GHVPK1521E1ZN",
        state: "Bihar",
        igst: 18,
        bank: {
            name: "IDBI Bank Ltd",
            account: "1020102000015783",
            branch: "IDBI Bank Kankarbagh, Patna",
            ifsc: "IBKL0001020",
        },
        footer:
            "+91-9973752777; E-mail: hr@manoneit.org; manoneitindia@gmail.com | Website: www.manoneitsolutions.in",
    };

    const [data, setData] = useState({
        contactPerson: "",
        clientCompany: "",
        clientAddress: "",
        directLine: "",
        invoiceNo: "",
        invoiceDate: "",
        invoiceState: "",
        receiverName: "",
        receiverAddress: "",
        receiverGST: "",
        receiverState: "",
        candidates: [
            {
                candidateName: "",
                position: "",
                doj: "",
                location: "",
                percentage: "",
                ctc: "",
            },
        ],
    });

    const updateField = (e) =>
        setData({ ...data, [e.target.name]: e.target.value });

    const updateCandidate = (i, field, value) => {
        const updated = [...data.candidates];
        updated[i][field] = value;
        setData({ ...data, candidates: updated });
    };

    const addCandidate = () => {
        setData({
            ...data,
            candidates: [
                ...data.candidates,
                { candidateName: "", position: "", doj: "", location: "", percentage: "", ctc: "" },
            ],
        });
    };

    const removeCandidate = (i) => {
        setData({
            ...data,
            candidates: data.candidates.filter((_, idx) => idx !== i),
        });
    };

    /* ================= ROUNDING ================= */
    const candidateAmounts = data.candidates.map((c) => {
        const raw =
            c.ctc && c.percentage
                ? (Number(c.ctc) * Number(c.percentage)) / 100
                : 0;
        return Math.round(raw);
    });

    const serviceCharge = Math.round(candidateAmounts.reduce((a, b) => a + b, 0));
    const igstAmount = Math.round((serviceCharge * COMPANY.igst) / 100);
    const totalAmount = Math.round(serviceCharge + igstAmount);

    /* ================= FOOTER ================= */
    const drawFooter = (doc) => {
        const h = doc.internal.pageSize.height;
        const y = h - 12;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        doc.line(14, y - 6, 196, y - 6);

        doc.text(
            `Regd. Office- ${COMPANY.address}\n${COMPANY.footer}`,
            105,
            y,
            { align: "center" }
        );
    };

    /* ================= PDF ================= */
    const generatePDF = async () => {
        const doc = new jsPDF();
        const logo = await loadLogo(LOGO_URL);

        const tableOpts = {
            didDrawPage: () => drawFooter(doc),
        };

        if (logo) doc.addImage(logo, "PNG", 14, 12, 26, 16);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 64, 175);
        doc.setFontSize(15);
        doc.text(COMPANY.name, 105, 18, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(
            `Regd. Office- ${COMPANY.address}\nGSTIN: ${COMPANY.gst}`,
            105,
            26,
            { align: "center" }
        );

        doc.setTextColor(0, 0, 0);
        doc.line(14, 42, 196, 42);

        autoTable(doc, {
            ...tableOpts,
            startY: 46,
            theme: "grid",
            body: [[
                `To,\n${data.contactPerson}\n${data.clientCompany}\n${data.clientAddress}\nDirect line: ${data.directLine}`,
                `Invoice No: ${data.invoiceNo}\nInvoice Date: ${data.invoiceDate}\nState: ${data.invoiceState}\nReverse Charge: No`
            ]]
        });

        autoTable(doc, {
            ...tableOpts,
            startY: doc.lastAutoTable.finalY + 4,
            theme: "grid",
            headStyles: { fillColor: [30, 64, 175] },
            head: [["Details of Receiver | Billed to", "Details of Consignee | Shipped to"]],
            body: [[
                `Name: ${data.receiverName}
Address: ${data.receiverAddress}
GSTIN: ${data.receiverGST}
State: ${data.receiverState}`,
                `Name: ${COMPANY.name}
Address: ${COMPANY.address}
GSTIN: ${COMPANY.gst}
State: ${COMPANY.state}`
            ]]
        });

        /* ================= SERVICE TABLE ================= */
        autoTable(doc, {
            ...tableOpts,
            startY: doc.lastAutoTable.finalY + 4,
            theme: "grid",
            headStyles: { fillColor: [30, 64, 175] },
            head: [["S.No.", "Particulars", "Remarks", "Amount Rs."]],
            body: [
                ...data.candidates.map((c, i) => [
                    i + 1,
                    `Towards Service Charges Of "${c.candidateName}"
Position: ${c.position}
DOJ: ${c.doj}
Location: ${c.location}`,
                    `${c.percentage}% On CTC ${c.ctc}`,
                    candidateAmounts[i].toString(),
                ]),
                ["", "IGST @18%", "", igstAmount.toString()],
                [
                    "",
                    {
                        content: `Total\nRupees (Words):- ${numberToWords(totalAmount)} Only.`,
                        colSpan: 2,
                        styles: { fontStyle: "bold" },
                    },
                    {
                        content: totalAmount.toString(),
                        styles: { fontStyle: "bold" },
                    },
                ],
            ],
        });

        /* ✅ FIXED: BLUE HEADER ADDED HERE */
        autoTable(doc, {
            ...tableOpts,
            startY: doc.lastAutoTable.finalY + 6,
            theme: "grid",
            headStyles: { fillColor: [30, 64, 175] },
            columnStyles: {
                0: { fontStyle: "bold", cellWidth: 70 },
                1: { cellWidth: 110 },
            },
            head: [["Remittance Address", "Through RTGS / NEFT"]],
            body: [
                ["Beneficiary Name", COMPANY.name],
                ["Bank Name", COMPANY.bank.name],
                ["Beneficiary Account No.", COMPANY.bank.account],
                ["Bank Address", COMPANY.bank.branch],
                ["IFSC Code", COMPANY.bank.ifsc],
            ],
        });

        let sigY = doc.lastAutoTable.finalY + 18;
        if (sigY > doc.internal.pageSize.height - 40) {
            doc.addPage();
            drawFooter(doc);
            sigY = 40;
        }

        doc.text("For Manoneit Solutions", 140, sigY);
        doc.text("(Authorized Signatory)", 140, sigY + 14);

        doc.save(`Invoice-${data.invoiceNo || "draft"}.pdf`);
    };

    /* ================= UI ================= */
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow space-y-6">
                <h2 className="text-2xl font-bold">Generate Invoice</h2>

                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(data)
                        .filter(([k]) => k !== "candidates")
                        .map(([key, value]) => (
                            <input
                                key={key}
                                name={key}
                                value={value}
                                onChange={updateField}
                                placeholder={key.replace(/([A-Z])/g, " $1")}
                                className="border px-3 py-2 rounded"
                            />
                        ))}
                </div>

                {data.candidates.map((c, i) => (
                    <div key={i} className="border p-4 rounded space-y-3">
                        <div className="flex justify-between">
                            <h3 className="font-semibold">Candidate {i + 1}</h3>
                            {data.candidates.length > 1 && (
                                <button onClick={() => removeCandidate(i)} className="text-red-600 text-sm">
                                    Remove
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {Object.entries(c).map(([key, val]) => (
                                <input
                                    key={key}
                                    value={val}
                                    onChange={(e) => updateCandidate(i, key, e.target.value)}
                                    placeholder={key.replace(/([A-Z])/g, " $1")}
                                    className="border p-2 rounded"
                                />
                            ))}
                        </div>
                    </div>
                ))}

                <button onClick={addCandidate} className="bg-gray-200 px-4 py-2 rounded">
                    + Add Candidate
                </button>

                <div className="bg-blue-50 border p-4 rounded">
                    <div className="flex justify-between">
                        <span>Service Charge</span>
                        <span>₹ {serviceCharge}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>IGST @18%</span>
                        <span>₹ {igstAmount}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t mt-2 pt-2">
                        <span>Total</span>
                        <span>₹ {totalAmount}</span>
                    </div>
                </div>

                <button
                    onClick={generatePDF}
                    className="bg-blue-600 text-white px-6 py-2 rounded"
                >
                    Generate PDF
                </button>
            </div>
        </div>
    );
};

export default GenerateInvoice;
