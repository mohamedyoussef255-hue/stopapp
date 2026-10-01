import { AIAssessmentResult, Severity } from '../types';

interface HazardKeywordRule {
  keywords: string[];
  severity: Severity;
  scoreRange: [number, number];
  hazardType: string;
  standardRef: string;
  potentialConsequences: string;
  recommendedAction: string;
  hierarchy: 'Elimination' | 'Substitution' | 'Engineering' | 'Administrative' | 'PPE';
}

const HAZARD_RULES: HazardKeywordRule[] = [
  {
    keywords: [
      'high voltage', 'live wire', 'exposed wire', 'sparking', 'electric shock',
      'arc flash', 'substation', 'uninsulated', 'cable severed', 'water near electrical'
    ],
    severity: 'critical',
    scoreRange: [88, 98],
    hazardType: 'High-Voltage Electrical Hazard',
    standardRef: 'OSHA 1910.303 / NFPA 70E Arc Flash Standard',
    potentialConsequences: 'Catastrophic electrical arc flash, severe third-degree burns, ventricular fibrillation, or secondary structural ignition.',
    recommendedAction: 'Immediate emergency de-energization via LOTO (Lockout/Tagout). Cordon off a 15-meter flash boundary. Dispatch authorized certified electrician.',
    hierarchy: 'Elimination'
  },
  {
    keywords: [
      'gas leak', 'gas smell', 'toxic', 'ammonia', 'hydrogen sulfide', 'confined space',
      'oxygen depleted', 'asphyxiation', 'chemical spill', 'flammable vapor', 'explosion risk'
    ],
    severity: 'critical',
    scoreRange: [90, 99],
    hazardType: 'Hazardous Chemical / Gas Release',
    standardRef: 'OSHA 1910.1200 / OSHA 1910.146 Confined Spaces',
    potentialConsequences: 'Acute respiratory collapse, chemical inhalation poisoning, explosive vapor ignition, or mass worker intoxication.',
    recommendedAction: 'Sound zone evacuation alarm. Turn off gas main valve. Deploy Hazmat containment response team with self-contained breathing apparatus (SCBA).',
    hierarchy: 'Elimination'
  },
  {
    keywords: [
      'scaffolding unstable', 'missing guardrail', 'fall from height', 'no harness',
      'deep excavation', 'trench collapse', 'suspended load', 'crane cable fraying'
    ],
    severity: 'high',
    scoreRange: [75, 87],
    hazardType: 'Fall from Elevation / Structural Collapse',
    standardRef: 'OSHA 1926.501 Fall Protection / OSHA 1926.651 Excavations',
    potentialConsequences: 'Severe traumatic blunt-force trauma, spinal injuries, or fatal burial under trench wall failure.',
    recommendedAction: 'Halt all work at elevated platform immediately. Tag scaffold as "DO NOT USE - RED OUT OF SERVICE". Install certified toe-boards and perimeter guardrails.',
    hierarchy: 'Engineering'
  },
  {
    keywords: [
      'forklift speeding', 'blind corner', 'pedestrian walkway', 'heavy machinery',
      'reversing beeper broken', 'crush hazard', 'pinch point', 'conveyor belt guard'
    ],
    severity: 'high',
    scoreRange: [70, 84],
    hazardType: 'Struck-By Mobile Plant / Mechanical Pinch Hazard',
    standardRef: 'OSHA 1910.178 Powered Industrial Trucks / ISO 12100',
    potentialConsequences: 'High-energy pedestrian impact, bone crush injuries, amputation, or entrapment in rotating mechanical shaft.',
    recommendedAction: 'Mandate immediate physical bollard barrier separation. Test forklift audible reverse alarms and speed limiters. Restrict forklift zone access.',
    hierarchy: 'Engineering'
  },
  {
    keywords: [
      'oil spill', 'slick floor', 'water puddle', 'hydraulic leak', 'grease',
      'liquid on stairs', 'slippery ramp'
    ],
    severity: 'medium',
    scoreRange: [50, 68],
    hazardType: 'Slip & Fluid Discharge Hazard',
    standardRef: 'OSHA 1910.22 Walking-Working Surfaces',
    potentialConsequences: 'Loss of traction resulting in slips, falls onto hard concrete, joint sprains, or concussion.',
    recommendedAction: 'Deploy absorbent spill-kit socks immediately. Post bilingual warning caution cones. Trace hydraulic fluid line origin to seal leak.',
    hierarchy: 'Administrative'
  },
  {
    keywords: [
      'trip hazard', 'loose cable', 'cluttered walkway', 'blocked fire exit',
      'extinguisher blocked', 'poor lighting', 'broken lamp', 'loose handrail', 'defective ladder'
    ],
    severity: 'medium',
    scoreRange: [42, 60],
    hazardType: 'Housekeeping & Egress Obstruction',
    standardRef: 'OSHA 1910.36 Emergency Exit Routes / ISO 45001 Clause 8.1',
    potentialConsequences: 'Impeded rapid egress during emergency evacuation, secondary trip impact on metal edges, or inability to access firefighting equipment.',
    recommendedAction: 'Clear emergency pathway within 30 minutes. Secure loose trailing cables using heavy-duty rubber floor channels. Replace damaged ladder.',
    hierarchy: 'Administrative'
  },
  {
    keywords: [
      'worn glove', 'scratched visor', 'safety glasses missing', 'earplugs',
      'faded floor paint', 'label peeling', 'minor trash', 'loose cabinet latch', 'noisy vent'
    ],
    severity: 'low',
    scoreRange: [20, 39],
    hazardType: 'Minor PPE Degradation & Routine Housekeeping',
    standardRef: 'OSHA 1910.132 Personal Protective Equipment',
    potentialConsequences: 'Minor superficial abrasion, gradual hearing fatigue, or low-level occupational dust discomfort.',
    recommendedAction: 'Swap out worn PPE at tool crib. Log work order with facilities team to repaint designated walkway striping during scheduled shift turnover.',
    hierarchy: 'PPE'
  }
];

export function assessRiskSeverity(text: string, category: string = ''): AIAssessmentResult {
  const normalized = (text + ' ' + category).toLowerCase();

  // Search for matching rules
  let matchedRule: HazardKeywordRule | null = null;
  let highestSeverityRank = -1;

  const severityRankMap: Record<Severity, number> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4
  };

  for (const rule of HAZARD_RULES) {
    for (const kw of rule.keywords) {
      if (normalized.includes(kw)) {
        const rank = severityRankMap[rule.severity];
        if (rank > highestSeverityRank) {
          highestSeverityRank = rank;
          matchedRule = rule;
        }
      }
    }
  }

  // Fallback heuristic if no specific keywords matched
  if (!matchedRule) {
    const textLength = text.trim().length;
    let fallbackSeverity: Severity = 'low';
    let baseScore = 32;

    if (normalized.includes('danger') || normalized.includes('urgent') || normalized.includes('severe') || normalized.includes('smoke')) {
      fallbackSeverity = 'high';
      baseScore = 78;
    } else if (normalized.includes('hazard') || normalized.includes('broken') || normalized.includes('leak') || normalized.includes('crack')) {
      fallbackSeverity = 'medium';
      baseScore = 55;
    } else if (textLength > 60) {
      fallbackSeverity = 'medium';
      baseScore = 48;
    }

    return {
      severity: fallbackSeverity,
      score: baseScore,
      hazardType: category ? `${category} Observation` : 'General Industrial Safety Hazard',
      standardRef: 'OSHA 1910 General Industry Clause / ISO 45001',
      potentialConsequences: fallbackSeverity === 'high' 
        ? 'Heightened risk of injury or localized equipment damage requiring immediate work pause.'
        : 'Potential for cumulative ergonomic or minor workplace safety incident if left unaddressed.',
      recommendedAction: fallbackSeverity === 'high'
        ? 'Dispatch area safety officer for immediate on-site verification and barrier placement.'
        : 'Log routine preventive work order and review during shift toolbox talk.',
      hierarchyOfControl: fallbackSeverity === 'high' ? 'Engineering' : 'Administrative',
      confidenceScore: 84,
      analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  // Generate slightly randomized deterministic score within rule range
  const [minScore, maxScore] = matchedRule.scoreRange;
  const computedScore = Math.floor(minScore + ((text.length * 7) % (maxScore - minScore + 1)));

  return {
    severity: matchedRule.severity,
    score: computedScore,
    hazardType: matchedRule.hazardType,
    standardRef: matchedRule.standardRef,
    potentialConsequences: matchedRule.potentialConsequences,
    recommendedAction: matchedRule.recommendedAction,
    hierarchyOfControl: matchedRule.hierarchy,
    confidenceScore: 94 + (text.length % 5),
    analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
