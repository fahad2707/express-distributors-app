# Product bulk import (CSV)

Enterprise wholesale POS: import products from CSV with **preview** then **confirm**. Supports two formats.

---

## Supported formats

### 1. Canonical format (product-import-sample.csv)

| Column | Required | Description |
|--------|----------|-------------|
| **name** | Yes | Product name |
| **slug** | No | Auto-generated from name if empty |
| **description** | No | Product description |
| **price** | Yes | Selling price (numeric; `$` and `,` stripped) |
| **cost_price** | No | Cost (default 0.00) |
| **category_slug** or **category** | Yes* | Category slug or name (category created if missing) |
| **subcategory** / **sub_category** | No | Subcategory name (created under category if missing) |
| **image_url** | No | Full image URL |
| **barcode** | No | Unique; auto 12-digit if empty |
| **plu** | No | Price look-up code |
| **sku** | No | Unique; auto EDI-0001, EDI-0002… if empty |
| **stock_quantity** | No | Default 0 |
| **low_stock_threshold** | No | Default 10 |
| **tax_rate** | No | Default 0 |
| **is_active** / **status** | No | 1/Active = active (default) |

\* If **category** is a name, it is created if it doesn’t exist. If **category_slug** is used, category is looked up by slug or created with that slug.

### 2. Structured format (e.g. Express_Distributors_Structured_Product_List)

Same logic with alternate column names:

- **Category** → category (create if not exists)
- **Subcategory** → subcategory (create if not exists, linked to category)
- **Product_Name** / **product_name** → product name
- **Price_USD** / **selling_price** / **price** → selling price (decimal 10,2; `$` stripped)
- **SKU** → sku (or auto EDI-0001, incrementing)
- **Barcode** → barcode (or auto 12-digit unique)
- **Cost Price** → cost_price (default 0.00)
- **Stock Quantity** → stock_quantity (default 0)
- **Status** → Active/Inactive
- **Tax Rate** → tax_rate (default 0)

---

## Data validation

- Price must be numeric (non‑negative); `$` and commas removed.
- No duplicate **product name** inside the same **category + subcategory** (within file and in DB).
- Rows trimmed; empty rows skipped.
- Decimal precision: price/cost/tax rounded to 2 decimals.

---

## Database insert rules

- **Transaction**: all inserts run in a single MongoDB transaction (rollback on error).
- **Categories**: if category (name or slug) doesn’t exist → create it.
- **Subcategories**: if subcategory doesn’t exist under that category → create and link.
- **Products**: bulk insert with auto-generated slug, SKU (EDI-0001…), and barcode when missing.
- **Duplicates**: same product name in same category+subcategory → skipped (counted separately).
- **Errors**: logged per row; returned in summary (first 100).

---

## API

- **POST /api/products/import/preview**  
  - Body: `multipart/form-data`, field `file` (CSV).  
  - Response: `{ rows, summary: { total, valid, invalid, duplicate_skipped } }`  
  - No DB write.

- **POST /api/products/import**  
  - Body: same file.  
  - Response: `{ imported, failed, duplicate_skipped, total, errors, duplicate_skipped_rows?, categories_created, subcategories_created }`.

---

## Admin panel flow

1. **Products** → **Import CSV** → choose file.
2. **Preview**: table of rows with status (Valid / Invalid / Duplicate), summary counts.
3. **Import X products** → progress loader.
4. **Import summary**: imported, failed, duplicates skipped, categories/subs created, first errors.

---

## Sample file

Use **product-import-sample.csv** (canonical columns). For structured format, use columns: Category, Subcategory, Product_Name, Price_USD, and optionally SKU, Barcode, Cost Price, Stock Quantity, Status, Tax Rate.
