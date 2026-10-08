# Design Documentation

## Design Goal

QuickBite uses a clean self-service kiosk style that reduces typing and makes important actions easy to tap.

## Visual Principles

- Large product cards and payment choices support touchscreen use.
- High-contrast labels and prices make scanning the interface easier.
- A clear step sequence guides the customer from item selection to payment and receipt.
- Primary actions use the accent color; secondary actions remain visually distinct.
- Cards, spacing, and responsive layouts keep information readable at desktop and mobile widths.

## Key Screens

| Screen | Main purpose |
| --- | --- |
| Item Selection | Browse, filter, search, and add products. |
| Cart | Review items, change quantities, remove items, and select discounts. |
| Order Summary | Confirm line items and calculated pricing before payment. |
| Payment | Choose Cash, QR Payment, or Credit/Debit Card. |
| Receipt | Review the paid transaction, print/download it, and provide feedback. |
| Order History | Review saved transactions and daily sales totals. |
| Feedback History | Review customer ratings and feedback summaries. |

## Accessibility and Responsive Behavior

- Buttons use descriptive labels and appropriate button elements.
- Rating controls expose their selected state through `aria-pressed`.
- Feedback and receipt status messages use live regions.
- The receipt action buttons stack vertically on small screens.
- Print styles hide navigation, controls, feedback, and unrelated content so only the receipt prints.
