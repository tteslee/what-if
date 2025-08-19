import { Scenario, Result } from './schemas';
import { sampleCities } from '../data/sample-data';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function exportToPDF(scenario: Scenario, result: Result): void {
  const city = sampleCities.find(c => c.id === scenario.cityId);
  if (!city) {
    throw new Error(`City not found: ${scenario.cityId}`);
  }

  const formatPercentage = (value: number) => `${Math.round(Math.abs(value * 100))}%`;
  const formatNumber = (value: number) => Math.abs(Math.round(value * 100) / 100);
  const formatCurrency = (value: number) => `£${Math.abs(Math.round(value * 100) / 100)}M`;

  // Create a temporary HTML element for the PDF content
  const pdfContent = document.createElement('div');
  pdfContent.style.padding = '40px';
  pdfContent.style.fontFamily = 'Arial, sans-serif';
  pdfContent.style.fontSize = '12px';
  pdfContent.style.lineHeight = '1.6';
  pdfContent.style.maxWidth = '800px';
  pdfContent.style.backgroundColor = 'white';
  pdfContent.style.color = 'black';

  pdfContent.innerHTML = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #1e40af; font-size: 28px; margin-bottom: 10px;">What-if Analysis</h1>
      <h2 style="color: #374151; font-size: 20px; font-weight: normal;">${scenario.title}</h2>
    </div>

    <div style="margin-bottom: 30px;">
      <h3 style="color: #1e40af; font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">City Context</h3>
      <p style="margin: 5px 0;"><strong>${city.name}</strong> - Population: ${city.population.toLocaleString()}, Households: ${city.households.toLocaleString()}</p>
    </div>

    <div style="margin-bottom: 30px;">
      <h3 style="color: #1e40af; font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">Intervention</h3>
      <p style="margin: 5px 0;"><strong>${scenario.intervention.name}</strong> (${scenario.intervention.domain})</p>
      <p style="margin: 5px 0; color: #6b7280;">${scenario.intervention.description || ''}</p>
      <p style="margin: 5px 0;"><strong>Rollout:</strong> ${scenario.intervention.rollout.scope} over ${scenario.intervention.rollout.durationMonths} months</p>
      <p style="margin: 5px 0;"><strong>Governance:</strong> ${scenario.intervention.governanceModel || 'Not specified'}</p>
    </div>

    <div style="margin-bottom: 30px;">
      <h3 style="color: #1e40af; font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">Key Assumptions</h3>
      ${scenario.assumptions.length > 0 
        ? scenario.assumptions.map(assumption => `<p style="margin: 5px 0;">• ${assumption}</p>`).join('')
        : '<p style="margin: 5px 0; color: #6b7280; font-style: italic;">No specific assumptions were added to this scenario.</p>'
      }
    </div>

    <div style="margin-bottom: 30px;">
      <h3 style="color: #1e40af; font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">Key Performance Indicators</h3>
      
      <div style="margin-bottom: 20px;">
        <h4 style="color: #374151; font-size: 14px; margin-bottom: 10px;">Environmental Impact</h4>
        <p style="margin: 5px 0;">• <strong>Emissions Change:</strong> ${formatPercentage(result.kpis.emissionsDeltaPct)} ${result.kpis.emissionsDeltaPct > 0 ? 'increase' : 'decrease'}</p>
        <p style="margin: 5px 0;">• <strong>Congestion Change:</strong> ${formatPercentage(result.kpis.congestionDeltaPct)} ${result.kpis.congestionDeltaPct > 0 ? 'increase' : 'decrease'}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="color: #374151; font-size: 14px; margin-bottom: 10px;">Mobility & Transport</h4>
        <p style="margin: 5px 0;">• <strong>Commute Time Change:</strong> ${formatNumber(result.kpis.avgCommuteDeltaMin)} minutes ${result.kpis.avgCommuteDeltaMin > 0 ? 'increase' : 'decrease'}</p>
        <p style="margin: 5px 0;">• <strong>Modal Shift:</strong></p>
        <div style="margin-left: 20px;">
          <p style="margin: 3px 0;">- Car: ${formatPercentage(result.kpis.modalShift.car)}</p>
          <p style="margin: 3px 0;">- Transit: ${formatPercentage(result.kpis.modalShift.transit)}</p>
          <p style="margin: 3px 0;">- Walk: ${formatPercentage(result.kpis.modalShift.walk)}</p>
          <p style="margin: 3px 0;">- Cycle: ${formatPercentage(result.kpis.modalShift.cycle)}</p>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="color: #374151; font-size: 14px; margin-bottom: 10px;">Economic & Social</h4>
        <p style="margin: 5px 0;">• <strong>Fiscal Impact:</strong> ${formatCurrency(result.kpis.fiscalImpactMGBP)} annually</p>
        <p style="margin: 5px 0;">• <strong>Health Index Change:</strong> ${formatNumber(result.kpis.healthIndexDelta)} points ${result.kpis.healthIndexDelta > 0 ? 'improvement' : 'decline'}</p>
        <p style="margin: 5px 0;">• <strong>Trust Index Change:</strong> ${formatNumber(result.kpis.trustIndexDelta)} points ${result.kpis.trustIndexDelta > 0 ? 'improvement' : 'decline'}</p>
        <p style="margin: 5px 0;">• <strong>Equity Score:</strong> ${formatPercentage(result.kpis.equityScore)} (weights impacts for vulnerable groups)</p>
      </div>
    </div>

    <div style="margin-bottom: 30px;">
      <h3 style="color: #1e40af; font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">Three Key Insights</h3>
      ${result.narrativeFindings.slice(0, 3).map((finding, index) => 
        `<p style="margin: 8px 0;"><strong>${index + 1}.</strong> ${finding}</p>`
      ).join('')}
    </div>

    <div style="margin-bottom: 30px;">
      <h3 style="color: #1e40af; font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">Three Key Risks</h3>
      ${result.risks.slice(0, 3).map((risk, index) => 
        `<p style="margin: 8px 0;"><strong>${index + 1}.</strong> ${risk}</p>`
      ).join('')}
    </div>

    <div style="margin-bottom: 30px;">
      <h3 style="color: #1e40af; font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">Stakeholder Sentiment</h3>
      <p style="margin: 5px 0;">• <strong>Citizens:</strong> ${formatSentiment(result.stakeholderSentiment.citizens)}</p>
      <p style="margin: 5px 0;">• <strong>Businesses:</strong> ${formatSentiment(result.stakeholderSentiment.businesses)}</p>
      <p style="margin: 5px 0;">• <strong>NGOs:</strong> ${formatSentiment(result.stakeholderSentiment.ngo)}</p>
      <p style="margin: 5px 0;">• <strong>Local Council:</strong> ${formatSentiment(result.stakeholderSentiment.council)}</p>
    </div>

    <div style="margin-bottom: 30px;">
      <h3 style="color: #1e40af; font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">Confidence Level</h3>
      <p style="margin: 5px 0;"><strong>${Math.round(result.confidence * 100)}%</strong> - Based on data quality and intervention complexity</p>
    </div>

    <div style="margin-top: 40px; padding: 20px; background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px;">
      <p style="margin: 0; color: #92400e; font-size: 11px;">
        <strong>⚠️ Important Note:</strong> This is an exploratory simulation, not a forecast. Results are based on simplified models and assumptions. Use for decision support and sensemaking, not prediction.
      </p>
    </div>

    <div style="margin-top: 20px; text-align: center; color: #6b7280; font-size: 10px; font-style: italic;">
      Generated by What-if: A digital testbed for urban innovation
    </div>
  `;

  // Add the element to the DOM temporarily
  document.body.appendChild(pdfContent);

  // Convert to canvas and then to PDF
  html2canvas(pdfContent, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff'
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Download the PDF
    const filename = `what-if-${scenario.id}.pdf`;
    pdf.save(filename);

    // Clean up
    document.body.removeChild(pdfContent);
  });
}

function formatSentiment(sentiment: number): string {
  if (sentiment >= 0.5) return 'Strongly Positive';
  if (sentiment >= 0.1) return 'Positive';
  if (sentiment >= -0.1) return 'Neutral';
  if (sentiment >= -0.5) return 'Negative';
  return 'Strongly Negative';
}

// Keep the old markdown function for backward compatibility
export function exportToMarkdown(scenario: Scenario, result: Result): string {
  const city = sampleCities.find(c => c.id === scenario.cityId);
  if (!city) {
    throw new Error(`City not found: ${scenario.cityId}`);
  }

  const formatPercentage = (value: number) => `${Math.round(Math.abs(value * 100))}%`;
  const formatNumber = (value: number) => Math.abs(Math.round(value * 100) / 100);
  const formatCurrency = (value: number) => `£${Math.abs(Math.round(value * 100) / 100)}M`;

  const markdown = `# What-if Analysis: ${scenario.title}

## City Context
**${city.name}** - Population: ${city.population.toLocaleString()}, Households: ${city.households.toLocaleString()}

## Intervention
**${scenario.intervention.name}** (${scenario.intervention.domain})
${scenario.intervention.description || ''}

**Rollout:** ${scenario.intervention.rollout.scope} over ${scenario.intervention.rollout.durationMonths} months
**Governance:** ${scenario.intervention.governanceModel || 'Not specified'}

## Key Assumptions
${scenario.assumptions.map(assumption => `- ${assumption}`).join('\n')}

## Key Performance Indicators

### Environmental Impact
- **Emissions Change:** ${formatPercentage(result.kpis.emissionsDeltaPct)} ${result.kpis.emissionsDeltaPct > 0 ? 'increase' : 'decrease'}
- **Congestion Change:** ${formatPercentage(result.kpis.congestionDeltaPct)} ${result.kpis.congestionDeltaPct > 0 ? 'increase' : 'decrease'}

### Mobility & Transport
- **Commute Time Change:** ${formatNumber(result.kpis.avgCommuteDeltaMin)} minutes ${result.kpis.avgCommuteDeltaMin > 0 ? 'increase' : 'decrease'}
- **Modal Shift:**
  - Car: ${formatPercentage(result.kpis.modalShift.car)} → ${formatPercentage(result.kpis.modalShift.car + result.kpis.modalShift.car)}
  - Transit: ${formatPercentage(result.kpis.modalShift.transit)} → ${formatPercentage(result.kpis.modalShift.transit + result.kpis.modalShift.transit)}
  - Walk: ${formatPercentage(result.kpis.modalShift.walk)} → ${formatPercentage(result.kpis.modalShift.walk + result.kpis.modalShift.walk)}
  - Cycle: ${formatPercentage(result.kpis.modalShift.cycle)} → ${formatPercentage(result.kpis.modalShift.cycle + result.kpis.modalShift.cycle)}

### Economic & Social
- **Fiscal Impact:** ${formatCurrency(result.kpis.fiscalImpactMGBP)} annually
- **Health Index Change:** ${formatNumber(result.kpis.healthIndexDelta)} points ${result.kpis.healthIndexDelta > 0 ? 'improvement' : 'decline'}
- **Trust Index Change:** ${formatNumber(result.kpis.trustIndexDelta)} points ${result.kpis.trustIndexDelta > 0 ? 'improvement' : 'decline'}
- **Equity Score:** ${formatPercentage(result.kpis.equityScore)} (weights impacts for vulnerable groups)

## Three Key Insights
${result.narrativeFindings.slice(0, 3).map((finding, index) => `${index + 1}. ${finding}`).join('\n')}

## Three Key Risks
${result.risks.slice(0, 3).map((risk, index) => `${index + 1}. ${risk}`).join('\n')}

## Stakeholder Sentiment
- **Citizens:** ${formatSentiment(result.stakeholderSentiment.citizens)}
- **Businesses:** ${formatSentiment(result.stakeholderSentiment.businesses)}
- **NGOs:** ${formatSentiment(result.stakeholderSentiment.ngo)}
- **Local Council:** ${formatSentiment(result.stakeholderSentiment.council)}

## Confidence Level
**${Math.round(result.confidence * 100)}%** - Based on data quality and intervention complexity

---

**⚠️ Important Note:** This is an exploratory simulation, not a forecast. Results are based on simplified models and assumptions. Use for decision support and sensemaking, not prediction.

*Generated by What-if: A digital testbed for urban innovation*
`;

  return markdown;
}

export function downloadMarkdown(content: string, filename: string = 'what-if-analysis.md') {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
