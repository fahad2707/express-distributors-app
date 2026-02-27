# ⚡ Quick S3 Setup (5 Minutes)

## 🎯 Quick Steps

### 1. Create S3 Bucket
1. Go to: https://console.aws.amazon.com/s3/
2. Click **"Create bucket"**
3. Name: `express-distributors-images`
4. Region: `us-east-1`
5. **UNCHECK** "Block all public access"
6. Create bucket

### 2. Set Bucket Policy
1. Click bucket → **Permissions** tab
2. Edit **Bucket Policy**
3. Paste this (replace `YOUR-BUCKET-NAME`):

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
  }]
}
```

### 3. Create IAM User
1. Go to: https://console.aws.amazon.com/iam/
2. **Users** → **Create user**
3. Name: `express-distributors-s3-user`
4. Attach policy: **AmazonS3FullAccess**
5. Create user → **Create access key**
6. **Copy both keys** (Access Key ID & Secret)

### 4. Add to Backend `.env`
```bash
cd /Users/gb/Desktop/asif/backend
nano .env
```

Add:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
AWS_S3_BUCKET_NAME=express-distributors-images
```

### 5. Install & Restart
```bash
npm install
npm run dev
```

**Done!** ✅

## 📸 Test It

1. Go to Admin → Products → Add Product
2. Click image upload area
3. Select an image
4. Should upload to S3!

**That's it!** 🎉



