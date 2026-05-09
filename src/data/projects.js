const projects = [
  {
    id: 'design-system',
    title: 'When Boring is Safe',
    tags: ['Design System', 'Tokens', 'Wealthtech'],
    previewColor: '#E5EAFC',
    previewType: 'cards',
    thumbnail: '/case-studies/design-system/thumbnail.webp',
    heroImage: '/case-studies/design-system/hero.webp',
    role: 'Sole Designer',
    timeline: 'Ongoing',
    platform: 'Web, Tablet, Mobile',
    team: ['Engineering', 'Designer'],
    description:
      'A design system for Alphanso, a wealthtech platform serving people tracking $250k+ portfolios. Built to deliver the calm and restraint a money product demands.',
    caseStudy: {
      tldr:
        "Built a design system for users tracking $250k+ portfolios — restraint, color with one job, clarity over cleverness — across 14 component families, a wealth-management vocabulary, and a 13-chart data viz library. Mockup time dropped from 1–2 days to half a day.",
      overview:
        "People moving real money read consistency as competence. A misaligned number, a button that behaves one way on this screen and another way on the next — each one is a small reason to wonder if the rest of the product is held together with tape.",
      challenge: [
        "For a SaaS tool, inconsistency is a quality issue. For a product where users are tracking portfolios of $250,000 or more, it's a trust issue.",
        "The product had grown to a point where this needed to be deliberate. So I stopped shipping screens, blocked time, and built the system.",
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
        "The product made the call: boring is safe. People moving real money want familiar, calm, and clear — they don't want to be impressed by gradients, they want to find their numbers and trust them. My job was to commit to that and go deep, not to argue it. That requirement turned into three rules — every component decision had to follow at least one.",
      doctrine: [
        {
          title: 'Quiet, not loud',
          body:
            'Every visual choice should mean something. No decoration, no gradients, no shadows that pop. Color is reserved for signal.',
          icon: '/case-studies/design-system/rules/quiet.svg',
          example: {
            headline: "The section that isn't there yet",
            body: [
              "When a user uploads a tax document, parsing takes about eight seconds. The convention is to show an empty section below the file with a skeleton placeholder — it tells the user where data will appear.",
              "We didn't. The section doesn't exist until parsing finds something, then it eases in.",
              "On a money product, empty sections don't read as 'loading.' They read as 'the system failed.' For unparseable files — PNGs and the like — the section doesn't appear at all.",
            ],
            media: {
              type: 'video',
              src: '/case-studies/design-system/panels/document-parsing.mov',
            },
            caption: 'Document upload, parse-to-section reveal.',
            rejected: 'Always-render the section with a skeleton state.',
          },
        },
        {
          title: 'Color, one job each',
          body:
            'Each color in the system is assigned a single job and never reused. Asset classes have fixed colors used wherever they appear; red is reserved for moments that carry weight.',
          icon: '/case-studies/design-system/rules/color.svg',
          example: {
            headline: 'Red carries weight',
            body: [
              "Red doesn't decorate or label numbers. It shows up only when the user needs to pay attention — a spending pattern they should see, an action they can't undo.",
              "Used everywhere, red becomes noise. Kept rare, it stays a signal — when it appears, the user knows it means something, and never has to ask why.",
            ],
            media: {
              type: 'image-grid',
              srcs: [
                '/case-studies/design-system/panels/red-spending.png',
                '/case-studies/design-system/panels/red-option-tray.png',
              ],
            },
            caption: 'A spending warning. A destructive action.',
          },
        },
        {
          title: 'Clear, not clever',
          body:
            'Never make the user wonder if something happened. Tabular figures, explicit labels, inline validation, modal confirmations for big actions.',
          icon: '/case-studies/design-system/rules/clear.svg',
          example: {
            headline: 'Fields in the order the document put them',
            body: [
              "When a user uploads a 1099, we parse it into a structured table. The clever move was to sort the rows — by amount, by category, by relevance.",
              "We didn't. Fields appear in the exact box order the form printed them — 1099-INT shows Box 1, 1099-DIV runs 1a → 1b → 2a → 4, 1099-MISC runs 2 → 3 → 4. Open the source PDF next to the parsed view: line 1 matches line 1.",
              "Sorting would make the system feel intelligent. Keeping the order matches what the user has in their hand.",
            ],
            media: {
              type: 'tabbed',
              tabs: [
                { label: 'Parsed', src: '/case-studies/design-system/panels/1099-div.png' },
                { label: 'Source', src: '/case-studies/design-system/panels/1099-div-source.png' },
              ],
            },
            caption: '1099-DIV — toggle to compare parsed view and source PDF.',
            rejected: 'Re-sorting parsed rows by amount, category, or relevance.',
          },
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
      tokenComposition: {
        src: '/case-studies/design-system/tokens-applied.webp',
        alt: 'Portfolio overview with token annotations — type, color, spacing, data viz, surface, border',
        caption: 'A real screen, with the tokens that compose it. Every element traces back to a named value.',
      },
      systemIntro:
        'Fourteen component families, every one built against the three rules — here\'s the catalog.',
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
          description:
            'The wealthtech vocabulary. Generic design systems give you buttons and chips — wealth management needs vocabulary. Each label has its own icon and category color, organized by domain (Investment service, Goal planning, Financial wellness, Tax support, Estate planning, sync states). No off-the-shelf DS has this layer because no off-the-shelf product needs it.',
          items: [
            { name: 'Labels', body: 'Domain-organized chips: investment buckets, goal types, tax services, estate items, sync states.', src: '/case-studies/design-system/labels.png', wide: true },
          ],
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
        "The trick wasn't the agents themselves. It was writing structured component descriptions once so they could read the file the way I do. I still make the design calls; the agents handle what used to eat my afternoon.",
      stats: [
        { value: '1–2d → ½d', label: 'Mockup time' },
        { value: '14', label: 'Component families' },
        { value: '13', label: 'Chart variants' },
      ],
      results:
        'The most concrete outcome was speed. Screen mockups that used to take 1–2 days started landing in half a day. Design review turned from "is this consistent with what we shipped before?" into "is this the right pattern for this problem?" — a much better conversation. Scope-wise, the system covers fourteen component families, thirteen-plus chart variants, an atomic table system, and a wealth-management vocabulary that no off-the-shelf system would have given me.',
      reflectionIntro: "Building alone is fast, but it's lossy.",
      reflection: [
        {
          title: 'Decisions never get pressure-tested',
          body:
            "The labels vocabulary, for instance — I decided it. Nobody pushed back. The system reflects me, not us, and that debt compounds with every component.",
        },
        {
          title: 'Convention is trust, but it can become same-ness',
          body:
            'Five competitors taught me what to keep familiar. None of them taught me where to risk being different.',
        },
        {
          title: 'Agents make solo less lonely, not less subjective',
          body:
            "ads-linter can flag a token violation. It can't tell me when 'familiar' has become 'derivative.'",
        },
      ],
      reflectionClose:
        "What I learned: in regulated, high-stakes domains, restraint is a feature, not a constraint. The harder lesson was that working alone shapes what you make. The next version of this system needs more than another set of tokens — it needs another point of view.",
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
