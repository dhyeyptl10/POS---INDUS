const QRCode = require('qrcode');

const generateUPIQRCode = async (amount, orderId) => {
    try {
        const upiId = process.env.UPI_ID || '9687068897@fam';
        const payeeName = process.env.PN || 'Cafe';
        const currency = 'INR';
        const transactionNote = `OrderID_${orderId}`;

        // UPI URI Format: upi://pay?pa=address&pn=name&am=amount&tn=note&cu=currency
        const upiURI = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&tn=${transactionNote}&cu=${currency}`;

        // Return QR as base64 image
        const qrImage = await QRCode.toDataURL(upiURI);
        return qrImage;
    } catch (error) {
        console.error('Error generating QR Code:', error);
        throw new Error('Failed to generate QR Code');
    }
};

module.exports = { generateUPIQRCode };
