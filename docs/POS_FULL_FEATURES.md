# Full POS Software – Feature Overview

Your admin panel now functions as a **full-fledged POS system** (similar to QuickBooks POS) so your manufacturing client can run everything in one place—no need for a third-party POS app.

---

## Admin Panel Navigation (POS Hub)

After logging in to **Admin**, the sidebar includes:

| Section | What it does |
|--------|----------------|
| **Dashboard** | Today’s revenue, orders, online vs offline sales, low-stock alerts, top products |
| **Register (POS)** | Full sales flow: scan/search products, select customer, apply discounts/tax, split payments, complete sale |
| **Products** | Add/edit products, categories, cost price, SKU/PLU/barcode, stock, CSV bulk import |
| **Inventory** | View all stock levels, low-stock warnings, **manual stock adjustments** (count corrections) |
| **Customers** | Add/edit customers (name, company, phone, email, address, payment terms, notes). Select customer at POS |
| **Vendors** | Add/edit vendors (name, contact, phone, email, address, payment terms). Used for purchase orders |
| **Purchase Orders** | Create POs to vendors, add product lines with quantity and cost, **Mark as sent**, **Receive stock** (updates inventory) |
| **Online Orders** | View and update status of website orders (packed, ready for pickup, etc.) |
| **Invoices** | Sales invoices (POS + online), download PDF, filter by type |
| **Reports & Analytics** | Sales trends, online vs offline, category sales, line charts |
| **Settings** | Business name, address, phone, email, tax ID, default tax rate, receipt header/footer, currency |

---

## Core POS Flows

### 1. **Sales (Register)**
- **Barcode / PLU / SKU / name** search; add to cart with quantity and optional line discount.
- **Select customer** from the dropdown (or leave as “Walk-in”). Name/phone/email auto-fill from the customer record and are sent with the sale.
- **Bill-level discount** (amount or percent) and **tax** (per-product rate).
- **Payment**: Cash, Card, Digital, or **Split** (enter cash/card/digital amounts that sum to total).
- **Sale type**: POS Sale, Store Pickup, or Website Order.
- Completing the sale: creates a **POS sale**, **invoice**, **stock deduction**, and **stock movement** log.

### 2. **Customers**
- Add customers with name, company, phone, email, address, payment terms, notes.
- At POS, choose a customer from the list; their details are used on the sale and invoice.
- Search customers by name, company, phone, or email.

### 3. **Vendors**
- Add vendors (suppliers) with contact name, phone, email, address, payment terms.
- Vendors are used when creating **Purchase Orders**.

### 4. **Purchase Orders**
- **New Purchase Order** → Select vendor → Add items (product, quantity, unit cost) → Create.
- **Draft** POs can be edited; **Mark as sent** when you send the PO to the vendor.
- **Receive** (full or partial): enter quantities received per line → stock is increased and **stock movements** are logged (purchase from PO).
- PO detail page: view all lines, send, receive, see totals.

### 5. **Inventory**
- View all products with current stock and low-stock threshold.
- **Adjust stock**: enter a quantity change (+ or −) and optional notes; updates stock and creates an **adjustment** stock movement.
- Low-stock count is highlighted at the top.

### 6. **Settings**
- **Business info**: name, address, city, state, ZIP, phone, email, tax ID.
- **Tax & currency**: default tax rate (%), currency (e.g. USD).
- **Receipt**: optional header and footer text for receipts/invoices.

---

## Data Model Additions (Backend)

- **Customer** – POS customers (separate from website Users); linkable to a User if they have an account.
- **Vendor** – Suppliers for purchase orders.
- **PurchaseOrder** – PO number, vendor, status (draft/sent/partial/received/cancelled), items (product, qty ordered/received, unit cost), totals, dates.
- **Payment** – Optional model for recording payments (sale, refund, vendor payment); can be extended later.
- **StoreSettings** – Single document for business name, address, tax rate, receipt text, currency.
- **POSSale** – Added `pos_customer_id` (reference to Customer) in addition to existing customer name/phone/email.
- **Product** – Added `vendor_id` (primary vendor) and `reorder_point` for purchasing.

---

## APIs Added

- `GET/POST/PUT/DELETE /api/customers` – Customer CRUD.
- `GET/POST/PUT/DELETE /api/vendors` – Vendor CRUD.
- `GET/POST /api/purchase-orders` – List and create POs.
- `GET/PUT /api/purchase-orders/:id` – Get/update PO (draft only).
- `POST /api/purchase-orders/:id/send` – Mark PO as sent.
- `POST /api/purchase-orders/:id/receive` – Receive stock (body: `{ items: [{ product_id, quantity_received }] }`).
- `POST /api/purchase-orders/:id/cancel` – Cancel PO.
- `GET/PUT /api/store-settings` – Get/update store settings.
- `POST /api/inventory/adjust` – Adjust stock (body: `product_id`, `quantity_change`, optional `notes`).
- `GET /api/inventory/movements/:productId` – Stock movement history for a product.

POS sale creation accepts **pos_customer_id** (Customer id) and still accepts **customer_name**, **customer_phone**, **customer_email** for walk-ins or overrides.

---

## How to Run

1. **Backend**: From project root, `npm run dev` (or run backend separately). Ensure MongoDB is running and seeded if needed.
2. **Frontend**: Next.js dev server (e.g. `npm run dev` in frontend or from root).
3. **Admin**: Go to `/admin/login`, sign in, then use the sidebar to access Dashboard, Register (POS), Products, Inventory, Customers, Vendors, Purchase Orders, Orders, Invoices, Reports & Analytics, and Settings.

---

## Optional Next Steps (Not Implemented Yet)

- **Returns/refunds** – Reverse sale or partial refund, restore stock, record payment type.
- **Gift cards / store credit** – Issue and redeem at POS.
- **Barcode label printing** – Print labels from product or PO.
- **Multi-location** – Warehouses/stores with location-specific stock.
- **Profit & Loss report** – Revenue − COGS (using cost_price) in Reports.
- **Vendor payments** – Record payments to vendors and link to POs.

Your client can use this admin panel as their primary POS: **customers**, **vendors**, **products**, **inventory**, **purchase orders**, **sales register**, **invoices**, **reports**, and **settings** are all in one place.
