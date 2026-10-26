# Cebu Dental Care Center — setup guide

## 1. Firestore (para makita ng admin ang bookings)
Firebase Console → Build → Firestore Database → Create database → Production mode.
Tab **Rules** → i-paste ang laman ng `firestore.rules` → Publish.

## 2. Brevo (para sa emails sa pasyente)
1. Brevo → Senders, Domains & Dedicated IPs → Senders → **Add a sender** (email ng clinic) → i-verify gamit ang link na ipapadala ng Brevo.
2. Brevo → SMTP & API → **API keys** → Generate a new API key → kopyahin.

## 3. Vercel (dito tumatakbo ang `api/notify.js`)
Project → Settings → **Environment Variables**:

| Name | Value |
|---|---|
| `BREVO_API_KEY` | ang API key mula sa Brevo |
| `BREVO_SENDER_EMAIL` | ang verified sender email |
| `BREVO_SENDER_NAME` | (optional) Cebu Dental Care Center |
| `REPLY_TO` | (optional) email kung saan magre-reply ang pasyente |

Tapos **Redeploy**. Huwag ilagay ang API key sa kahit anong file ng website.

## 4. Firebase Authorized domains
Authentication → Settings → Authorized domains → idagdag ang domain ng Vercel.

## 5. Subukan
1. Mag-login bilang pasyente → mag-book → makikita ang receipt na may QR, **Save receipt**, **Add to Google Calendar**.
2. Mag-login bilang `admin@gmail.com` → mapupunta sa `admin.html`.
3. I-click ang **Confirm** → isulat ang optional na mensahe → **Confirm & send**. Dapat may email ang pasyente na may QR code.

Kung hindi ka gumagamit ng Vercel, hindi gagana ang `api/notify.js` (ang ibang bahagi ng site ay gagana pa rin).
