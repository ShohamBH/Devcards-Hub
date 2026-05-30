# 🎨 DevCards Frontend

A modern React + TypeScript frontend for generating professional digital business cards.

## 🛠 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **Supabase Client** - Real-time database client
- **QR Code** - QR code generation

## 📋 Prerequisites

- Node.js v18 or higher
- npm or yarn
- Supabase account with configured database

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in this directory:

```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_KEY=your-supabase-key
```

For production:

```env
VITE_API_URL=https://your-api-domain.com
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_KEY=your-supabase-key
```

### 3. Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

The app will automatically reload when you make changes (HMR).

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

Preview the production build:

```bash
npm run preview
```

## 🧪 Linting

```bash
npm run lint
```

Runs ESLint to check for code quality issues.

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── CardForm/       # Form for creating cards
│   ├── CardPreview/    # Real-time card preview
│   ├── CardView/       # Display published cards
│   ├── ThemeSelector/  # Theme selection UI
│   └── Footer/         # Footer component
├── pages/              # Page components
│   ├── CardDashboard/  # Main dashboard
│   └── CardView/       # Public card view
├── hooks/              # Custom React hooks
├── lib/                # Utilities and helpers
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## 🎨 Themes

DevCards supports multiple themes:

- **VS Code IDE** - Modern code editor aesthetic
- **Retro Terminal** - Classic terminal look
- **Cyberpunk** - Neon futuristic style
- **Minimalist** - Clean and simple

## 🔄 API Integration

The frontend communicates with the backend API at `VITE_API_URL`:

### Key Endpoints

- `POST /api/cards` - Create a new card
- `GET /api/cards/{id}` - Get card by ID
- `PUT /api/cards/{id}` - Update card
- `DELETE /api/cards/{id}` - Delete card

See [../DevCards.Api/README.md](../DevCards.Api/README.md) for full API documentation.

## 📝 Features

- ✅ Real-time form preview
- ✅ Multiple color themes
- ✅ QR code generation
- ✅ URL validation
- ✅ Email validation
- ✅ Project showcase (up to 5 projects)
- ✅ Social links integration
- ✅ Responsive design
- ✅ Mobile-friendly interface

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

### Manual Deployment

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your hosting provider
3. Configure environment variables in your hosting dashboard
4. Set up redirects to `index.html` for client-side routing

See [../DEPLOYMENT.md](../DEPLOYMENT.md) for detailed instructions.

## 🔐 Environment Variables

Required environment variables (in `.env`):

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_KEY` | Supabase public key | Yes |

## 📊 Performance

- **Fast builds** with Vite (instant HMR)
- **Tree-shaking** removes unused code
- **Code splitting** for faster page loads
- **Lazy loading** of route components
- **Tailwind CSS** purges unused styles in production

## 🐛 Troubleshooting

### CORS Errors

Ensure `VITE_API_URL` matches the backend's `AllowedOrigins` setting.

### Cards Not Loading

Check that `VITE_API_URL` points to the correct API instance.

### Build Fails

Try clearing cache:

```bash
rm -rf node_modules dist
npm install
npm run build
```

## 📞 Support

For issues or questions, contact: **shoham.dahan.pro@gmail.com**

---

**Made with ❤️ using DevCards**
