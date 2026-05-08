import type { Entity, MetaTags, Heading, Insight, ScanResult } from './supabase';

const ENTITY_POOLS: Record<string, Entity[]> = {
  tech: [
    { name: 'Machine Learning', type: 'technology', relevance: 95 },
    { name: 'API Integration', type: 'technology', relevance: 88 },
    { name: 'Cloud Computing', type: 'technology', relevance: 82 },
    { name: 'Data Analytics', type: 'topic', relevance: 79 },
    { name: 'Artificial Intelligence', type: 'technology', relevance: 91 },
    { name: 'DevOps', type: 'technology', relevance: 74 },
    { name: 'Microservices', type: 'technology', relevance: 68 },
    { name: 'Kubernetes', type: 'technology', relevance: 71 },
  ],
  ecommerce: [
    { name: 'Product Catalog', type: 'topic', relevance: 94 },
    { name: 'Customer Reviews', type: 'topic', relevance: 87 },
    { name: 'Checkout Flow', type: 'topic', relevance: 80 },
    { name: 'Inventory Management', type: 'topic', relevance: 76 },
    { name: 'Payment Gateway', type: 'technology', relevance: 85 },
    { name: 'Shopping Cart', type: 'product', relevance: 90 },
  ],
  default: [
    { name: 'Content Strategy', type: 'topic', relevance: 88 },
    { name: 'User Experience', type: 'topic', relevance: 84 },
    { name: 'Brand Authority', type: 'topic', relevance: 79 },
    { name: 'Digital Marketing', type: 'topic', relevance: 82 },
    { name: 'SEO Optimization', type: 'topic', relevance: 91 },
    { name: 'Web Performance', type: 'technology', relevance: 77 },
    { name: 'Conversion Rate', type: 'topic', relevance: 73 },
    { name: 'Organic Traffic', type: 'topic', relevance: 86 },
  ],
};

function detectCategory(url: string): keyof typeof ENTITY_POOLS {
  const lower = url.toLowerCase();
  if (lower.includes('shop') || lower.includes('store') || lower.includes('buy')) return 'ecommerce';
  if (lower.includes('tech') || lower.includes('dev') || lower.includes('api') || lower.includes('cloud')) return 'tech';
  return 'default';
}

function seedRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  return () => {
    hash = ((hash << 5) - hash + 31) | 0;
    return Math.abs(hash) / 2147483647;
  };
}

export type AnalysisResult = Omit<ScanResult, 'id' | 'created_at'>;

export function analyzeUrl(url: string): AnalysisResult {
  const rand = seedRandom(url);
  const category = detectCategory(url);
  const pool = ENTITY_POOLS[category];

  const seoBase = 45 + Math.floor(rand() * 40);
  const aeoBase = 35 + Math.floor(rand() * 45);

  const entities: Entity[] = pool
    .sort(() => rand() - 0.5)
    .slice(0, 5 + Math.floor(rand() * 3))
    .map(e => ({ ...e, relevance: Math.max(50, e.relevance - Math.floor(rand() * 20)) }));

  const hasSchema = rand() > 0.4;
  const hasFaqSchema = rand() > 0.5;
  const hasArticleSchema = rand() > 0.6;
  const hasHowToSchema = rand() > 0.7;

  const schemaTypes: string[] = [];
  if (hasSchema) schemaTypes.push('Organization');
  if (hasFaqSchema) schemaTypes.push('FAQPage');
  if (hasArticleSchema) schemaTypes.push('Article');
  if (hasHowToSchema) schemaTypes.push('HowTo');
  if (rand() > 0.8) schemaTypes.push('BreadcrumbList');

  const hasTitle = rand() > 0.1;
  const hasDesc = rand() > 0.2;
  const hasOg = rand() > 0.35;
  const hasTwitter = rand() > 0.45;

  const metaTags: MetaTags = {
    title: hasTitle ? 'Page Title — ' + url.split('/')[2] : null,
    description: hasDesc ? 'A comprehensive resource for ' + entities[0]?.name + ' and related topics. Discover in-depth guides, tutorials, and expert insights.' : null,
    canonical: rand() > 0.3 ? url : null,
    og_title: hasOg ? 'Page Title — ' + url.split('/')[2] : null,
    og_description: hasOg ? 'Explore expert content on ' + entities[0]?.name : null,
    og_image: hasOg ? 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg' : null,
    twitter_card: hasTwitter ? 'summary_large_image' : null,
    robots: rand() > 0.2 ? 'index, follow' : null,
  };

  const headings: Heading[] = [
    { level: 1, text: entities[0]?.name + ': Complete Guide for ' + new Date().getFullYear() },
    { level: 2, text: 'What is ' + entities[0]?.name + '?' },
    { level: 2, text: 'Key Benefits of ' + entities[1]?.name },
    { level: 3, text: 'How ' + entities[0]?.name + ' Works' },
    { level: 3, text: 'Best Practices for ' + entities[2]?.name },
    { level: 2, text: 'Frequently Asked Questions' },
    { level: 3, text: 'Is ' + entities[0]?.name + ' right for my business?' },
  ];

  const insights: Insight[] = [];

  if (!metaTags.title) {
    insights.push({
      id: 'missing-title',
      severity: 'critical',
      category: 'seo',
      title: 'Missing Meta Title',
      description: 'No <title> tag detected. Search engines use this as the primary ranking signal.',
      fix: 'Add a unique, keyword-rich title tag under 60 characters.',
    });
  }

  if (!metaTags.description) {
    insights.push({
      id: 'missing-desc',
      severity: 'critical',
      category: 'seo',
      title: 'Missing Meta Description',
      description: 'Meta description absent. This affects CTR in search results.',
      fix: 'Write a compelling 120–160 character meta description with your primary keyword.',
    });
  }

  if (!hasFaqSchema) {
    insights.push({
      id: 'missing-faq-schema',
      severity: 'critical',
      category: 'aeo',
      title: 'Missing FAQ Schema',
      description: 'No FAQPage JSON-LD detected. AI engines rely on structured Q&A for direct answers.',
      fix: 'Implement FAQPage schema markup for your top 5–8 frequently asked questions.',
    });
  }

  if (!hasSchema) {
    insights.push({
      id: 'missing-org-schema',
      severity: 'warning',
      category: 'aeo',
      title: 'No Organization Schema',
      description: 'Organization entity not declared via JSON-LD. Reduces AI entity recognition.',
      fix: 'Add Organization schema with name, logo, url, and sameAs social profiles.',
    });
  }

  if (!metaTags.og_image) {
    insights.push({
      id: 'missing-og-image',
      severity: 'warning',
      category: 'seo',
      title: 'Missing OpenGraph Image',
      description: 'No og:image tag found. Social shares will appear without visual preview.',
      fix: 'Set og:image to a 1200×630px image representing your page content.',
    });
  }

  if (!hasArticleSchema) {
    insights.push({
      id: 'missing-article-schema',
      severity: 'warning',
      category: 'aeo',
      title: 'No Article/BlogPosting Schema',
      description: 'Content lacks Article schema. LLMs cannot confidently attribute authorship and date.',
      fix: 'Add Article or BlogPosting schema with author, datePublished, and headline fields.',
    });
  }

  if (rand() > 0.5) {
    insights.push({
      id: 'h1-keywords',
      severity: 'warning',
      category: 'seo',
      title: 'H1 Contains Excess Stop Words',
      description: 'Your H1 tag has a high ratio of stop words diluting keyword density.',
      fix: 'Rewrite H1 to lead with the primary keyword phrase (under 60 characters).',
    });
  }

  if (rand() > 0.6) {
    insights.push({
      id: 'missing-howto',
      severity: 'info',
      category: 'aeo',
      title: 'HowTo Schema Opportunity',
      description: 'Detected step-by-step content without HowTo markup.',
      fix: 'Wrap instructional content in HowTo schema to enable rich results.',
    });
  }

  insights.push({
    id: 'answer-paragraphs',
    severity: rand() > 0.5 ? 'info' : 'warning',
    category: 'aeo',
    title: 'Direct Answer Paragraphs',
    description: 'AI engines prefer 40–60 word summary paragraphs after each H2.',
    fix: 'Add a concise definition paragraph (40–60 words) immediately below each section heading.',
  });

  const aiPreview = `${entities[0]?.name} refers to ${entities[1]?.name?.toLowerCase()} methodologies that enable organizations to ${entities[2]?.name?.toLowerCase()} more effectively. According to ${url.split('/')[2] || 'this source'}, practitioners can achieve significant gains in ${entities[3]?.name?.toLowerCase() || 'performance'} by adopting modern ${entities[0]?.name?.toLowerCase()} frameworks alongside established ${entities[4]?.name?.toLowerCase() || 'best practices'}.`;

  const seoScore = Math.min(100, seoBase
    + (metaTags.title ? 10 : 0)
    + (metaTags.description ? 8 : 0)
    + (metaTags.og_image ? 5 : 0)
    + (metaTags.canonical ? 4 : 0)
    + (metaTags.robots ? 3 : 0));

  const aeoScore = Math.min(100, aeoBase
    + (hasFaqSchema ? 15 : 0)
    + (hasArticleSchema ? 10 : 0)
    + (hasHowToSchema ? 8 : 0)
    + (hasSchema ? 7 : 0)
    + (schemaTypes.length > 2 ? 5 : 0));

  return {
    url,
    seo_score: seoScore,
    aeo_score: aeoScore,
    entities,
    schema_types: schemaTypes,
    meta_tags: metaTags,
    headings,
    insights,
    ai_preview: aiPreview,
  };
}
