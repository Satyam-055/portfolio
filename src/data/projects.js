const projects = [
  {
    id: 'design-system',
    title: 'Boring is Safe',
    tags: ['Design System', 'Tokens', 'Wealthtech'],
    previewColor: '#E5EAFC',
    previewType: 'cards',
    role: 'Sole Designer',
    timeline: 'Ongoing',
    platform: 'Web, Tablet, Mobile',
    team: ['Engineering', 'Designer'],
    description:
      'A design system for Alphanso, a wealthtech platform serving people tracking $250k+ portfolios. One belief: in fintech, boring is safe.',
    caseStudy: {
      tldr:
        "Built a design system for users tracking $250k+ portfolios around one belief: in fintech, boring is safe. Restraint, familiar patterns, generous space, clarity over cleverness — across 14 component families, a wealth-management vocabulary, and a 13-chart data viz library. Mockup time dropped from 1–2 days to half a day.",
      overview:
        "Six months in, I had eleven different button paddings shipped to production. Twelve, if you counted the one I shipped that morning.",
      challenge: [
        "I was the only designer on the product, and there was no design system. Every new screen got built by copy-pasting from the last one. By the time we'd shipped six core flows, no two buttons matched, no two tables had the same density, no two headings used the same scale.",
        "For a SaaS tool, that's a quality issue. For a product where users were tracking portfolios of $250,000 or more, it's a trust issue.",
        "People moving real money look for tells. A misaligned number, an inconsistent button, a dashboard that scrolls differently on mobile than on desktop — each one is a small reason to wonder if the rest of the product is held together with tape. Inconsistency was going to lose us users before features ever did. So I stopped shipping screens, blocked time, and built the system.",
      ],
      competitorIntro:
        "In fintech, what's familiar feels safe. If a transfer flow doesn't work like the user's bank, they get nervous before they trust it. So instead of inventing, I studied — five competitors covering planning, investing, and full-service wealth management.",
      competitorMatrix: [
        { competitor: 'Wealthsimple', learning: 'Theme-based investment buckets', logo: 'https://logo.clearbit.com/wealthsimple.com' },
        { competitor: 'Origin', learning: 'Planning-led approach', logo: 'https://logo.clearbit.com/useorigin.com' },
        { competitor: 'Facet', learning: 'Onboarding flow + pricing transparency', logo: 'https://logo.clearbit.com/facet.com' },
        { competitor: 'Range', learning: 'Planning approach + flat-fee positioning', logo: 'https://logo.clearbit.com/range.com' },
        { competitor: 'Titan', learning: 'Niche, tech-focused audience', logo: 'https://logo.clearbit.com/titan.com' },
      ],
      doctrineIntro:
        "I committed to one belief: boring is safe. People moving real money want familiar, calm, and clear. They don't want to be impressed by gradients. They want to find their numbers and trust them. That belief turned into four rules — every component decision had to follow at least one.",
      doctrine: [
        {
          title: 'Quiet, not loud',
          body:
            'Every visual choice should mean something. No decoration, no gradients, no shadows that pop. Color is reserved for signal.',
          icon: '/case-studies/design-system/rules/quiet.png',
        },
        {
          title: 'Familiar, not new',
          body:
            "Use what people already know. If the rest of the category does something a particular way, do it that way too — unless there's a real reason not to.",
          icon: '/case-studies/design-system/rules/familiar.png',
        },
        {
          title: 'Roomy, not cramped',
          body:
            'Whitespace is breathing room. Breathing room is trust. Generous padding around money matters.',
          icon: '/case-studies/design-system/rules/roomy.png',
        },
        {
          title: 'Clear, not clever',
          body:
            'Never make the user wonder if something happened. Tabular figures, explicit labels, inline validation, modal confirmations for big actions.',
          icon: '/case-studies/design-system/rules/clear.png',
        },
      ],
      foundationsIntro: 'The token system stays small on purpose.',
      foundations: [
        {
          title: 'Color',
          body:
            'Eleven-step grayscale. Borderline Blue as the only brand accent. Semantic red for losses, green for gains. A defined data-viz palette beyond that. Chromatic colors carry category meaning — never decoration.',
          colorGroups: [
            {
              label: 'Brand & semantic',
              items: [
                { label: 'Borderline Blue 800', color: '#2E53E3' },
                { label: 'Red 800', color: '#EA3829' },
                { label: 'Green 800', color: '#008F5D' },
              ],
            },
            {
              label: 'Grayscale',
              items: [
                { label: 'gray-50', color: '#FFFFFF' },
                { label: 'gray-100', color: '#F8F8F8' },
                { label: 'gray-200', color: '#E6E6E6' },
                { label: 'gray-300', color: '#D5D5D5' },
                { label: 'gray-400', color: '#B1B1B1' },
                { label: 'gray-500', color: '#909090' },
                { label: 'gray-600', color: '#6D6D6D' },
                { label: 'gray-700', color: '#464646' },
                { label: 'gray-800', color: '#222222' },
                { label: 'gray-900', color: '#000000' },
              ],
            },
            {
              label: 'Data viz',
              items: [
                { label: 'sea-green', color: '#0FB5AE' },
                { label: 'palatinate-blue', color: '#4046CA' },
                { label: 'tangerine', color: '#F68511' },
                { label: 'magenta', color: '#DE3D82' },
              ],
            },
          ],
        },
        {
          title: 'Spacing',
          body:
            'XXS to XXXL on an 8pt grid, with 4 / 12 micro-steps where 8 felt off. Each size has a documented usage note.',
          sizeChips: ['XXS', 'XS', 'S', 'SM', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        },
        {
          title: 'Radius',
          body: 'Three values. No pill buttons, no sharp corners.',
          sizeChips: ['4', '8', '12'],
        },
        {
          title: 'Type',
          body:
            'Work Sans for headings, Inter for body and detail. Two families, four weights, a shared size scale. Numbers use tabular figures so columns line up.',
          typeSamples: [
            { family: 'Work Sans', usage: 'Headings' },
            { family: 'Inter', usage: 'Body & detail' },
          ],
          namingHint: 'Heading / Serif / Light / xxxl-light  →  Body / Regular / m-regular',
        },
        {
          title: 'Shadow',
          body: 'One subtle drop shadow. Used sparingly — only when elevation carries meaning.',
          shadowDemo: true,
        },
        {
          title: 'Token architecture',
          body:
            'Tokens are named hierarchically — broadest category first, then subgroup, then state or scale. Same pattern across color, spacing, type, motion. Reading a token name tells you where it lives and what it does.',
          tokenExamples: [
            'color / surface / hover',
            'color / text / primary',
            'data-visualization / sea-green',
            'radius / l',
            'semantic / spacing-m',
            'light / gray / gray-700',
          ],
        },
      ],
      systemIntro:
        'The system covers fourteen component families, all built around the four rules.',
      systemOverview: {
        src: '/case-studies/design-system/system-overview.png',
        alt: 'Alphanso design system overview — full canvas',
        caption: 'A slice of the canvas: tokens, components, and patterns laid out together.',
        wide: true,
      },
      componentCategories: [
        {
          id: 'charts',
          label: 'Charts',
          description:
            'Restraint as the feature. Thirteen chart types, six color tokens, no decoration. One definition resizes from a 200px sparkline to a full-screen detail view.',
          items: [
            { name: 'Portfolio Allocation', body: 'Donut for asset-class breakdown.', src: '/case-studies/design-system/portfolio-allocation.png' },
            { name: 'Line Chart', body: 'Time-series with positive / negative variants.', src: '/case-studies/design-system/line-chart.png' },
            { name: 'Stacked Bar', body: 'Multi-series comparison over time.', src: '/case-studies/design-system/stacked-bar.png' },
            { name: 'Sankey', body: 'Income vs expense flow.', src: '/case-studies/design-system/sankey.png' },
            { name: 'Big Number', body: 'KPI tile with sparkline or delta.', src: '/case-studies/design-system/big-number.png' },
            { name: 'Donut Chart', body: 'Categorical breakdown.', src: '/case-studies/design-system/donut-chart.png' },
            { name: 'Donut — variant', body: 'Alternate donut treatment for sub-views.', src: '/case-studies/design-system/donut-chart-2.png' },
            { name: 'Fundamentals Radar', body: 'Multi-dimensional company snapshot.', src: '/case-studies/design-system/fundamentals-radar.png' },
            { name: 'EPS Performance', body: 'Earnings-per-share trend with reminders.', src: '/case-studies/design-system/eps-performance.png' },
            { name: 'Price Ticker', body: 'Real-time price change card.', src: '/case-studies/design-system/price-ticker.png' },
          ],
        },
        {
          id: 'tables',
          label: 'Tables',
          description: 'Built atomically. Atoms (cells), molecules (rows), components (full tables). Right-aligned tabular numbers. Color only as gain / loss signal.',
          items: [
            { name: 'Table', body: 'Atoms, molecules, and full component layouts in one canvas.', src: '/case-studies/design-system/table.png', wide: true },
          ],
        },
        {
          id: 'inputs',
          label: 'Inputs',
          description:
            'Generous padding, labels above the field, errors as you type. Five state machines, consistent across types.',
          items: [
            { name: 'Checkbox', body: 'Five states × five styles, including error variants.', src: '/case-studies/design-system/checkbox.png' },
            { name: 'Switch', body: 'Toggle for binary settings.', src: '/case-studies/design-system/switch.png' },
            { name: 'Radio button', body: 'Single-select from a small set.', src: '/case-studies/design-system/radio-button.png' },
            { name: 'Slider', body: 'Continuous value, primary and secondary types.', src: '/case-studies/design-system/slider.png' },
            { name: 'Chips', body: 'Filter and selection chips.', src: '/case-studies/design-system/chips.png' },
            { name: 'Tabs', body: 'Primary, secondary, draft variants in two sizes.', src: '/case-studies/design-system/tabs.png' },
          ],
        },
        {
          id: 'buttons',
          label: 'Buttons',
          description:
            'One accent color, no gradients, soft corners. Five sizes × five states across primary, destructive, accent, icon, outlined.',
          items: [
            { name: 'Button', body: '~200 variants — every size, state, and type covered.', src: '/case-studies/design-system/button.png', wide: true },
            { name: 'Action button', body: 'Standard, emphasized, and quiet variants for icon+label compositions.', src: '/case-studies/design-system/action-button.png', wide: true },
          ],
        },
        {
          id: 'navigation',
          label: 'Navigation',
          description:
            'Predictable, persistent. Left panel and rail variants for desktop, with expand / contract states. Built for users who land at the same dashboard every morning.',
          items: [
            { name: 'Left panel', body: 'Desktop left-panel + collapsed rail with hover and selected states.', src: '/case-studies/design-system/navigation.png', wide: true },
          ],
        },
        {
          id: 'feedback',
          label: 'Feedback',
          description:
            "Modals for big actions, toasts for small confirmations, inline alerts when context matters. Never make the user wonder if something happened.",
          items: [
            { name: 'Pop-up', body: 'Modal dialogs for high-stakes actions.', src: '/case-studies/design-system/pop-up.png' },
            { name: 'Alert banner', body: 'Six types: notification, broken link, doc request, slight notice, confirmation, sync.', src: '/case-studies/design-system/alert-banner.png', wide: true },
            { name: 'Toast', body: 'Neutral, positive, informative, negative — with CTA hover and max-width states.', src: '/case-studies/design-system/toast.png' },
          ],
        },
        {
          id: 'labels',
          label: 'Labels',
          description: 'The wealthtech vocabulary. The most uniquely wealthtech part of the system.',
          body:
            'Generic design systems give you buttons and chips. Wealth management needs vocabulary. Labels is organized by domain — Investment service (Balance, Preserve, Income, Wealth), Goal planning (Retirement, Home, Education, Emergency, Health, Car, Wedding, Vacation), Financial wellness, Tax support, Estate planning, plus sync states. Each label has its own icon and category color. No off-the-shelf DS has this layer because no off-the-shelf product needs it — and shipping new flows became as simple as picking from the vocabulary.',
          items: [],
        },
      ],
      agentsIntro:
        "A system maintained by one person stays consistent only if it can review itself. As the surface area grew, I built a layer of agents on top of the DS — each one a Claude Code skill that operates on the Figma file directly:",
      agents: [
        { name: 'ads-builder', body: 'Composes new screens from existing components — drop a brief, get a layout assembled with the right tokens and slots.' },
        { name: 'ads-linter', body: 'Audits Figma components against the system: token bindings, theme compliance, layer naming, missing states. Generates structured component descriptions.' },
        { name: 'ads-migrator', body: 'Ports old components to the new agent-optimized library following a 5-step workflow — read, analyze, propose, build, verify.' },
        { name: 'ux-copy', body: 'Writes button labels, errors, tooltips, microcopy that match the platform voice — reads text layers from Figma directly when needed.' },
        { name: 'grid-resize', body: 'Applies the responsive grid across breakpoints. Encodes the full spec — five breakpoints, column counts, panel splits, widget sizing.' },
      ],
      agentsClose:
        "The DS isn't just a Figma file anymore. It's a system that audits, drafts, and migrates itself. I'm still the designer making the calls — the agents handle the parts that used to eat my afternoon.",
      stats: [
        { value: '1–2d → ½d', label: 'Mockup time' },
        { value: '14', label: 'Component families' },
        { value: '~100', label: 'Type styles' },
      ],
      results:
        'The most concrete outcome was speed. Screen mockups that used to take 1–2 days started landing in half a day. Design review turned from "is this consistent with what we shipped before?" into "is this the right pattern for this problem?" — a much better conversation. Scope-wise, the system covers fourteen component families, around 100 documented type styles, thirteen-plus chart variants, an atomic table system, and a wealth-management vocabulary that no off-the-shelf system would have given me.',
      reflectionIntro: "Building alone is fast, but it's lossy.",
      reflection: [
        {
          title: 'Decisions never get pressure-tested',
          body:
            "The labels vocabulary, for instance — I decided it. Nobody asked 'are these the right five investment buckets?' or 'why is health insurance separate from estate?' The system reflects me, not us. That's a debt that compounds with every component.",
        },
        {
          title: 'Convention is trust, but it can become same-ness',
          body:
            'Five competitors taught me what to keep familiar. None of them taught me where to risk being different. Some places in the system — chart resize behavior, the labels vocabulary — probably should be more opinionated than they are.',
        },
        {
          title: 'Agents make solo less lonely, but not less subjective',
          body:
            "ads-linter can flag a token violation. It can't tell me when 'familiar' has become 'derivative.' That call is still mine.",
        },
      ],
      reflectionClose:
        "What designing under boring is safe taught me: in regulated, high-stakes domains, restraint is a feature, not a constraint. The harder lesson was that working alone shapes what you make. The next version of this system needs more than another set of tokens — it needs another point of view.",
      deliverables: ['Design System', 'Token Architecture', 'Component Library', 'Agent Layer'],
    },
  },
  {
    id: 'income-allocation',
    title: 'Income & Allocation',
    tags: ['Dashboard', 'Data Viz', 'Drag & Drop'],
    previewColor: '#CEF8E0',
    previewType: 'bars',
    role: 'Lead Designer',
    timeline: '12 Weeks',
    platform: 'Web',
    team: ['Dev', 'Marketing', 'Designer'],
    description:
      'Redesigned the income allocation interface for a wealth management platform, enabling users to split deposits across savings, investments, and spending accounts with intuitive drag-based controls and real-time previews.',
  },
  {
    id: 'policy-review',
    title: 'Policy Review',
    tags: ['Compliance', 'User Research', 'Mobile'],
    previewColor: '#E8DBFA',
    previewType: 'cards',
    role: 'Product Designer',
    timeline: '8 Weeks',
    platform: 'Web & Mobile',
    team: ['Dev', 'Legal', 'Designer'],
    description:
      'Crafted a streamlined policy review flow that surfaces key coverage details, highlights changes between renewal periods, and reduces the time advisors spend on document comparison by 40%.',
  },
  {
    id: 'spending-analytics',
    title: 'Spending Analytics',
    tags: ['Data Viz', 'Charts', 'Real-time'],
    previewColor: '#D6ECFF',
    previewType: 'chart',
    role: 'Lead Designer',
    timeline: '10 Weeks',
    platform: 'Mobile',
    team: ['Dev', 'Data', 'Designer'],
    description:
      'Built a comprehensive spending analytics dashboard that categorizes transactions, tracks budget goals, and provides actionable insights through interactive charts and personalized nudges.',
  },
  {
    id: 'estate-planning',
    title: 'Estate Planning',
    tags: ['Advisory', 'Wizard Flow', 'IA'],
    previewColor: '#FFE0E0',
    previewType: 'list',
    role: 'Senior Designer',
    timeline: '14 Weeks',
    platform: 'Web',
    team: ['Dev', 'Marketing', 'Designer'],
    description:
      'Designed an estate planning toolkit that guides advisors through beneficiary setup, asset mapping, and trust configuration with a step-by-step wizard and progress tracking.',
  },
  {
    id: 'portfolio-tracker',
    title: 'Portfolio Tracker',
    tags: ['Dashboard', 'Animation', 'Responsive'],
    previewColor: '#FFF3D6',
    previewType: 'bars',
    role: 'Lead Designer',
    timeline: '6 Weeks',
    platform: 'Web & Mobile',
    team: ['Dev', 'Designer'],
    description:
      'Created a real-time portfolio tracking dashboard featuring asset breakdown, performance benchmarking, and sector-level drill-downs with smooth animated transitions between time ranges.',
  },
  {
    id: 'tax-optimizer',
    title: 'Tax Optimizer',
    tags: ['Fintech', 'Simulation', 'Strategy'],
    previewColor: '#D6F5EC',
    previewType: 'chart',
    role: 'Product Designer',
    timeline: '9 Weeks',
    platform: 'Web',
    team: ['Dev', 'Finance', 'Designer'],
    description:
      'Developed an intelligent tax optimization interface that simulates harvesting scenarios, visualizes potential savings, and provides one-click execution for recommended strategies.',
  },
  {
    id: 'onboarding-flow',
    title: 'Onboarding Flow',
    tags: ['Conversion', 'Forms', 'UX Writing'],
    previewColor: '#E8DBFA',
    previewType: 'cards',
    role: 'Lead Designer',
    timeline: '4 Weeks',
    platform: 'Mobile',
    team: ['Dev', 'Growth', 'Designer'],
    description:
      'Reimagined the customer onboarding experience with progressive disclosure, inline verification, and contextual tooltips, increasing completion rates from 62% to 89%.',
  },
  {
    id: 'advisor-dashboard',
    title: 'Advisor Dashboard',
    tags: ['Platform', 'Multi-view', 'Alerts'],
    previewColor: '#D6ECFF',
    previewType: 'list',
    role: 'Senior Designer',
    timeline: '16 Weeks',
    platform: 'Web',
    team: ['Dev', 'Marketing', 'Designer'],
    description:
      'Designed a unified advisor dashboard consolidating client portfolios, meeting schedules, compliance alerts, and performance metrics into a single actionable workspace.',
  },
]

export default projects
