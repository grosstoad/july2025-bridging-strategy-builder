# Bridging Strategy Builder 🏠

A sophisticated web application that helps property buyers and investors calculate optimal bridging finance strategies when transitioning between properties. Built with modern web technologies and powered by real-time property data.

## 🎯 Overview

The Bridging Strategy Builder is designed to solve a complex financial challenge: determining the optimal financing strategy when buying a new property before selling an existing one. It provides:

- **Intelligent Calculations**: Uses an iterative solver to handle circular dependencies in bridging loan calculations
- **Real Property Data**: Integrates with PropTrack API for accurate property valuations and market insights
- **User-Friendly Interface**: Step-by-step guidance through the property transition process
- **Comprehensive Analysis**: Detailed breakdown of costs, loan structures, and cash requirements

## ✨ Key Features

### Property Intelligence
- 🔍 **Smart Address Search**: Combines PropTrack property data with Australia Post suburb information
- 📊 **Real-Time Valuations**: Access to current property valuations and market data
- 🏘️ **Market Context**: Supply, demand, and days-on-market insights for informed decisions

### Bridging Calculator
- 💰 **Complex Calculations**: Handles ICAP (Interest Capitalised) and Interest Only repayment types
- 🔄 **Iterative Solver**: Converges on optimal loan structures considering all constraints
- 📈 **LVR Management**: Tracks peak debt and end debt loan-to-value ratios
- 💵 **Fee Optimization**: Intelligently handles capitalised vs. non-capitalised fees

### User Experience
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 💾 **Data Persistence**: Saves progress across browser sessions
- 🎨 **Clean Interface**: Material-UI components with thoughtful visual hierarchy
- 📋 **Detailed Reports**: Expandable calculation logs showing all intermediate steps

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript for type-safe component development
- **Material-UI v5** for consistent, accessible UI components
- **React Router v6** for client-side navigation
- **React Hook Form** for efficient form management
- **Vite** for lightning-fast development and optimized builds

### Backend
- **Express.js** server for secure API proxy
- **OAuth 2.0** implementation for PropTrack authentication
- **Serverless-ready** architecture for Vercel deployment
- **CORS-enabled** for secure cross-origin requests

### Architecture Highlights
- 🔐 **Secure API Proxy**: Backend handles all API credentials, frontend never sees keys
- 🚀 **Performance Optimized**: Debounced searches, request cancellation, efficient caching
- 🧩 **Modular Design**: Clear separation of concerns with reusable components
- 📐 **Type Safety**: Comprehensive TypeScript interfaces throughout

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PropTrack API credentials (contact PropTrack for access)
- Australia Post PAC API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/grosstoad/july2025-bridging-strategy-builder.git
   cd july2025-bridging-strategy-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your API credentials:
   ```env
   # PropTrack API Authentication
   PROPTRACK_AUTH_HEADER=Basic [base64_encoded_credentials]
   VITE_PROPTRACK_API_KEY=[your_api_key]
   VITE_PROPTRACK_API_SECRET=[your_api_secret]
   
   # Australia Post PAC API
   VITE_AUSPOST_API_KEY=[your_auspost_key]
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```
   This starts both frontend (port 3000) and backend proxy (port 3100)

## 📁 Project Structure

```
src/
├── pages/              # Route components and main pages
├── components/         # Reusable UI components
│   ├── inputs/        # Form input components
│   ├── layout/        # Layout and navigation components
│   └── bridging-calculator/  # Calculator-specific sections
├── contexts/          # React context for state management
├── hooks/             # Custom React hooks for data fetching
├── types/             # TypeScript type definitions
├── logic/             # Business logic and calculations
├── services/          # API integration services
└── server/            # Express backend for API proxy
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PROPTRACK_AUTH_HEADER` | Base64 encoded PropTrack credentials | Yes |
| `VITE_PROPTRACK_API_KEY` | PropTrack API key | Yes |
| `VITE_PROPTRACK_API_SECRET` | PropTrack API secret | Yes |
| `VITE_AUSPOST_API_KEY` | Australia Post PAC API key | Yes |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) | Yes (production) |

### Calculation Parameters

Default assumptions can be configured in `src/config/bridgingCalculatorDefaults.ts`:
- Valuation shading percentages
- Maximum LVR limits
- Default fee structures
- Solver convergence parameters

## 🌐 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   - Import repository from GitHub
   - Vercel will auto-detect configuration

2. **Configure Environment Variables**
   - Add all variables from `.env.local` to Vercel dashboard
   - Use different values for development/production

3. **Deploy**
   - Vercel automatically builds and deploys on push to main
   - Serverless functions handle API proxy endpoints

### Production Considerations
- Enable rate limiting for API endpoints
- Configure CORS for your production domain
- Monitor API usage and costs
- Set up error tracking (e.g., Sentry)

## 🧮 Bridging Calculator Logic

The calculator uses an iterative approach to solve the circular dependency between:
- Bridge debt amount
- Capitalised fees (which depend on bridge debt)
- Peak debt limits
- End debt requirements

### Key Calculations
1. **Bridge Debt**: Amount needed to purchase new property before selling
2. **Peak Debt**: Maximum total debt during bridging period
3. **End Debt**: Remaining loan after property sale
4. **LVR Checks**: Ensures loans stay within acceptable limits
5. **Cash Requirements**: Additional funds needed beyond loans

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is proprietary software. All rights reserved.

## 🙏 Acknowledgments

- **PropTrack** for providing comprehensive property data APIs
- **Australia Post** for suburb and postcode search capabilities
- **Material-UI** for the excellent component library
- All contributors who have helped shape this tool

## 📞 Support

For questions or support:
- Open an issue on GitHub
- Contact the development team
- Check the documentation in the `/documentation` folder

---

Built with ❤️ for the Australian property market