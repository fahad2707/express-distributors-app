# 🪣 Amazon S3 Setup Guide - Complete Step-by-Step

## 📋 Prerequisites

- Amazon AWS Account (free tier available)
- Basic understanding of cloud storage

## 🚀 Step-by-Step Setup

### Step 1: Create AWS Account

1. Go to: https://aws.amazon.com/
2. Click **"Create an AWS Account"**
3. Follow the signup process
4. Verify your email and phone number

### Step 2: Create S3 Bucket

1. **Login to AWS Console:**
   - Go to: https://console.aws.amazon.com/
   - Login with your credentials

2. **Navigate to S3:**
   - Search for "S3" in the top search bar
   - Click on **"S3"** service

3. **Create Bucket:**
   - Click **"Create bucket"** button
   - **Bucket name:** `express-distributors-images` (must be globally unique)
   - **AWS Region:** Choose closest to you (e.g., `us-east-1`)
   - **Object Ownership:** ACLs enabled (for public access)
   - **Block Public Access:** **UNCHECK** "Block all public access" (we need public images)
   - **Bucket Versioning:** Disable (optional)
   - **Default encryption:** Enable (recommended)
   - Click **"Create bucket"**

### Step 3: Configure Bucket Permissions

1. **Click on your bucket name**
2. **Go to "Permissions" tab**
3. **Edit "Bucket Policy":**
   - Click **"Edit"** on Bucket Policy
   - Paste this policy (replace `YOUR-BUCKET-NAME` with your bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

4. **Save changes**

### Step 4: Create IAM User (For API Access)

1. **Navigate to IAM:**
   - Search for "IAM" in AWS Console
   - Click on **"IAM"** service

2. **Create User:**
   - Click **"Users"** → **"Create user"**
   - **User name:** `express-distributors-s3-user`
   - Click **"Next"**

3. **Set Permissions:**
   - Select **"Attach policies directly"**
   - Search and select: **"AmazonS3FullAccess"**
   - Click **"Next"** → **"Create user"**

4. **Create Access Keys:**
   - Click on the user you just created
   - Go to **"Security credentials"** tab
   - Click **"Create access key"**
   - Select **"Application running outside AWS"**
   - Click **"Next"** → **"Create access key"**
   - **IMPORTANT:** Copy both:
     - **Access key ID**
     - **Secret access key** (only shown once!)

### Step 5: Add Credentials to Backend

1. **Open backend `.env` file:**
   ```bash
   cd /Users/gb/Desktop/asif/backend
   nano .env
   ```

2. **Add these lines:**
   ```env
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID_HERE
   AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY_HERE
   AWS_S3_BUCKET_NAME=express-distributors-images
   ```

3. **Replace:**
   - `YOUR_ACCESS_KEY_ID_HERE` with your Access Key ID
   - `YOUR_SECRET_ACCESS_KEY_HERE` with your Secret Access Key
   - `us-east-1` with your bucket region if different
   - `express-distributors-images` with your bucket name

4. **Save and exit** (Ctrl+X, then Y, then Enter)

### Step 6: Install Dependencies

```bash
cd /Users/gb/Desktop/asif/backend
npm install
```

This will install:
- `@aws-sdk/client-s3`
- `multer`
- `uuid`

### Step 7: Restart Backend

```bash
# Stop current server (Ctrl+C)
npm run dev
```

## ✅ Verify Setup

1. **Test Image Upload:**
   - Go to Admin Panel → Products
   - Click "Add Product"
   - Upload an image
   - Should upload successfully!

2. **Check S3 Bucket:**
   - Go to AWS Console → S3
   - Click your bucket
   - Should see `products/` folder with uploaded images

## 🔒 Security Best Practices

1. **Use IAM Roles** (for production):
   - Instead of access keys, use IAM roles
   - More secure for production environments

2. **Restrict Permissions:**
   - Only give `PutObject` and `GetObject` permissions
   - Don't use `AmazonS3FullAccess` in production

3. **Enable CORS** (if needed):
   - Go to bucket → Permissions → CORS
   - Add CORS configuration if accessing from web

## 📝 Quick Reference

### Your S3 Details:
- **Bucket Name:** `express-distributors-images` (or your custom name)
- **Region:** `us-east-1` (or your chosen region)
- **Access Key ID:** (from IAM user)
- **Secret Access Key:** (from IAM user)

### Environment Variables:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET_NAME=express-distributors-images
```

## 🆘 Troubleshooting

### "Access Denied" Error
- Check bucket permissions (public read)
- Verify IAM user has S3 permissions
- Check access keys are correct

### "Bucket Not Found"
- Verify bucket name in `.env`
- Check bucket exists in correct region
- Ensure region matches in `.env`

### Images Not Loading
- Check bucket policy allows public read
- Verify image URL is correct
- Check CORS settings if needed

## 💰 Cost Estimate

**AWS S3 Free Tier:**
- 5 GB storage
- 20,000 GET requests
- 2,000 PUT requests
- **Free for 12 months** (then ~$0.023/GB/month)

**For 1000 images (~5MB each):**
- Storage: ~5GB = **FREE** (within free tier)
- Requests: Minimal = **FREE**

**You're all set!** 🎉



