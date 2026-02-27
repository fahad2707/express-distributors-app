# QuickBooks-Grade POS Roadmap

This document maps **QuickBooks POS + Accounting** modules to our system: what we have, what’s partial, and what to build next. Use it as a single source of truth for “QuickBooks-grade” features.

---

## 1. Products & Inventory

| QuickBooks feature | Our status | Notes / Next steps |
|--------------------|------------|--------------------|
| **Inventory products** (stock tracked) | Done | `stock_quantity`, low_stock_threshold, reorder_point |
| **Non-inventory products** (services, fees) | Partial | Add `product_type`: inventory / non_inventory / service; non-inventory skip stock |
| **Bundles / Kits** | Not started | New model: Bundle with child product_ids + qty; sale expands to line items |
| **Variants** (size, color, pack) | Not started | ProductVariant model or options array on Product |
| **Serialized items** | Not started | Enterprise; serial numbers per unit |
| **On-hand quantity** | Done | `stock_quantity` |
| **Committed stock** (orders placed, not fulfilled) | Partial | Compute from Order + OrderItem where status ≠ fulfilled; or add `committed_quantity` |
| **Available stock** (on-hand − committed) | Partial | Add computed field or API: available = on_hand − committed |
| **Reorder point** | Done | `reorder_point` |
| **Preferred vendor per product** | Done | `vendor_id` |
| **Costing (FIFO / Average)** | Partial | We have single `cost_price`; add CostHistory model for FIFO/avg later |
| **Lock cost history / no silent overwrite** | Not started | CostHistory + audit; admin-only cost change with reason |

**Build next:** Product types (inventory / non_inventory / service), committed + available stock, cost history (optional).

---

## 2. Sales Workflow (POS + Online)

| QuickBooks feature | Our status | Notes / Next steps |
|--------------------|------------|--------------------|
| **POS sale** (add items, qty, discount, tax, pay, receipt) | Done | Full flow in Register |
| **Item-level & invoice-level discount** | Done | Line discount + bill discount |
| **Tax per line** | Done | `tax_rate` on product, tax on sale items |
| **Payment** (cash/card/split) | Done | payment_method, payment_split |
| **Receipt / Invoice** | Done | Invoice + PDF |
| **Auto accounting entries** (Debit Cash, Credit Revenue, etc.) | Not started | Requires Chart of Accounts + Journal (see §8) |
| **Sales Order** (reserve stock, then invoice) | Not started | New: SalesOrder → reserve committed → Invoice on fulfillment |
| **Quote → Sales Order → Invoice** | Not started | Quote model; convert to SO then to Invoice |
| **Partial fulfillment / Backorders** | Not started | After Sales Order; partial ship + backorder flag |

**Build next:** Sales Order + committed stock; then accounting engine for auto journal entries.

---

## 3. Customers (CRM-Lite)

| QuickBooks feature | Our status | Notes / Next steps |
|--------------------|------------|--------------------|
| **Profile** (name, company, phone, email) | Done | Customer model |
| **Billing address** | Partial | Single `address`; split to billing_address / shipping_address |
| **Shipping address** | Partial | Same as above |
| **Payment terms** | Done | `payment_terms` |
| **Credit limit** | Done | `credit_limit` |
| **Outstanding balance** | Not started | Add `outstanding_balance`; update from invoices/credits |
| **Customer price lists** | Not started | CustomerPriceList or override price per customer |
| **Special discounts** | Not started | CustomerDiscount or rule engine |
| **Tax exemptions** | Not started | `tax_exempt` on Customer; skip tax in calc |
| **Purchase history** | Partial | From POSSale + Order by customer_id / pos_customer_id |
| **Statements (monthly)** | Not started | Report: open invoices + payments by customer |

**Build next:** billing_address, shipping_address, outstanding_balance, tax_exempt; then customer-specific pricing/discounts.

---

## 4. Vendors & Purchasing

| QuickBooks feature | Our status | Notes / Next steps |
|--------------------|------------|--------------------|
| **Vendor profile** | Done | Vendor model |
| **Purchase Order** | Done | Create PO, send, receive (full/partial) |
| **Receive goods → inventory increase** | Done | Receive PO updates stock + StockMovement |
| **Vendor bill (AP)** | Partial | We have PO; add VendorBill (bill from vendor) and link to PO |
| **Pay vendor later** | Not started | Payments linked to VendorBill; AP balance |
| **Multiple vendors per product** | Partial | One `vendor_id`; add ProductVendor (product_id, vendor_id, lead_time, cost) |
| **Lead times** | Not started | On ProductVendor or Vendor |
| **Cost per vendor** | Not started | ProductVendor.unit_cost |
| **Accounting: Debit Inventory, Credit AP** | Not started | With accounting engine (§8) |

**Build next:** VendorBill (AP), pay later; then multiple vendors per product + lead times.

---

## 5. Returns, Refunds & Adjustments

| QuickBooks feature | Our status | Notes / Next steps |
|--------------------|------------|--------------------|
| **Full return** | Not started | Return model linked to sale; restock; refund |
| **Partial return** | Not started | Return with line items + qty |
| **Exchange** | Not started | Return + new sale in one flow |
| **Store credit** | Not started | Customer balance or StoreCredit model |
| **Refund to original payment** | Not started | Refund method (cash/card/credit); Stripe refund for card |
| **Reason required (audit)** | Not started | Return.reason required; dropdown (damaged, wrong item, etc.) |
| **Adjust inventory + revenue + tax** | Not started | Return flow: restock, reduce revenue, adjust tax |

**Build next:** Return/Refund model with reason (required), link to sale, restock, and optional store credit.

---

## 6. Tax Engine

| QuickBooks feature | Our status | Notes / Next steps |
|--------------------|------------|--------------------|
| **Tax per product** | Done | `tax_rate` on Product |
| **Multiple tax rates** | Partial | StoreSettings.default_tax_rate; no TaxRate table yet |
| **Location-based tax** | Not started | TaxRate by location/state |
| **Tax exemptions** | Not started | Customer.tax_exempt; skip tax |
| **Tax stored per line** | Done | Sale item has tax |
| **Lock tax history** | Not started | Don’t change past sale tax; use reversals |
| **Tax summary reports** | Partial | Analytics; add dedicated tax report for filing |

**Build next:** TaxRate model (name, rate%, optional location), use in calc; Customer.tax_exempt; tax report.

---

## 7. Accounting Engine (Heart of QB)

| QuickBooks feature | Our status | Notes / Next steps |
|--------------------|------------|--------------------|
| **Chart of Accounts** | Not started | CoA model: type (asset/liability/equity/income/expense), name, code |
| **Auto journal entries** | Not started | On sale: Debit Cash, Credit Sales; Debit COGS, Credit Inventory |
| **No manual tampering without permission** | Not started | Roles; only “accountant” can post manual entries |
| **Double-entry** | Not started | JournalEntry: lines with account_id, debit, credit |

**Build next:** CoA seed data; JournalEntry model; post journal on Sale, Return, PO Receive, Payment; then role “accountant”.

---

## 8. Reports & Analytics

| QuickBooks feature | Our status | Notes / Next steps |
|--------------------|------------|--------------------|
| **Profit & Loss** | Partial | Revenue − COGS from orders/sales; formal P&L report |
| **Balance Sheet** | Not started | Needs CoA + balances |
| **Cash Flow** | Not started | From journal entries or payment log |
| **Sales by product** | Done | Analytics |
| **Sales by customer** | Partial | From sales; add dedicated report |
| **Inventory valuation** | Partial | Sum(stock × cost); report |
| **Vendor balances** | Not started | AP from VendorBills − Payments |
| **Tax liability** | Not started | Tax collected − tax remitted (if tracked) |
| **Filters** (date, store, user, payment, online vs offline) | Partial | Date/period; extend to user, payment type, channel |

**Build next:** P&L report, inventory valuation report, tax summary; then vendor balances when AP exists.

---

## 9. Security, Roles & Audit

| QuickBooks feature | Our status | Notes / Next steps |
|--------------------|------------|--------------------|
| **User roles** | Partial | Admin only; no cashier / manager / accountant |
| **Granular permissions** | Not started | Permissions per role (e.g. void, discount, view reports) |
| **Audit log** (who changed what) | Not started | AuditLog: user, action, entity, old/new, timestamp |
| **Who changed price / voided / adjusted stock** | Not started | Log price change, void, stock adjustment |

**Build next:** AuditLog model + log key actions (price change, void, stock adjust, refund); then roles (e.g. admin, manager, cashier) + permissions.

---

## 10. Data Integrity & Sync

| QuickBooks feature | Our status | Notes / Next steps |
|--------------------|------------|--------------------|
| **No delete posted transactions** | Partial | We don’t delete sales; enforce “no delete” for posted |
| **Lock closed periods** | Not started | Period lock; no edit before lock date |
| **Reversals instead of deletes** | Not started | Return/refund and reversing journal entry |
| **Referential integrity** | Done | MongoDB refs; no orphan deletes |

**Build next:** “Posted” flag on sale/order; disallow delete if posted; then period lock + reversals.

---

## Implementation priority (suggested)

1. **Phase 1 – Core gaps**  
   - Product types (inventory / non_inventory / service).  
   - Committed + available stock.  
   - Returns/refunds with **reason** and restock.  
   - Audit log (who did what).  
   - Customer: billing/shipping, outstanding_balance, tax_exempt.

2. **Phase 2 – Sales & money**  
   - Sales Order (reserve stock).  
   - Store credit.  
   - TaxRate table + tax report.  
   - P&L and inventory valuation reports.

3. **Phase 3 – Accounting**  
   - Chart of Accounts.  
   - Journal entries (auto on sale, return, receive, payment).  
   - VendorBill + AP + pay later.

4. **Phase 4 – Power**  
   - Roles & permissions.  
   - Period lock + reversals.  
   - Multiple vendors per product, bundles, quotes.

---

## How we beat QuickBooks (your advantages)

- **Modern UI/UX** – Clean admin, fast POS, mobile-friendly.  
- **Website + POS in one** – Same products, customers, inventory.  
- **Real-time** – No desktop sync; one database.  
- **Clear roadmap** – This doc; implement module by module.  
- **Custom for wholesale** – Customer terms, POs, vendors built in.

Use this roadmap to decide the next sprint and to track “QuickBooks-grade” coverage per module.
