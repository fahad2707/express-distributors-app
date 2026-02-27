# 📸 How to Add Warehouse Banner Image

## Quick Steps

### Step 1: Save the Image
1. Save your warehouse image file
2. Name it exactly: `warehouse-banner.jpg`
3. Place it in: `/Users/gb/Desktop/asif/frontend/public/warehouse-banner.jpg`

### Step 2: Verify Location
The file structure should be:
```
frontend/
└── public/
    └── warehouse-banner.jpg  ← Your image here
```

### Step 3: Restart App
```bash
# Stop server (Ctrl+C)
npm run dev
```

## Image Requirements

- **Format**: JPG, PNG, or WebP
- **Recommended Size**: 1920x600 pixels or larger
- **File Size**: Under 1MB for fast loading
- **Aspect Ratio**: 16:9 or wider works best

## What Happens

- The banner will automatically display with your image
- Elegant dark overlay for text readability
- Beautiful gradient text effects
- Responsive on all devices

## If Image Doesn't Load

The banner will automatically show a beautiful gradient fallback, so your website will still look great!

## Alternative: Use Image URL

If you have the image hosted online, you can update the `src` in `frontend/app/page.tsx` to use the URL directly.



