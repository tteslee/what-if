# What-if: A Digital Testbed for Urban Innovation

A web application for exploring urban interventions through structured scenario analysis and stakeholder impact assessment.

## Overview

What-if helps urban planners, policymakers, and community members explore the potential impacts of urban interventions through a simplified, narrative-focused approach. Rather than complex simulations, it generates structured stress-test narratives that consider stakeholder perspectives, system effects, and implementation challenges.

## Key Design Principles

### 1. Required First, Optional Progressive
- **Required fields**: City/place, scope, main challenges
- **Optional fields**: Population context, political context, budget constraints, etc.
- **Progressive disclosure**: Users can add more details without blocking scenario generation

### 2. Portfolio Approach
- Combine multiple interventions to create synergistic effects
- Identify gaps and opportunities across different categories
- Analyze how different intervention types work together

### 3. Stress-Test Narratives
- Focus on stakeholders, risks, and next experiments rather than predictions
- Generate structured analysis with clear confidence levels
- Provide actionable insights for decision-making

## User Flow

### 1. Ask a What-if Question
Start with outcomes-focused questions like:
- "What if we could enhance the collective intelligence of Helsinki?"
- "What if we could cool Madrid by 8.5 degrees celsius?"
- "What if we could eliminate traffic fatalities in Singapore?"

### 2. Choose a City Context
Select from existing cities or create a custom city profile with:
- **Required**: Name, scale, main challenges
- **Optional**: Population context, vulnerable groups, regulatory context, etc.

### 3. Pick Interventions (Portfolio Approach)
Select multiple interventions to create synergistic effects:
- **Required**: Title, summary, category, scope of application
- **Optional**: Detailed description, parameters, synergies, risks, etc.
- View detailed information in pop-up modals
- Build portfolios across different intervention categories

### 4. Generate Scenario Analysis
Get a structured analysis including:
- **Narrative Summary**: 5-8 sentence story of what might happen
- **Stakeholder Impacts**: Benefits, concerns, and engagement needs for each group
- **System Effects**: Cross-domain impacts with polarity and confidence levels
- **Policy Interactions**: How interventions interact with existing policies
- **Risks & Unknowns**: Potential challenges and uncertainties
- **Signals to Watch**: Observable indicators of progress
- **Next Experiments**: Concrete, low-effort tests to reduce uncertainty

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: OpenAI GPT-4 for scenario generation
- **Data Validation**: Zod schemas

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Supabase database:
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `database-setup.sql` in your Supabase SQL editor
   - Note your project URL and anon key
4. Set up environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```
5. Run the development server: `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000)

## Database Setup

The app now uses Supabase for data persistence, allowing users to share cities, interventions, and scenarios across the platform. The database includes:

- **Cities**: City profiles with demographics, challenges, and context
- **Interventions**: Policy and infrastructure interventions
- **Scenarios**: What-if questions with city and intervention combinations
- **Results**: AI-generated scenario analysis results

All data is publicly readable, so users can benefit from the community's shared knowledge base.

## Project Structure

```
src/
├── components/          # React components
│   ├── CityForm.tsx    # Custom city creation form
│   ├── InterventionForm.tsx # Custom intervention creation form
│   └── AIChatInterface.tsx  # AI-powered generation interface
├── lib/
│   ├── schemas.ts      # Zod schemas for data validation
│   ├── store.ts        # Zustand state management
│   ├── export.ts       # Markdown export functionality
│   └── storage-service.ts # Local storage management
└── data/
    └── sample-data.ts  # Sample cities and interventions

app/
├── page.tsx            # Landing page with what-if question input
├── scenarios/
│   ├── new/           # Scenario creation flow
│   ├── [id]/          # Scenario result display
│   └── compare/       # Scenario comparison (legacy)
└── api/
    └── ai/            # AI-powered generation endpoints
```

## Data Models

### City Profile
- **Required**: `name`, `scale`, `mainChallenges`
- **Optional**: `populationContext`, `vulnerableGroups`, `regulatoryContext`, etc.

### Intervention
- **Required**: `title`, `summary`, `category`, `scopeOfApplication`
- **Optional**: `detailedDescription`, `parameters`, `synergies`, `risks`, etc.

### Scenario Result
- **Narrative Summary**: Story of potential outcomes
- **Stakeholder Impacts**: Group-specific benefits and concerns
- **System Effects**: Cross-domain impacts with confidence levels
- **Policy Interactions**: Regulatory and policy considerations
- **Risks & Assumptions**: Uncertainties and gaps
- **Signals & Experiments**: Monitoring and testing approaches

## Contributing

This is an experimental tool for urban innovation. Contributions are welcome, particularly around:
- Additional intervention categories and examples
- Improved AI prompts for scenario generation
- Enhanced stakeholder analysis frameworks
- Better export and sharing capabilities

## License

MIT License - see LICENSE file for details.
