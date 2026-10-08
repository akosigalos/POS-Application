# Data Documentation

## Runtime Order Data

The current order is kept in memory while the customer is building a transaction.

| Field | Description |
| --- | --- |
| `name` | Product name. |
| `price` | Unit price in Philippine pesos. |
| `quantity` | Selected item quantity; never allowed to be negative. |

## Calculation Data

| Field | Formula or purpose |
| --- | --- |
| `subtotal` | Sum of item price multiplied by quantity. |
| `discountRate` | `0`, `0.1`, or `0.2`. |
| `discountAmount` | `subtotal × discountRate`. |
| `vatAmount` | `(subtotal − discountAmount) × 0.12`. |
| `finalTotal` | `subtotal − discountAmount + vatAmount`. |

## Completed Transaction Data

Completed transactions are stored in browser Local Storage under `quickbite-pos-history`.

```text
{
  number: "TXN-001",
  date: "ISO date/time string",
  items: [{ name, price, quantity }],
  calculation: { subtotal, discountRate, discountAmount, vatAmount, finalTotal },
  total: number,
  method: "Cash" | "QR payment" | "Card payment",
  paid: number,
  change: number
}
```

## Feedback Data

Feedback is stored in browser Local Storage under `quickbite-pos-feedback`.

```text
{
  rating: 1-5,
  comment: "optional text, maximum 300 characters",
  transactionNumber: "TXN-001 when available",
  date: "ISO date/time string"
}
```

## Data Limitations

- Local Storage belongs to the browser and device where the application is used.
- Clearing browser storage, using private browsing, or changing devices can remove or hide stored history and feedback.
- This practice application does not store real card, QR, or personally identifiable payment data.
