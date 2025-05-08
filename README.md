# Flyff Universe Skill Simulator

![Project Banner](/public/metadata/manifest.png)

A skill build simulator for Flyff Universe, built with Next.js and React Flow.</br>
Plan and visualize your character's skill build before investing in-game.</br>
All skill data is directly retrieved from [Flyff Universe API](https://api.flyff.com).

## 🌟 Features

- **Interactive Skill Tree**: Visualize skill paths and dependencies
- **All Classes Supported**: Complete skill trees for every class in Flyff Universe
- **Build Sharing**: Share your builds via URL
- **Real-time Updates**: See skill effects and requirements instantly
- **Mobile Friendly**: Fully responsive design
- **No Backend Required**: All data stored in URL parameters

![Project Demo](/public/metadata/demo.png)

![Skill Description](/public/metadata/skill-description.png)

## 🚀 Live Demo

Visit: [Flyff Skill Simulator](https://flyff-skill-simulator.vercel.app)

![Project Demo Live](/public/metadata/demo-live.gif)

## 💻 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/guysuvijak/flyff-skill-simulator.git
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open http://localhost:3000 in your browser

## 🛠️ Built With

- <img src="https://avatars.githubusercontent.com/u/126103961" title="Next JS" alt="nextjs" width="20" height="20"/> Next.js - React Framework
- <img src="https://avatars.githubusercontent.com/u/7106853" title="React Flow" alt="reactflow" width="20" height="20"/> React Flow - Node-based Visualization
- <img src="https://avatars.githubusercontent.com/u/45790596" title="Zustand" alt="zustand" width="20" height="20"/> Zustand - State Management
- <img src="https://avatars.githubusercontent.com/u/67109815" title="Tailwind CSS" alt="tailwindcss" width="20" height="20"/> TailwindCSS - Styling
- <img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" title="TypeScript" alt="typscript" width="20" height="20"/> TypeScript - Type Safety

## 🗺️ Project Structure

```bash
flyff-skill-simulator/
├── public/              # Static assets
│   ├── data/            # Static Flyff Data
│   └── images/class/    # Static Class Image Icon
└── src/
    ├── app/             # layout & page next.js
    ├── components/      # React & React Flow components
    ├── store/           # Zustand store
    └── utils/           # Frequently used utility functions
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## 🙏 Acknowledgments

Flyff Universe for the amazing game. The Flyff community for support and feedback :heart:
