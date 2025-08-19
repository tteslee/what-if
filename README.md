# What-if: A Digital Testbed for Urban Innovation

What-if is a browser-based MVP that lets policy and innovation teams simulate urban interventions before real-world pilots or workshops. It's designed to be fast, legible, and shareable - perfect for decision support and sensemaking.

## 🎯 Primary Goal

Let users ask "What if we..." questions, configure city contexts, run lightweight simulations, and compare outcomes across scenarios - both quantitative and qualitative.

## ✨ Key Features

- **Question-First Design**: Every flow begins with "What if we..."
- **City Context Configuration**: Choose from preset cities or upload custom data
- **Intervention Simulation**: Test Mobility, Energy, Housing, Public Health, and Governance interventions
- **Lightweight Simulation Engine**: Agent/system dynamics approximation with stochastic variation
- **Comprehensive Outcomes**: KPIs, narrative insights, equity scores, and stakeholder sentiment
- **Scenario Comparison**: Run multiple what-ifs side by side
- **Export Functionality**: Generate one-page Markdown summaries for sharing

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17.1 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd what-if
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run tests
npm test

# Run tests in watch mode
npm run test:ui

# Run tests once
npm run test:run
```

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Validation**: Zod
- **Charts**: Recharts (Bar, Line, Radar)
- **Testing**: Vitest + React Testing Library

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx          # Landing page with "What if we..." input
│   ├── scenarios/
│   │   ├── new/          # Scenario creation wizard
│   │   ├── [id]/         # Results dashboard
│   │   └── compare/      # Scenario comparison
│   └── layout.tsx        # Root layout with navigation
├── components/            # Reusable UI components
├── lib/                   # Core business logic
│   ├── schemas.ts        # Zod data schemas
│   ├── simulate.ts       # Simulation engine
│   ├── store.ts          # Zustand state management
│   └── export.ts         # Markdown export functionality
├── data/                  # Sample data and seed cities
└── test/                  # Test setup and utilities
```

## 📊 Data Model

### Core Schemas

- **City**: Population, households, modal split, emissions, health indices
- **Intervention**: Domain, parameters, rollout strategy, governance model
- **Scenario**: What-if question, city context, intervention, assumptions
- **Result**: KPIs, narratives, risks, stakeholder sentiment, confidence

### Sample Data

The application comes with two sample cities:
- **Midvale**: 125K population, car-dominant transport
- **Harbourton**: 89K population, more balanced modal split

And three intervention types:
- **Congestion Charge**: Mobility intervention with district rollout
- **Community Solar**: Energy intervention with citywide scope
- **Vacant-to-Co-Housing**: Housing intervention as a pilot

## 🔬 Simulation Engine

The simulation engine applies simple coefficient rules to city baselines with stochastic variation:

- **Deterministic Base**: Core impact coefficients for each intervention domain
- **Stochastic Variation**: 3 different seeds for scenario comparison
- **Narrative Generation**: Dynamic text based on simulation results
- **Risk Assessment**: Domain-specific risk templates
- **Sentiment Modeling**: Stakeholder response based on intervention type

## 🎨 UX Principles

- **British English**: Brevity, clarity, criticality
- **Question-First**: Always lead with "What if we..."
- **Exploration Focus**: Emphasise exploration over prediction
- **Uncertainty Awareness**: Make assumptions and caveats explicit
- **Decision Support**: Always show what changed and so what

## 🧪 Testing

The application includes comprehensive testing:

- **Unit Tests**: Simulation engine reproducibility and validation
- **Schema Tests**: Zod validation and type safety
- **Component Tests**: UI component functionality
- **Integration Tests**: End-to-end user flows

Run tests with:
```bash
npm test
```

## 📝 Export & Sharing

Generate comprehensive Markdown reports including:
- Scenario overview and assumptions
- KPI changes and deltas
- Key insights and risks
- Equity and sentiment analysis
- Confidence levels and caveats

## 🚫 Non-Goals (MVP)

- Real-time data ingestion
- Forecasting claims (this is a design tool, not a predictor)
- User authentication or payments
- Multi-tenant administration
- Heavy computational simulations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

Inspired by 20th century modern graphic design principles and the New York City subway design system. Built for policy makers, urban planners, and innovation teams who need to explore possibilities before committing to real-world interventions.

---

**⚠️ Important**: This is an exploratory simulation tool, not a forecast. Use for decision support and sensemaking, not prediction.
