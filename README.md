# Flyff Universe Skill Simulator

![Project Banner](/public/metadata/manifest.png)

A comprehensive skill build simulator for Flyff Universe, built with Next.js 15 and React Flow.</br>
Plan and visualize your character's skill build before investing in-game with our interactive skill tree.</br>
All skill data is directly retrieved from [Flyff Universe API](https://api.flyff.com).

## 🌟 Features

- **Interactive Skill Tree**: Visualize skill paths and dependencies with React Flow
- **All Classes Supported**: Complete skill trees for every class in Flyff Universe (Knight, Blade, Elementor, Ranger, Billposter, Ringmaster, Jester, Acrobat, Assist, Mercenary, Psychikeeper, Vagrant, Magician)
- **Build Sharing & Loading**: Share your builds via URL or import/export JSON files
- **Multi-Language Support**: Available in 12 languages (English, Thai, Japanese, Vietnamese, Chinese, Brazilian Portuguese, German, French, Indonesian, Korean, Spanish)
- **Real-time Updates**: See skill effects, requirements, and character stats instantly
- **Mobile Friendly**: Fully responsive design with PWA support
- **Theme Customization**: Multiple theme colors and dark/light mode
- **No Backend Required**: All data stored in URL parameters with LZ-string compression
- **Screenshot Feature**: Capture and save your skill builds as images
- **Character Level Management**: Dynamic skill point calculation based on character level

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

- <img src="https://avatars.githubusercontent.com/u/126103961" title="Next.js 15" alt="nextjs" width="20" height="20"/> **Next.js 15** - React Framework with App Router
- <img src="https://avatars.githubusercontent.com/u/7106853" title="React Flow" alt="reactflow" width="20" height="20"/> **React Flow** - Interactive node-based skill tree visualization
- <img src="https://avatars.githubusercontent.com/u/45790596" title="Zustand" alt="zustand" width="20" height="20"/> **Zustand** - Lightweight state management
- <img src="https://avatars.githubusercontent.com/u/67109815" title="Tailwind CSS" alt="tailwindcss" width="20" height="20"/> **TailwindCSS** - Utility-first CSS framework
- <img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" title="TypeScript" alt="typescript" width="20" height="20"/> **TypeScript** - Type safety and better development experience
- **Shadcn UI** - Accessible UI components (Dialog, Dropdown, Select, Tooltip, etc.)
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon library
- **LZ-string** - Data compression for URL sharing

## 🗺️ Project Structure

```bash
flyff-skill-simulator/
├── public/                    # Static assets
│   ├── data/                  # Static Flyff data (classes, skills)
│   ├── images/class/          # Class icons and images
│   ├── cursors/               # Custom cursor assets
│   └── metadata/              # Demo images and screenshots
├── src/
│   ├── app/                   # Next.js App Router (layout, page)
│   ├── components/            # React components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── SkillNode.tsx      # Interactive skill nodes
│   │   ├── Navbar.tsx         # Main navigation
│   │   └── EdgeLabel.tsx      # Skill tree edge labels
│   ├── stores/                # Zustand state management
│   │   ├── classStore.ts      # Class selection state
│   │   ├── skillStore.ts      # Skill data and levels
│   │   ├── characterStore.ts  # Character stats
│   │   └── websiteStore.ts    # UI settings and theme
│   ├── hooks/                 # Custom React hooks
│   ├── locales/               # Multi-language support (12 languages)
│   ├── providers/             # Context providers
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
│       ├── shareBuild.ts      # Build sharing and loading
│       ├── skillUtils.ts      # Skill calculations
│       └── classUtils.ts      # Class data handling
```

## 🌍 Supported Languages

- 🇺🇸 English (en)
- 🇹🇭 Thai (th)
- 🇯🇵 Japanese (jp)
- 🇻🇳 Vietnamese (vi)
- 🇨🇳 Chinese Simplified (cns)
- 🇧🇷 Brazilian Portuguese (br)
- 🇩🇪 German (de)
- 🇫🇷 French (fr)
- 🇮🇩 Indonesian (id)
- 🇰🇷 Korean (kr)
- 🇪🇸 Spanish (sp)

## 📱 PWA Features

- **Offline Support** - Works without internet connection
- **Installable** - Add to home screen on mobile devices
- **Fast Loading** - Optimized with Next.js and caching
- **Responsive Design** - Works perfectly on all screen sizes

## 🔧 Development Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
npm run check    # Run lint and format check
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📈 Version History

Current version: **1.5.5f** (2025-07-20)

See [CHANGELOG.md](CHANGELOG.md) for detailed version history and updates.

## 🙏 Acknowledgments

- ☕ **Support the project**: [Buy me a coffee](https://ko-fi.com/guysuvijak)
- ☎️ **Contact**: [Facebook](https://web.facebook.com/guy.suvijak) or [Discord](https://discord.com/users/220231582722555924)
- 🌟 **Star the repository** if you find this project helpful!

---

**Made with ❤️ for the Flyff Universe community**
