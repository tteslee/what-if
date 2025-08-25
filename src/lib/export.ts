import { Scenario, ScenarioResult, CityProfile, Intervention } from './schemas';

export function exportToMarkdown(scenario: Scenario, result: ScenarioResult, city: CityProfile, interventions: Intervention[]): string {
  const selectedInterventions = interventions.filter(i => scenario.interventionIds.includes(i.id));
  
  const markdown = `# What-if Analysis: ${scenario.whatIfQuestion}

## Context

**City:** ${city.name}
${city.mainChallenges ? `**Main Challenges:** ${city.mainChallenges.join(', ')}` : ''}
${city.populationContext?.size ? `**Population:** ${city.populationContext.size.toLocaleString()}` : ''}
${city.populationContext?.demographics ? `**Demographics:** ${city.populationContext.demographics}` : ''}

**Interventions:**
${selectedInterventions.map(int => `- ${int.title} (${int.category})`).join('\n')}

## Narrative Summary

${result.narrativeSummary}

## Stakeholder Impacts

${result.stakeholderImpacts.map(impact => `
### ${impact.group.charAt(0).toUpperCase() + impact.group.slice(1)}

**Benefits:**
${impact.benefits.map(benefit => `- ${benefit}`).join('\n')}

**Concerns:**
${impact.concerns.map(concern => `- ${concern}`).join('\n')}

**Engagement Needs:**
${impact.engagementNeeds.map(need => `- ${need}`).join('\n')}

${impact.stance ? `**Stance:** ${impact.stance}` : ''}
`).join('\n')}

## System Effects

${result.systemEffects.map(effect => `
### ${effect.domain}
**Effect:** ${effect.effect}
**Polarity:** ${effect.polarity}
**Confidence:** ${effect.confidence}
`).join('\n')}

## Policy & Trend Interactions

${result.policyInteractions.map(interaction => `
### ${interaction.policy}
**Interaction:** ${interaction.interaction}
**Description:** ${interaction.description}
`).join('\n')}

## Risks & Unknowns

${result.risks.map(risk => `
### ${risk.risk}
**Likelihood:** ${risk.likelihood}
**Impact:** ${risk.impact}
`).join('\n')}

## Assumptions & Gaps

${result.assumptions.map(assumption => `
### ${assumption.assumption}
**Confidence:** ${assumption.confidence}
`).join('\n')}

## Signals to Watch

${result.signals.map(signal => `
### ${signal.signal}
${signal.description}
`).join('\n')}

## Next Experiments

${result.experiments.map(experiment => `
### ${experiment.experiment}
**Effort:** ${experiment.effort}
**Timeline:** ${experiment.timeline}
`).join('\n')}

${result.synergies && result.synergies.length > 0 ? `
## Portfolio Synergies

${result.synergies.map(synergy => `- ${synergy}`).join('\n')}
` : ''}

${result.gaps && result.gaps.length > 0 ? `
## Portfolio Gaps

${result.gaps.map(gap => `- ${gap}`).join('\n')}
` : ''}

---

*Generated on ${result.generatedAt} • Confidence: ${Math.round(result.confidence_0_1 * 100)}%*
`;

  return markdown;
}

export function downloadMarkdown(markdown: string, filename: string): void {
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
