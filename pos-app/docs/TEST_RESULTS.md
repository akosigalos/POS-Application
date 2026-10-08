# Test Results

## Scope

The tests below cover the practice POS workflow and the features added through the completed project milestones.

| Test area | Expected result | Status |
| --- | --- | --- |
| Product selection | At least six products are selectable and show names and prices. | Passed |
| Cart controls | Quantities increase/decrease safely and products can be removed. | Passed |
| Search and categories | Filtering, name search, and empty state work without breaking the cart. | Passed |
| Discounts and VAT | Discount, VAT, and final total update across relevant screens. | Passed |
| Cash payment | Invalid and insufficient payment is rejected; valid change is calculated. | Passed |
| QR and card payment | Simulated payments complete with zero change. | Passed |
| Receipt | Transaction details, totals, payment details, and paid status are displayed. | Passed |
| Order history | Completed transactions persist in browser Local Storage and appear in reports. | Passed |
| Feedback | Rating validation, saved feedback, summary values, and clearing confirmation work. | Passed |
| Receipt print/download | Receipt actions are enabled for completed transactions and reset for a new transaction. | Passed |
| Responsive layout | Kiosk controls and receipt actions remain usable on desktop and mobile widths. | Passed |

## Receipt Output Notes

- Print uses the browser print dialog and `@media print` styling to include only receipt content.
- Download creates a text receipt with a filename such as `QuickBite-Receipt-TXN-001.txt`.
- Native print preview and file-opening verification should be repeated in the target browser/device used for presentation.

## Known Limitations

- Payments are simulated and do not contact real financial services.
- History and feedback are limited to the current browser/device Local Storage.
