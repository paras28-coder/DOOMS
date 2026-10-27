import { Category, Priority, Decision, DecisionOption, ComparisonRow } from '../types.js';

export interface RecommendationParams {
  question: string;
  category: Category;
  priority: Priority;
  preferences: string[];
  additionalDetails?: string;
}

/**
 * Rule-based fallback used by the server when Gemini is not configured or unavailable.
 * Its product facts are examples and should not be treated as live research.
 */
export async function generateRecommendation(params: RecommendationParams): Promise<Decision> {
  // Simulate AI evaluation time for a futuristic feel
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const { question, category, priority, preferences, additionalDetails } = params;
  const qLower = question.toLowerCase();

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  // Determine suitability score (between 8.4 and 9.6)
  const baseScore = 8.5;
  const prefBonus = Math.min(preferences.length * 0.2, 0.8);
  const suitabilityScore = Number((baseScore + prefBonus + (priority === 'Highest Quality' ? 0.3 : 0.1)).toFixed(1));

  let recommendedOption: DecisionOption;
  let alternatives: DecisionOption[];
  let whyRecommended: string;
  let pros: string[];
  let cons: string[];
  let comparison: ComparisonRow[];

  // Smart context matching based on category & question keywords
  if (category === 'Shopping' && (qLower.includes('laptop') || qLower.includes('computer') || qLower.includes('macbook'))) {
    recommendedOption = {
      id: 'opt-rec',
      title: 'ASUS Vivobook 15 OLED',
      subtitle: 'Premium OLED Display & Performance',
      price: '₹54,990',
      rating: 4.6,
      reviewsCount: 1420,
      badge: 'Best Choice',
      isRecommended: true,
      specs: [
        'Intel Core i5 12th Gen (10 cores, 12 threads)',
        '16GB DDR4 RAM, 512GB PCIe 4.0 SSD',
        '15.6" Full HD OLED with 100% DCI-P3 color gamut',
        'Long battery life with fast 65W Type-C charge',
        'Antimicrobial guard and backlit numeric keypad',
      ],
      pros: ['Vivid OLED display with deep blacks', 'Smooth multi-tasking with 16GB RAM', 'Lightweight 1.7kg chassis'],
      cons: ['Glossy screen has reflections in direct sunlight', 'Average webcam in low light'],
    };

    alternatives = [
      {
        id: 'opt-alt-1',
        title: 'Lenovo IdeaPad Slim 3',
        subtitle: 'Everyday Reliable Performer',
        price: '₹52,990',
        rating: 4.3,
        reviewsCount: 980,
        badge: 'Budget Pick',
        specs: [
          'AMD Ryzen 5 7520U processor',
          '16GB LPDDR5 RAM, 512GB SSD',
          '14" FHD IPS Anti-Glare',
          'Ultralight 1.43kg profile',
          'Rapid Charge battery technology',
        ],
        pros: ['Compact & portable', 'Great matte display'],
        cons: ['Slightly slower integrated graphics'],
      },
      {
        id: 'opt-alt-2',
        title: 'HP Pavilion 15',
        subtitle: 'Entertainment & Build',
        price: '₹58,990',
        rating: 4.4,
        reviewsCount: 1120,
        badge: 'Alternative',
        specs: [
          'Intel Core i5 12th Gen',
          '16GB RAM, 512GB SSD',
          'B&O Dual Audio speakers',
          'Micro-edge bezel screen',
        ],
        pros: ['Superior built-in speakers', 'All-metal keyboard deck'],
        cons: ['Slightly higher price point'],
      },
    ];

    whyRecommended =
      `Based on your priority of ${priority} and preferences (${preferences.join(', ') || 'value & quality'}), the ASUS Vivobook offers the best performance-to-cost ratio, stunning display quality, and hardware headroom for years to come.`;

    pros = [
      'Top-tier value for processing speed and memory',
      'Excellent screen for both coding and entertainment',
      'Solid thermal management under sustained load',
    ];

    cons = [
      'Standard 720p webcam requires decent room lighting',
      'Plastic base casing, though structural rigidity is high',
    ];

    comparison = [
      { attribute: 'Processor & RAM', recommended: 'Intel i5-12th + 16GB RAM', alt1: 'Ryzen 5-7520U + 16GB RAM', alt2: 'Intel i5-12th + 16GB RAM' },
      { attribute: 'Display Tech', recommended: '15.6" FHD OLED (100% DCI-P3)', alt1: '14" FHD IPS Matte', alt2: '15.6" FHD IPS Micro-edge' },
      { attribute: 'Battery Life', recommended: '7.5 Hours (65W Fast Charge)', alt1: '6.5 Hours (Rapid Charge)', alt2: '7 Hours (HP Fast Charge)' },
      { attribute: 'Value Index', recommended: '9.4/10 (Highest Value)', alt1: '8.8/10', alt2: '8.6/10' },
    ];
  } else if (category === 'Education' || qLower.includes('degree') || qLower.includes('course') || qLower.includes('college')) {
    recommendedOption = {
      id: 'opt-rec',
      title: 'Accelerated Degree with Specialized AI/Tech Focus',
      subtitle: 'Future-Proof Curriculum & Portfolio',
      price: 'Standard Academic Tuition',
      rating: 4.8,
      reviewsCount: 890,
      badge: 'Best Choice',
      isRecommended: true,
      specs: [
        'Hands-on project work over pure theoretical memorization',
        'Direct alignment with industry demand in AI, Cloud, and Software',
        'Built-in internship pipeline and capstone development',
        'Mentorship access from active industry professionals',
      ],
      pros: ['Immediate employability after graduation', 'Strong alumni network in tech companies'],
      cons: ['Demands consistent weekly coding sprints'],
    };

    alternatives = [
      {
        id: 'opt-alt-1',
        title: 'Traditional Broad Computing Degree',
        subtitle: 'General Computer Science / IT',
        price: 'Comparable Tuition',
        rating: 4.4,
        reviewsCount: 1650,
        badge: 'Traditional Path',
        specs: ['Broad coverage of OS, hardware, and algorithms', 'Widest eligibility for public examinations'],
        pros: ['Very wide foundation', 'Standard textbook syllabus'],
        cons: ['Requires independent upskilling for modern AI roles'],
      },
      {
        id: 'opt-alt-2',
        title: 'Industry Bootcamps + Direct Certifications',
        subtitle: 'Fast-Track 6 to 9 Months',
        price: 'Low to Medium Tuition',
        rating: 4.2,
        reviewsCount: 780,
        badge: 'Fast Track',
        specs: ['100% practical coding assignments', 'Direct job portal access', 'No 3-4 year degree commitment'],
        pros: ['Fastest path to entry-level software job'],
        cons: ['Lacks formal university degree credentials for visa/MNCs'],
      },
    ];

    whyRecommended =
      `Given your focus on ${priority}, choosing a specialized curriculum maximizes high-paying career trajectories while keeping your foundational learning modern and relevant.`;

    pros = [
      'High growth potential with emerging AI & Cloud architectures',
      'Strong portfolio of public projects created during coursework',
    ];

    cons = [
      'Requires proactive self-study and continuous curiosity',
    ];

    comparison = [
      { attribute: 'Curriculum Relevance', recommended: 'Modern & AI-first (Updated 2025)', alt1: 'Traditional (5-year review cycle)', alt2: 'Practical industry skills only' },
      { attribute: 'Degree Recognition', recommended: 'Full Accredited Bachelor Degree', alt1: 'Full Accredited Bachelor Degree', alt2: 'Professional Certificate' },
      { attribute: 'Time Commitment', recommended: '3 - 4 Years', alt1: '3 - 4 Years', alt2: '6 - 9 Months' },
      { attribute: 'Placement Momentum', recommended: 'High in Tech & Startups', alt1: 'Broad / General MNCs', alt2: 'Junior roles & Freelance' },
    ];
  } else if (category === 'Career' || qLower.includes('job') || qLower.includes('offer') || qLower.includes('company')) {
    recommendedOption = {
      id: 'opt-rec',
      title: 'High-Growth Tech Scale-Up Role',
      subtitle: 'Maximum Ownership & Accelerated Learning',
      price: 'Competitive Equity + Base',
      rating: 4.7,
      reviewsCount: 540,
      badge: 'Best Choice',
      isRecommended: true,
      specs: [
        'Direct reporting to senior leaders with high visibility',
        'End-to-end product feature ownership',
        'High skill velocity (learn in 1 year what takes 3 elsewhere)',
        'Flexible hybrid work structure',
      ],
      pros: ['Rapid promotion trajectory', 'Substantial autonomy and impact'],
      cons: ['Faster pace and less rigid departmental boundaries'],
    };

    alternatives = [
      {
        id: 'opt-alt-1',
        title: 'Established Tier-1 Corporation',
        subtitle: 'Stability & Structured Processes',
        price: 'High Fixed Base Salary',
        rating: 4.3,
        reviewsCount: 2400,
        badge: 'Stable Pick',
        specs: ['Established brand name on CV', 'Comprehensive health & insurance perks', 'Clear 9-to-5 work boundaries'],
        pros: ['Great job security and structured training'],
        cons: ['Slower promotions and limited scope of responsibility'],
      },
      {
        id: 'opt-alt-2',
        title: 'Freelance & Independent Consulting',
        subtitle: '100% Autonomy & Flexible Schedule',
        price: 'Variable Hourly / Retainer',
        rating: 4.1,
        reviewsCount: 390,
        badge: 'Independent',
        specs: ['Full location freedom', 'Direct client billing and negotiation', 'Diversified income streams'],
        pros: ['Maximum personal freedom'],
        cons: ['Income fluctuation and self-managed healthcare/taxes'],
      },
    ];

    whyRecommended =
      `Based on ${priority} and your stated preferences, the high-growth scale-up offers the ideal multiplier for career equity, fast learning curves, and market relevance.`;

    pros = ['Exceptional skill compounding', 'Direct portfolio impact on real users'];
    cons = ['Requires comfort with ambiguity and changing priorities'];

    comparison = [
      { attribute: 'Skill Growth Speed', recommended: 'Very High (10/10)', alt1: 'Moderate (6/10)', alt2: 'High (8/10)' },
      { attribute: 'Brand & Stability', recommended: 'Series B/C Funded Stability', alt1: 'Blue-chip Enterprise', alt2: 'Self-employed' },
      { attribute: 'Work Flexibility', recommended: 'Hybrid & Results-Oriented', alt1: 'Strict Office Policy', alt2: '100% Remote / Any Time' },
      { attribute: 'Long-term Upside', recommended: 'High (Equity & Fast Track)', alt1: 'Predictable Annual Increments', alt2: 'Tied to billable hours' },
    ];
  } else if (category === 'Finance' || qLower.includes('invest') || qLower.includes('save') || qLower.includes('car') || qLower.includes('buy')) {
    recommendedOption = {
      id: 'opt-rec',
      title: 'Automated Broad-Market Index Fund Strategy',
      subtitle: 'Low-Cost Passive Compound Wealth',
      price: '0.05% - 0.15% Expense Ratio',
      rating: 4.9,
      reviewsCount: 3200,
      badge: 'Best Choice',
      isRecommended: true,
      specs: [
        'Diversified across top 50-500 market leading enterprises',
        'Automatic monthly SIP / DCA without emotional timing',
        'Historical 12-14% annualized long-term return rate',
        'Zero locked-in exit penalties after 1 year',
      ],
      pros: ['Beats 85%+ of actively managed funds over 10 years', 'Zero daily screen-watching stress'],
      cons: ['Subject to general macroeconomic cycles in the short term'],
    };

    alternatives = [
      {
        id: 'opt-alt-1',
        title: 'High-Yield Fixed Deposit / Debt Funds',
        subtitle: 'Guaranteed Capital Preservation',
        price: '7.0% - 7.5% Annual Yield',
        rating: 4.2,
        reviewsCount: 1900,
        badge: 'Conservative',
        specs: ['Guaranteed returns by insured banking regulations', 'Ideal for emergency fund storage'],
        pros: ['Zero risk of nominal capital loss'],
        cons: ['Barely keeps up with real-world inflation and post-tax drag'],
      },
      {
        id: 'opt-alt-2',
        title: 'Active Direct Equity Stock Picking',
        subtitle: 'High Risk, High Reward Speculation',
        price: 'Zero Commission Brokerage',
        rating: 3.8,
        reviewsCount: 1100,
        badge: 'High Risk',
        specs: ['Individual company stock research', 'Potential for multi-bagger breakout gains'],
        pros: ['Excitement and direct ownership in favorite companies'],
        cons: ['Significant drawdown risk and heavy research time commitment'],
      },
    ];

    whyRecommended =
      `Prioritizing ${priority} means avoiding speculation. Index investing provides the mathematical best risk-adjusted path to sustainable financial compounding.`;

    pros = ['Proven track record over 50+ years of financial history', 'Hands-off peace of mind'];
    cons = ['Requires patience and at least 3-5 years investment horizon'];

    comparison = [
      { attribute: 'Expected Return', recommended: '12% - 14% CAGR (Historical)', alt1: '7% - 7.5% Fixed', alt2: 'Volatile (-20% to +35%)' },
      { attribute: 'Time & Effort', recommended: '5 minutes / month (Automated)', alt1: 'One-time setup', alt2: '10+ hours / week active analysis' },
      { attribute: 'Risk Level', recommended: 'Moderate Market Risk', alt1: 'Extremely Low', alt2: 'High Capital Volatility' },
      { attribute: 'Inflation Hedge', recommended: 'Strong (Overcomes inflation)', alt1: 'Weak (Flattens with CPI)', alt2: 'Variable' },
    ];
  } else {
    // Dynamic universal decision recommendation based on question & priority
    const cleanSubject = question.replace(/^(should i|what is|which|how should i|can i)\s+/i, '').replace(/\?$/, '');
    const capitalizedSubject = cleanSubject.charAt(0).toUpperCase() + cleanSubject.slice(1);

    recommendedOption = {
      id: 'opt-rec',
      title: `Optimized Choice: ${capitalizedSubject.slice(0, 32)}...`,
      subtitle: `Balanced for ${priority} & Longevity`,
      price: priority === 'Lowest Price' ? 'Low Cost Tier' : 'Optimal Value Tier',
      rating: 4.7,
      reviewsCount: 860,
      badge: 'Best Choice',
      isRecommended: true,
      specs: [
        `Directly aligns with your priority of "${priority}"`,
        `Satisfies ${preferences.length > 0 ? preferences.join(', ') : 'practical usability & reliability'}`,
        'Proven user satisfaction and durable long-term outcome',
        'Low switching cost if requirements evolve in future',
      ],
      pros: [
        'Highest suitability score among compared options',
        'Minimal downside risk with maximum flexibility',
        'Clear next steps for immediate execution',
      ],
      cons: [
        'Requires clear initial setup and commitment',
        'May not suit extreme edge cases outside primary criteria',
      ],
    };

    alternatives = [
      {
        id: 'opt-alt-1',
        title: 'Alternative Approach: High-End Premium',
        subtitle: 'Maximum Features & Longevity',
        price: 'Premium Tier',
        rating: 4.4,
        reviewsCount: 520,
        badge: 'Premium Pick',
        specs: [
          'All luxury and advanced capabilities included',
          'Higher initial resource investment',
          'Extensive support and brand guarantees',
        ],
        pros: ['Top-of-the-line specifications and prestige'],
        cons: ['Significantly higher cost with diminishing marginal return'],
      },
      {
        id: 'opt-alt-2',
        title: 'Alternative Approach: Lean & Agile',
        subtitle: 'Minimum Viable Commitment',
        price: 'Budget Tier',
        rating: 4.2,
        reviewsCount: 410,
        badge: 'Budget Pick',
        specs: [
          'Focuses strictly on essential core requirements',
          'Fastest turnaround time and minimal financial exposure',
          'Easy to test for a trial period before committing further',
        ],
        pros: ['Low risk test-drive with minimal investment'],
        cons: ['May require upgrading sooner as demands increase'],
      },
    ];

    whyRecommended =
      `After assessing your question "${question}" with priority on ${priority}${additionalDetails ? ` and notes (${additionalDetails})` : ''}, this option provides the most dependable, stress-free balance between upfront investment, execution ease, and high reward.`;

    pros = [
      'Addresses your primary bottleneck directly',
      'Provides high confidence without unnecessary overhead',
    ];

    cons = [
      'Requires consistent follow-through on recommended steps',
    ];

    comparison = [
      { attribute: 'Alignment with Goals', recommended: 'Direct Match (9.2/10)', alt1: 'Over-engineered (8.0/10)', alt2: 'Minimal Baseline (7.4/10)' },
      { attribute: 'Resource Requirement', recommended: 'Balanced & Manageable', alt1: 'High Resource Investment', alt2: 'Lowest Upfront Cost' },
      { attribute: 'Ease of Execution', recommended: 'Straightforward & Proven', alt1: 'Steep Learning Curve', alt2: 'Instant / Basic' },
      { attribute: 'Risk Level', recommended: 'Low to Moderate', alt1: 'Moderate (Capital Risk)', alt2: 'Moderate (Re-do Risk)' },
    ];
  }

  return {
    id: `dec-${Date.now()}`,
    question,
    category,
    priority,
    preferences,
    additionalDetails,
    createdAt: formattedDate,
    suitabilityScore,
    suitabilitySummary: `Calculated based on your selection of ${priority} and ${preferences.length} key preference factors.`,
    recommendedOption,
    alternatives,
    pros,
    cons,
    whyRecommended,
    comparison,
    isSaved: false,
  };
}
