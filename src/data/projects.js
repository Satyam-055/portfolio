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
    id: 'strategic-review',
    title: 'Advisor as content',
    tags: ['Product Design', 'State Machine', 'Responsive'],
    previewColor: '#FFE8DC',
    previewType: 'cards',
    thumbnail: '/case-studies/strategic-review/thumbnail.png',
    heroImage: '/case-studies/strategic-review/hero.webp',
    role: 'Product Designer',
    timeline: '6 Weeks',
    platform: 'Web, Tablet, Mobile',
    team: ['Advisory', 'Engineering', 'Designer'],
    description:
      'A widget that brings personalized advisor reviews into the Alphanso dashboard — request, wait, read the report — without leaving the surface where the rest of your money lives.',
    caseStudy: {
      sectionLabels: {
        fracture: 'The gap',
        stance: 'The decisions',
        foundations: 'The widget',
      },
      tldr:
        "A dashboard widget that surfaces advisor-driven financial reviews as content. Six analysis types, each with custom data visualizations, redesigned across the breakpoints they ship in — all using the same dashboard grammar as charts, accounts, and statements. No separate inbox, no scheduling, no PDF emails.",
      overview:
        "Wealthtech products usually pick a side. Self-serve dashboards where you draw your own conclusions, or full advisory where a human tells you what to do. Alphanso bet on hybrid — and that meant designing a way for advisor work to live alongside everything else, not in a parallel space.",
      challenge: [
        "The default playbook for adding human advisory to a digital product is a meeting-booking app: schedule a call, show up, get a PDF, never think about it again. Calendar friction up front, attachment-tab friction at the end.",
        "Strategic Reviews bet on something different: the advisor never appears as a person you book. They appear as the source of a report that lands in your dashboard, with the same grammar — chart card, status badge, tap to open — as everything else you already use.",
      ],
      journey: {
        intro:
          'Six steps from a user wanting an analysis to reading the report. Each step traded a default friction point for a quieter one.',
        image: '/case-studies/strategic-review/journey-flow.webp',
        wide: true,
        alt: 'Six-step user journey diagram',
        caption: 'The journey, captured during research. Each blue square is a step; each yellow sticky was an open question.',
      },
      doctrineIntro:
        'Two decisions shaped what shipped. Both came from the same constraint: the dashboard\'s grammar had to absorb advisor work without changing for it.',
      doctrine: [
        {
          title: 'Modal, not in-widget',
          body:
            'The detail view opens in a modal on desktop and a bottom sheet on mobile. The card stays where it was. Two surfaces, two jobs.',
          tabs: [
            {
              label: 'Desktop',
              widthPx: 960,
              image: '/case-studies/strategic-review/analysis-modal.webp',
              alt: 'Strategic Reviews modal on desktop — left rail listing the six analysis types, Investment Portfolio selected with description, time estimate, and required inputs.',
            },
            {
              label: 'Mobile',
              widthPx: 375,
              image: '/case-studies/strategic-review/modal-mobile.webp',
              alt: 'Strategic Reviews bottom sheet on mobile — same content, vertical layout, drag handle at the bottom.',
            },
          ],
          example: {
            headline: 'How img, card, and modal come together',
            intro:
              'Three layers carry the work. Each one has a single job, and each one degrades gracefully when the size shrinks.',
            sections: [
              {
                heading: 'SVGs, crafted per strategy',
                body:
                  'Each review type gets its own illustration. Investment uses an ascending chart over a green grid; Advanced Tax Strategy uses stacked, layered receipts. The motif maps to the strategy so the user can tell types apart at a glance, before reading the headline.',
                media: {
                  type: 'image-grid',
                  srcs: [
                    '/case-studies/strategic-review/svg-investment.webp',
                    '/case-studies/strategic-review/svg-tax.webp',
                  ],
                },
                caption: 'Investment Portfolio (left) and Advanced Tax Strategy (right). Same canvas size, different language.',
              },
              {
                heading: 'Cards: status badge, plus a hint of why',
                body:
                  'Every card carries a status badge — "1–2 days · In review" with an hourglass while pending, a green check when ready. Secondary text under the headline names the analysis subject ("Bank of America (*4932)" for Account, "Maximize Retirement Savings" for Tax). It tells the user this review was kicked off for them, not a generic template.',
                media: {
                  type: 'image-grid',
                  srcs: [
                    '/case-studies/strategic-review/card-account.webp',
                    '/case-studies/strategic-review/card-tax-strategy.webp',
                  ],
                },
                caption: 'Two cards waiting on review. The hourglass and "1–2 days" anchor the eye before the strategy name.',
              },
            ],
            rejected:
              'Expanding the full report inside the card would have meant fitting six analyses, each with their own breakdown, into a 380-pixel container.',
          },
        },
        {
          title: 'Information density adapts; meaning doesn\'t',
          body:
            'Strategic Reviews surfaces six analyses, each a custom data visualization. Every one had to render at multiple sizes without losing the user. The rule: information density adapts to size, but the chart\'s meaning never does. A funnel stays a funnel; a comparison stays a comparison. Values move into overlays before they get cut.',
          image: '/case-studies/strategic-review/modal-detail.webp',
          scrollable: true,
          alt: 'Investment Portfolio review opened — donuts for current vs recommended allocation, bar chart of weights, sector breakdown, holdings table, fixed income table, portfolio characteristics. Scroll to see the entire breakdown.',
        },
      ],
      scopeShowcaseIntro:
        'The work that doesn\'t fit on a single page. Two of the six analyses — Tier Analysis and Income vs Allocation — shown across the sizes they ship in. Different charts react to breakpoints differently, which is why the size counts aren\'t identical.',
      scopeShowcase: [
        {
          title: 'Tier Analysis',
          body:
            'A funnel that buckets the portfolio across emergency / short-term / mid-term / retirement, with advisor recommendations overlaid. At Large, every tier shows its dollar value and breakdown inline. At Compact, the chart shrinks but the meaning holds. Tap any tier and the Expanded view opens — the same chart re-shaped as a focused breakdown.',
          sizes: [
            { label: 'Large', widthPx: 720, image: '/case-studies/strategic-review/tier-large.webp', alt: 'Tier Analysis at Large — full funnel with all four tiers, dollar values and recommendations inline.' },
            { label: 'Expanded', widthPx: 720, image: '/case-studies/strategic-review/tier-expanded.webp', alt: 'Tier Analysis with Tier 1 inline-expanded — sub-bars for Household, Mortgage, and Other daily needs.' },
            { label: 'Compact', widthPx: 380, image: '/case-studies/strategic-review/tier-compact.webp', alt: 'Tier 1 modal at Compact — when there\'s no room to expand inline, a modal pops up with the breakdown.' },
          ],
        },
        {
          title: 'Income vs Allocation',
          body:
            'Two donut charts comparing Current to Recommended allocation, with delta bars below. Different charts, same density rule. At Large, both donuts sit side by side. Below the Large breakpoint they collapse into a single donut with a Current / Recommended tab toggle — same comparison, less screen.',
          sizes: [
            { label: 'Large', widthPx: 720, image: '/case-studies/strategic-review/income-large.webp', alt: 'Income vs Allocation at Large — Current and Recommended donuts side by side with delta bars.' },
            { label: 'Compact', widthPx: 380, image: '/case-studies/strategic-review/income-compact.webp', alt: 'Income vs Allocation at Compact — single donut with Current / Recommended tab toggle.' },
          ],
        },
      ],
      foundationsIntro:
        'The widget shell that holds the analyses adapts across three primary breakpoints. Same content, three layouts.',
      foundations: [
        {
          title: 'Three breakpoints',
          body:
            'Large (≥528px) and Medium (420–527px) keep the full pill CTA "Request a review" and a horizontal-split empty state. Compact (≤419px) collapses the CTA to an icon-only + button and stacks the empty state vertically.',
          sizeChips: ['Large 631px', 'Medium 527px', 'Compact 379px'],
        },
        {
          title: 'Card carousel',
          body:
            'Review cards stay 260px wide across all breakpoints — what changes is how many are visible (≈2.2 / 1.8 / 1.2). Same gap, same card height, same status badge grammar. Horizontal scroll with three-dot pagination.',
        },
        {
          title: 'Empty state, marketed',
          body:
            'The empty state isn\'t a placeholder — it\'s the user\'s first contact with the feature. "Your advisor, on demand" explains what the widget does and ends with the same Request CTA, so empty and populated states feel like the same widget at different points in time.',
        },
        {
          title: 'Status grammar',
          body:
            'In review (yellow badge + ETA "1–2 days") and View report (green badge, no ETA). Cards in the same carousel can be in different states simultaneously, so users always see what\'s pending and what\'s ready in the same scan.',
        },
      ],
      widgetSizes: [
        { label: 'Large 631px', widthPx: 631, image: '/case-studies/strategic-review/widget-large.webp', alt: 'Widget at Large — full "Request a review" pill, multiple review cards visible in the carousel.' },
        { label: 'Medium 527px', widthPx: 527, image: '/case-studies/strategic-review/widget-medium.webp', alt: 'Widget at Medium — pill CTA persists, one review card visible.' },
        { label: 'Compact 379px', widthPx: 379, image: '/case-studies/strategic-review/widget-compact.webp', alt: 'Widget at Compact — CTA stays full pill, vertical-stack empty state with the on-demand pitch.' },
      ],
      stats: [
        { value: '6', label: 'Analysis types' },
        { value: '2–3', label: 'Sizes per analysis' },
        { value: '~30', label: 'Chart layouts shipped' },
      ],
      results:
        'The widget shipped as the entry point to a feature that, in the wealthtech category, is usually a calendar-and-PDF flow. By keeping advisor output inside the dashboard\'s existing grammar — chart cards, status badges, tap-to-open — users never have to context-switch between "I\'m using my product" and "I\'m talking to my advisor." The wait time didn\'t change. The wait experience did.',
      reflectionIntro:
        "Hybrid models look obvious in retrospect. They aren\'t.",
      reflection: [
        {
          title: 'The dashboard\'s grammar paid for itself',
          body:
            'The chart cards, the status badges, the modal pattern — most of these weren\'t new. Strategic Reviews is mostly existing components in a new arrangement. That repetition is why six different visualizations don\'t feel like six different products.',
        },
        {
          title: 'Six charts, many sizes — the system held',
          body:
            'Each analysis got its own custom chart, but every one was constrained by the same density rule and the same widget shell. The constraints became the case for shipping six analyses instead of three.',
        },
        {
          title: 'Some calls still feel under-tested',
          body:
            'The modal-vs-in-widget decision was the right one for cramped screens. On a 1440px desktop, it\'s less obvious that the modal earned its keep — that\'s a measurement we still owe ourselves.',
        },
      ],
      reflectionClose:
        "The bet was that you could ship advisory inside a dashboard without becoming a meeting-booking app. The proof is in the seams: where would a user notice they\'ve crossed from \"self-serve product\" into \"advisor space\"? After six analyses, dozens of layouts, and one modal, the answer is mostly nowhere.",
      deliverables: ['Product Design', 'Interaction Design', 'Responsive System', 'Component Spec'],
    },
  },
  {
    id: 'manual-account',
    title: 'Upload. Done.',
    tags: ['Product Design', 'Fintech', 'System Design'],
    previewColor: '#E6F0E8',
    previewType: 'cards',
    thumbnail: '/case-studies/manual-account/thumbnail.webp',
    heroImage: '/case-studies/manual-account/Modal-1.webp',
    role: 'Product Designer',
    timeline: '5 Weeks',
    platform: 'Web, Mobile',
    team: ['Engineering', 'Designer'],
    description:
      "Designing manual account creation that doesn't feel manual — a PDF upload flow that extracts real holdings, history, and balances without a form in sight.",
    caseStudy: {
      sectionLabels: {
        fracture: 'The problem',
        research: 'Research',
        stance: 'The decisions',
        showcase: 'The flow',
        foundations: 'After the account exists',
      },

      tldr:
        'Most financial apps treat manual account creation as a punishment for when automatic connection fails. We made it a first-class path — upload a bank statement, get a fully populated account with holdings, history, and balance. No form. No column mapping. Two entry points, one flow, and a clear upgrade path to automatic sync.',

      overview:
        'Most financial apps connect to your bank automatically — you log in once and your accounts, balances, and transactions appear. But that automatic connection fails more often than you\'d think. And even when it works, some users aren\'t ready to hand over their bank credentials to a third-party app on day one.',

      challenge: [
        'When the automatic connection fails, most apps hit a wall. The fallback is a form. Enter your account name. Enter your balance. Done. Except it\'s not done — now you have a number floating in a dashboard with no history, no holdings, no context. A ghost account.',
        'We wanted to do better than that.',
      ],

      competitorIntro:
        'We audited six competitors: Kubera, Portfolio Performance, Sharesight, Betterment, Monarch Money, and Empower. The pattern was consistent — manual account creation was either hidden, bolted on after failure, or stripped of the features that auto-connected accounts get.',

      competitorMatrix: [
        { competitor: 'Kubera', learning: 'Only app with stale data nudges. AI extraction but no visual badge distinguishing manual vs synced.' },
        { competitor: 'Portfolio Performance', learning: '90+ bank-specific parsers. 3-step wizard preview. Desktop-only.' },
        { competitor: 'Sharesight', learning: 'Best preview step — inline row editing. CSV-only, no PDF.' },
        { competitor: 'Betterment', learning: 'Yellow warning banner after failure. "Connect Manually Instead" — most explicit fallback, but framed as failure.' },
        { competitor: 'Monarch Money', learning: 'Tiered fallback after connection fails. Good discovery, too many steps.' },
        { competitor: 'Empower', learning: 'Anti-pattern: users must type "MANUAL" as a search keyword to find manual creation. Hidden by design.' },
      ],

      moodboard: {
        src: '/case-studies/manual-account/moodboard.pdf',
        label: 'Manual Account Creation — Moodboard',
      },

      journeys: [
        { label: 'Journey 1', src: '/case-studies/manual-account/journey-1.pdf' },
        { label: 'Journey 2', src: '/case-studies/manual-account/journey-2.pdf' },
      ],

      painPoints: [
        {
          severity: 'Critical',
          title: 'Manual is undiscoverable',
          body: 'Most platforms hide the option until something breaks. Empower requires knowing a secret keyword. Users who need it most can\'t find it.',
          opportunity: 'Surface upload prominently at the failure point and as an intentional path in Add Account — a confident alternative, not a hidden fallback.',
        },
        {
          severity: 'Critical',
          title: 'Data goes stale silently',
          body: 'Manual accounts go stale with no warning. Net worth dashboards become inaccurate over time. Only Kubera sends proactive reminders — everyone else ignores the problem.',
          opportunity: 'A stale data nudge on the account card with a direct route to upload a newer statement.',
        },
        {
          severity: 'High',
          title: 'Manual accounts are second-class',
          body: 'Fewer features across every competitor: no transaction tracking, no performance analysis, no historical data. Users who can\'t auto-connect get a degraded product.',
          opportunity: 'Document Lens extracts holdings, transactions, and balances from the statement — same data richness as a connected account.',
        },
      ],

      doctrineIntro:
        'Two entry points, one flow. Users arrive either from a failed automatic connection or intentionally through Add Account. Each carries different emotional context — frustration vs intent. The flow underneath is identical.',

      doctrine: [
        {
          title: 'Non-blocking by default',
          body:
            'Parsing a statement takes time. The modal minimizes into a persistent bottom-right toast — Importing → Verifying → Ready — while the user keeps navigating. No waiting. No staring at a spinner.',
          imagePlaceholder: 'Four toast states side by side: Importing (spinner), Verifying (spinner + blue dot on tab), Account ready (green check + View CTA), 1 import failed (amber bar + Upload CTA)',
          example: {
            headline: 'The pipeline behind the 98%',
            body: [
              'When a PDF is uploaded, it passes through three stages before an account is created.',
              'First, Redact strips personally identifiable information so raw document data never hits the main API. Then LLaMA parses the document structure — identifying account type, institution, holdings, balances, and transaction rows. Finally, GPT classifies and normalises the output into Alphanso\'s account schema.',
              'The result is 98% parse accuracy on institutional PDFs. That accuracy is why extracted values aren\'t editable — showing a correction UI would undermine the confidence signal the whole flow is built on.',
            ],
            pipelineSteps: ['PDF in', 'Redact PII', 'LLaMA parses', 'GPT classifies', 'Account out'],
          },
        },
        {
          title: 'What we killed',
          body:
            'Three directions were explored and cut. Each was a deliberate decision, not a resource constraint.',
          example: {
            headline: 'Three directions that didn\'t make it',
            sections: [
              {
                heading: 'Draft state',
                body: 'We explored saving partial uploads so users could resume later. Built it out, then cut it — the flow takes under a minute to restart. A dedicated tab for edge-case recovery adds noise at exactly the moment when a new user\'s trust is most fragile.',
              },
              {
                heading: 'Live-update widget',
                body: 'A widget showing in-progress parsing implies uncertainty. On day one, you don\'t want the interface telegraphing "we\'re not sure yet." Confidence is the design.',
              },
              {
                heading: 'Password-protected PDF support',
                body: 'The moodboard included it. Cut during research — US financial institutions don\'t password protect statements. The assumption was a cultural import from Indian banking norms, not a real US user need.',
              },
            ],
          },
        },
      ],

      scopeShowcaseIntro:
        'Upload a PDF statement from your bank or brokerage. The modal minimizes. Parsing runs in the background. A persistent toast tracks the state. No form, no column mapping, no reformatting.',

      scopeShowcase: [
        {
          title: 'Entry point A — Add Account',
          body: 'From Add Account, the account type selector always ends with "Having trouble? Create manually." The path is visible before anything goes wrong — an intentional choice, not a last resort.',
          tabs: [
            { label: 'Desktop', src: '/case-studies/manual-account/Modal.webp', alt: 'Select account type modal — desktop' },
            { label: 'Mobile', src: '/case-studies/manual-account/Bottom-sheet.webp', alt: 'Select account type bottom sheet — mobile' },
          ],
        },
        {
          title: 'Entry point B — Connection failure',
          body: 'When automatic connection fails, the error screen doesn\'t dead-end. It pivots: "You can still add this account by uploading a recent statement." Trust copy and a single CTA — no hunting for a workaround.',
          image: '/case-studies/manual-account/Modal-1.webp',
          alt: 'Couldn\'t connect to Fidelity modal — Create manual account CTA with statement upload illustration',
        },
        {
          title: 'Upload',
          body: 'User selects a PDF. The modal shows the filename with an importing spinner and copy that lets them know they can walk away: "We\'re extracting your account details and transactions. Feel free to continue."',
          image: '/case-studies/manual-account/Modal-2.webp',
          alt: 'Upload statement modal — file drop zone with step-by-step explainer',
        },
        {
          title: 'Verifying',
          body: 'Document is parsed in the background. The modal minimizes to a bottom-right toast. A blue dot on the account tab in the header signals something is in progress without interrupting the current page.',
          image: '/case-studies/manual-account/Modal-3.webp',
          alt: 'Upload statement modal — verifying state with filename, spinner, and Minimize button',
        },
        {
          title: 'Ready',
          body: 'Parsing complete. The extracted institution, account number, holdings, type, and date appear — no form to fill. One button: Create account.',
          image: '/case-studies/manual-account/Modal-4.webp',
          alt: 'Upload statement modal — parsed account data shown, Create account button active',
        },
        {
          title: 'Error',
          body: 'If the file isn\'t a valid statement, a clear inline message explains why and offers one action: upload a different file. No dead ends.',
          image: '/case-studies/manual-account/Error.webp',
          alt: 'Upload statement modal — error state: This doesn\'t look like an account statement',
        },
        {
          title: 'Mobile',
          body: 'On mobile the entry point lives on the connection failure screen itself — a "Create manual account" CTA with trust copy below it. The import runs as a dismissible bottom sheet.',
          image: '/case-studies/manual-account/Bottom-sheet.webp',
          alt: 'Mobile: Select account type bottom sheet with Create manually option',
        },
      ],

      foundationsIntro:
        'Most competitors stop at account created. We didn\'t.',

      foundations: [
        {
          title: 'Manual badge',
          body: 'Every manually created account carries a dashed border — honest, not shameful. Synced accounts use a solid border. At a glance you know which data is live and which came from a document. Tap the badge and you\'re back in the upload flow to enrich the account with a newer statement.',
          imagePlaceholder: 'Account card: dashed-border Manual badge (left) vs solid-border Synced badge (right)',
        },
        {
          title: 'Document history',
          body: 'Every PDF that has ever contributed to the account is listed on the account detail page. Full audit trail, always visible to the user.',
          image: { src: '/case-studies/manual-account/Source expanded.webp', alt: 'Account detail page showing associated documents list and spending chart' },
        },
        {
          title: 'Enrichment over time',
          body: 'Upload a newer statement from the badge on the account detail page — the account updates in place. Same flow as creation, reused for enrichment. The feature doesn\'t end at first upload.',
          imagePlaceholder: 'Account detail — Manual badge tapped, upload new statement prompt open',
        },
        {
          title: 'Stale data nudge',
          body: '"Upload a new statement to refresh your view — or connect your brokerage for automatic updates." The upgrade path to automatic sync is always one tap away. Manual is a starting point, not a dead end.',
          imagePlaceholder: 'Stale nudge state on account card — upload prompt + connect brokerage link',
        },
      ],

      stats: [
        { value: '2', label: 'Entry points' },
        { value: '98%', label: 'Parse accuracy' },
        { value: '3', label: 'Directions killed' },
      ],

      results:
        'The flow ships as the fallback path for users whose automatic connection failed — and as an intentional first step for users who aren\'t ready to connect yet. By treating the PDF as a data-rich source rather than a workaround, manual accounts get the same holdings, history, and balance data as connected ones. The badge, the document list, and the stale nudge close the loop: manual isn\'t lesser, it\'s a starting point.',

      reflectionIntro:
        'Three things worth keeping from this project.',

      reflection: [
        {
          title: 'Research killed two features before they shipped',
          body: 'Password-protected PDF support was designed before we checked whether US banks actually use passwords. They don\'t. Research is cheaper than building the wrong thing.',
        },
        {
          title: 'Confidence is a design decision',
          body: 'Skipping the correction UI was the highest-stakes call. A 98% accuracy rate earns the right to show output as fact, not a draft. Showing editable fields would have told users to distrust the system before they\'d tried it.',
        },
        {
          title: 'The upgrade path matters as much as the flow',
          body: 'Designing manual creation without designing the route out of it would have left users stranded. The stale nudge and the badge aren\'t polish — they\'re the argument that manual accounts are first-class.',
        },
      ],

      reflectionClose:
        'The bet was that uploading a PDF could create an account as rich as one that\'s been connected for months. The parse pipeline makes that true. The design\'s job was to not get in the way of that — and to make sure users knew where to go next.',

      deliverables: ['Product Design', 'Interaction Design', 'System Design', 'Mobile'],
    },
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
