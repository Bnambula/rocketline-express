# 🚌 Raylane Express (RLX) — MVP

Uganda's first real-time bus & taxi booking platform. Connecting cities, transforming travel.

## 🌐 Live Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Full landing page with all sections |
| Book | `/book` | Full booking flow: search → seat → pay → ticket |
| Parcels | `/parcels` | Send & track parcels |
| Operator Dashboard | `/operator` | Operator management panel |
| Admin Dashboard | `/admin` | Full admin control panel |
| Partner Portal | `/partner` | Operator application form |

## 🚀 Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm install -g vercel
cd raylane-express
npm install
vercel
```

### Option 2: GitHub + Vercel Dashboard
1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repo
4. Vercel auto-detects Vite — click **Deploy**

### Option 3: Drag & Drop
1. Run `npm run build`
2. Drag the `dist/` folder to [vercel.com/new](https://vercel.com/new)

## 🛠 Local Development
```bash
npm install
npm run dev
# Open http://localhost:3000
```

## 📦 Build for Production
```bash
npm run build
# Output in /dist
```

## 🏗 Project Structure
```
src/
├── components/
│   ├── layout/       # Navbar, Footer, MobileBottomNav
│   ├── sections/     # All homepage sections
│   └── ui/           # Toast, AIAssistant
├── pages/
│   ├── Home.jsx
│   ├── BookingFlow.jsx
│   ├── ParcelPage.jsx
│   ├── PartnerPortal.jsx
│   ├── admin/        # AdminDashboard
│   └── operator/     # OperatorDashboard
├── data/             # Mock data (replace with API)
├── hooks/            # useToast
└── styles/           # globals.css
```

## 🎨 Design System
- **Primary**: `#0B3D91` (Deep Blue)
- **Accent**: `#FFC72C` (Gold)
- **Fonts**: Montserrat (headings) + Inter (body)
- **Mobile-first**: Bottom nav, responsive grid, touch-optimized

## 💳 Payment Integration (Backend)
Connect to MTN MoMo API and Airtel Money API:
- MTN: `https://developer.mtn.com/products/mobile-money`
- Airtel: `https://developers.airtel.africa`

## 🔌 Backend Integration Points
- Replace `src/data/index.js` with API calls
- Add authentication (JWT recommended)
- Connect Seat Sync Engine via WebSocket
- Integrate SMS notifications (Africa's Talking)

---
Built with ❤️ for Uganda · Raylane Express Ltd, Kampala
