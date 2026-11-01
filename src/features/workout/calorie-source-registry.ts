/**
 * Internal registry of scientific sources used by the calorie engine.
 * Never surface MET codes or this registry in normal user-facing UI.
 */

export type CalorieSourceEntry = {
  id: string;
  name: string;
  url: string;
  activityClassification: string;
  referenceValue: string;
  measuredOrProxy: 'measured_activity' | 'category_proxy';
  limitations: string;
  lastVerified: string;
};

export const CALORIE_SOURCE_REGISTRY: CalorieSourceEntry[] = [
  {
    id: 'compendium-2024',
    name: '2024 Adult Compendium of Physical Activities',
    url: 'https://pacompendium.com/adult-compendium/',
    activityClassification: 'Conditioning exercise codes (e.g. 02054, 02050, 02020–02024, 02101)',
    referenceValue: 'MET by specific activity code',
    measuredOrProxy: 'measured_activity',
    limitations:
      'Describes activities/sessions, not every named gym lift (bench press, curl, etc.).',
    lastVerified: '2026-11-01',
  },
  {
    id: 'compendium-2024-paper',
    name: '2024 Adult Compendium update (PMC10818145)',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10818145/',
    activityClassification: 'Methodology for MET updates',
    referenceValue: 'Standard MET = 3.5 mL O₂/kg/min',
    measuredOrProxy: 'measured_activity',
    limitations: 'Population averages; individual EE varies.',
    lastVerified: '2026-11-01',
  },
  {
    id: 'acsm-ee',
    name: 'ACSM energy expenditure guidance',
    url: 'https://www.acsm.org/',
    activityClassification: 'kcal ≈ MET × 3.5 × kg / 200 × minutes',
    referenceValue: 'Gross EE formula; net ≈ (MET−1) when TDEE includes RMR',
    measuredOrProxy: 'category_proxy',
    limitations: 'Assumes 1 MET ≈ 3.5 mL/kg/min; not individualized VO₂.',
    lastVerified: '2026-11-01',
  },
];
