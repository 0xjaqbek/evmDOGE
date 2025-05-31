# My Company D.O.G.E. Platform

A modern decentralized application built on the Solana blockchain with React, Vite, and Tailwind CSS. This platform features web3 wallet authentication, user profiles, and smart contract integration.

![My Company D.O.G.E. Platform](./screenshot.png)

## 🚀 Quick Start

Follow these steps to get the project running on your local machine.

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-organization/my-company-doge.git
cd my-company-doge
```

2. **Install dependencies**

```bash
# Using npm
npm install

# OR using yarn
yarn
```

3. **Set up environment variables**

Create a `.env` file in the root directory with the following content:

```
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_PROGRAM_ID=your_program_id_here
```

### Running the project

```bash
# Development mode
npm run dev

# OR
yarn dev
```

The application will be available at `http://localhost:5173/` (or another port if 5173 is in use).

## 📁 Project Structure

```
my-company-doge/
├── public/              # Static files
├── src/
│   ├── assets/
│   │   └── images/      # Image files (including 1.png, 2.png, 5.png)
│   ├── components/      # React components
│   │   ├── Dashboard/   # Dashboard-related components
│   │   ├── Layout/      # Layout components
│   │   ├── Profile/     # Profile components
│   │   ├── Wallet/      # Wallet-related components
│   │   └── shared/      # Shared/common components
│   ├── context/         # React contexts (Auth, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # Service modules
│   ├── styles/          # CSS styles
│   └── utils/           # Utility functions
├── .env                 # Environment variables
├── index.html           # HTML entry point
├── package.json         # Project dependencies
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.js       # Vite configuration
```

## 🔧 Required Files

Make sure these specific image files exist in your assets directory:

- `src/assets/images/1.png` - Used in Story section
- `src/assets/images/2.png` - Used as 3D model in Hero section
- `src/assets/images/5.png` - Used as background in Mission section
- `src/assets/images/STP.webp` - Partner logo in Tokenomics section

## 🎨 Styling

The project uses Tailwind CSS with custom styles for the gold and dark brown theme. Key color values:

- Gold: `#D4AF37`
- Dark Brown: `#1A120B`
- App Background: `#0a0a0a`

## 🔌 Wallet Integration

The project uses Solana wallet adapter for wallet integration:

- Custom wallet button component located at `src/components/Wallet/CustomWalletButton.jsx`
- Special CSS overrides in `src/styles/landingPage.css` to maintain gold styling

## 🛠️ Troubleshooting

### Common Issues

**Wallet button styling issues**

If the wallet button doesn't maintain gold styling after connecting:
- Check that the CSS overrides in `landingPage.css` are imported correctly
- Make sure the `CustomWalletButton` component is being used instead of the default wallet adapter button

**Images not displaying**

Verify that all required images are in the correct location:
- Check the `src/assets/images/` directory for required images
- Confirm that import paths match the actual file locations

**Solana connection issues**

- Check that your RPC URL in the `.env` file is correct
- Ensure you're on the correct network (default is devnet)
- Check browser console for specific error messages

**Vite build errors**

- Make sure all dependencies are installed correctly
- Check for version conflicts in package.json
- Run `npm clean-install` to reset the node_modules directory

## 📱 Mobile Responsiveness

The application is designed to be responsive across devices:

- On mobile devices, the navigation is collapsed into a hamburger menu
- The layout adjusts from multiple columns to a single column on small screens
- Font sizes are reduced appropriately on mobile

## 🔄 Development Workflow

1. Run the development server with `npm run dev`
2. Make changes to files and see them instantly with hot module replacement
3. Use `npm run build` to create a production build
4. Use `npm run preview` to preview the production build locally

## 📝 Additional Notes

- The wallet modal styling is overridden to match the app's theme
- The header navigation is fixed to the top of the screen
- Smooth scrolling is implemented for anchor links
- Animations are used for feature cards and the 3D model