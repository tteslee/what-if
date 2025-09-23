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

## Contributing

This is an experimental tool for urban innovation. Contributions are welcome, particularly around:
- Additional intervention categories and examples
- Improved AI prompts for scenario generation
- Enhanced stakeholder analysis frameworks

## License and attribution

MIT License - see LICENSE file for details.
Made by Eunsoo Lee with help from Cursor. This is currently a hobby-project.
