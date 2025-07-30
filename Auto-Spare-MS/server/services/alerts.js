const SparePart = require('../models/SpareParts');
require('../models/Category');
const { sendStockAlert } = require('../utils/emailService');

const checkLowStockParts = async () => {
    try {
        const threshold = 2;
        const lowStock = await SparePart.find({ qty: { $lte: threshold } })
            .populate('category', 'name')
            .sort({ 'category.name': 1 });

        if (lowStock.length === 0) {
            console.log('No low stock parts.');
            return;
        }

        console.log(`LOW STOCK ALERT (${lowStock.length} items)`);

        // Group parts by category
        const grouped = {};
        lowStock.forEach(part => {
            const categoryName = part.category?.name || 'Uncategorized';
            if (!grouped[categoryName]) {
                grouped[categoryName] = [];
            }
            grouped[categoryName].push(part);
        });

        // Plain text fallback
        let plainText = 'The following spare parts are low in stock:\n\n';

        // HTML table start
        let htmlContent = `
      <h2>Low Stock Alert - Auto Spares</h2>
      <p>The following spare parts are below the minimum threshold:</p>
    `;

        for (const [categoryName, parts] of Object.entries(grouped)) {
            plainText += `Category: ${categoryName}\n`;

            htmlContent += `
        <h4>${categoryName}</h4>
        <table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px;">
          <thead style="background-color: #f2f2f2;">
            <tr>
              <th>Description</th>
              <th>Part No</th>
              <th>Qty</th>
              <th>Min</th>
              <th>Code</th>
            </tr>
          </thead>
          <tbody>
      `;

            parts.forEach(part => {
                const rowText = ` - ${part.description} (${part.part_no}) | Qty: ${part.qty} | Min: ${threshold}\n`;
                plainText += rowText;

                htmlContent += `
          <tr>
            <td>${part.description}</td>
            <td>${part.part_no}</td>
            <td>${part.qty}</td>
            <td>${threshold}</td>
            <td>${part.code}</td>
          </tr>
        `;
            });

            htmlContent += `</tbody></table><br>`;
            plainText += '\n';
        }

        await sendStockAlert('Low Stock Alert - Auto Spares', plainText, htmlContent);
    } catch (error) {
        console.error('Stock alert check failed:', error.message);
    }
};

module.exports = {
    checkLowStockParts,
};
