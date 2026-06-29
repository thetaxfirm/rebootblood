/**
 * Learning Center content model: hub-and-spoke educational articles.
 * Pillars are broad authority pages; spokes are condition-specific pages that
 * deep-link into the eligibility quiz via ?condition=<value> (values must match
 * CONDITION_OPTIONS in shared/forms.ts).
 *
 * All copy is educational and intentionally non-claim ("may", "designed to",
 * "is being studied"), consistent with the site's FDA/educational disclaimer.
 */

export type LearnSection = { heading: string; body: string[] };
export type LearnFaq = { q: string; a: string };

/**
 * Optional attribution for articles adapted from an external source. When
 * present, ArticleLayout renders a citation block crediting the original
 * author/publisher. Used for the EXTERNAL_ARTICLES group (content adapted from
 * third-party explainers into rEBOOtBlood's non-claim, educational voice).
 */
export type LearnByline = {
  /** Original author or editorial credit, e.g. "Kim Look". */
  author: string;
  /** Original publisher/site name, e.g. "EBOO Medical (eboomedical.com)". */
  sourceName: string;
  /** Canonical URL of the original article. */
  sourceUrl: string;
  /** Optional note clarifying adaptation, shown in the citation block. */
  note?: string;
};

export type LearnArticle = {
  slug: string;
  kind: "pillar" | "spoke" | "external";
  category: string;
  title: string;
  /** Short SEO/meta + hub-card description. */
  excerpt: string;
  /** H1-adjacent deck shown under the title in the hero. */
  deck: string;
  readMinutes: number;
  updated: string; // ISO date
  /** For spokes: the questionnaire condition value to prefill the quiz. */
  conditionValue?: string;
  sections: LearnSection[];
  faqs: LearnFaq[];
  /** Slugs of related articles to cross-link. */
  related: string[];
  /** Optional attribution when the article is adapted from an external source. */
  byline?: LearnByline;
};

const UPDATED = "2026-06-19";

export const PILLARS: LearnArticle[] = [
  {
    slug: "ebo3-eboo-blood-therapy",
    kind: "pillar",
    category: "Foundations",
    title: "What Is EBO3 / EBOO Blood Therapy?",
    excerpt:
      "A plain-language guide to extracorporeal blood oxygenation and ozonation (EBOO) and the advanced EBO3 protocol that adds whole-blood filtration and UVBI.",
    deck:
      "How dialysis-style ozone therapy filters, oxygenates, ozonates, and irradiates your blood outside the body — and what makes EBO3 different.",
    readMinutes: 8,
    updated: UPDATED,
    sections: [
      {
        heading: "The short version",
        body: [
          "EBOO — extracorporeal blood oxygenation and ozonation — is a dialysis-style therapy in which blood is continuously drawn from one arm, treated outside the body, and returned to the other. Unlike a single ozone injection, the blood is processed in a closed loop so that a large volume can be treated in one controlled session.",
          "EBO3 is an advanced form of that protocol. In addition to oxygenation and ozonation, EBO3 adds whole-blood filtration through a high-flux dialyzer membrane and a stage of ultraviolet blood irradiation (UVBI). The intent is a more comprehensive systemic reset within a single closed-loop session.",
        ],
      },
      {
        heading: "What happens during a session",
        body: [
          "After two IV lines are placed by a clinician, blood flows into a sterile single-use circuit. It passes through a filter that captures inflammatory debris and oxidized material, then through an oxygen-ozone exchange, then through a UVBI light chamber, before the treated, oxygen-rich blood is returned. The cycle is continuous and monitored throughout.",
          "A typical EBO3 session runs about 45–120 minutes depending on whether you choose to treat roughly 3, 4.5, or 6 litres of blood volume. The volume is a clinical decision made with the care team during screening.",
        ],
      },
      {
        heading: "EBOO, EBO2, EBO3 — what the names mean",
        body: [
          "The terminology in this field is not standardized across clinics, which causes confusion. In broad terms, EBOO and EBO2 describe extracorporeal blood ozonation/oxygenation at different ozone concentrations and flow approaches, while EBO3 is used here to describe a protocol that also incorporates whole-blood filtration and UVBI in the same loop.",
          "Because there is no universal regulatory definition, the most useful question is not the label but the specifics: how much blood is treated, is the blood filtered, is UVBI included, and what device and safety systems are used.",
        ],
      },
      {
        heading: "Is it proven? An honest framing",
        body: [
          "EBOO and EBO3 are best understood as investigational, research-stage wellness therapies. They are not FDA-approved to diagnose, treat, cure, or prevent any disease, and individual responses vary. Much of the available information is mechanistic or preliminary rather than the product of large randomized trials.",
          "That is why a responsible program leads with screening and informed consent rather than promises. The right next step is a consultation in which a clinician reviews your history and explains what is and is not known.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is EBO3 the same as an ozone IV?",
        a: "No. An ozone IV (such as MAH/ozone autohemotherapy) treats a small fixed amount of blood in a bag. EBO3 is a continuous, dialysis-style loop that treats a far larger volume and adds filtration and UVBI.",
      },
      {
        q: "How many sessions are typical?",
        a: "It varies by person and goal. Many programs use a series rather than a single session; your clinician will discuss a plan during consultation. We do not promise a fixed outcome.",
      },
      {
        q: "Is it safe?",
        a: "EBO3 has a defined screening process and absolute/relative contraindications (for example, G6PD deficiency is an absolute contraindication). See our EBO3/EBOO treatment page for the full safety and contraindication detail.",
      },
    ],
    related: ["uvbi-ultraviolet-blood-irradiation", "eboo-comparison-guide", "plasmapheresis-tpe"],
  },
  {
    slug: "uvbi-ultraviolet-blood-irradiation",
    kind: "pillar",
    category: "Foundations",
    title: "UVBI Explained: Ultraviolet Blood Irradiation",
    excerpt:
      "What ultraviolet blood irradiation (UVBI) is, how it is combined with ozone in EBO3, and what the research does and does not say.",
    deck:
      "Sometimes called UBI or photoluminescence therapy, UVBI exposes blood to ultraviolet light. Here is how it fits into modern EBO3 protocols.",
    readMinutes: 7,
    updated: UPDATED,
    sections: [
      {
        heading: "What UVBI is",
        body: [
          "Ultraviolet blood irradiation (UVBI), also called ultraviolet blood irradiation therapy or UBI, exposes blood to ultraviolet light outside the body. The technique has a long history dating to the early-to-mid twentieth century and has seen renewed interest as part of integrative and research-stage protocols.",
          "In EBO3, UVBI is not a standalone treatment — it is one stage inside the closed loop. After the blood is filtered and charged with an oxygen-ozone mixture, it passes through a multi-lamp UV light chamber before being returned.",
        ],
      },
      {
        heading: "Why it is combined with ozone",
        body: [
          "The rationale for pairing UVBI with ozonation is that the two are different photo-oxidative and oxidative inputs that some practitioners believe may be complementary. The EBO3 platform integrates a 5-lamp UVBI chamber so both can be delivered in one continuous session rather than as separate appointments.",
          "It is important to be precise here: combining modalities is a protocol design choice, not a guarantee of added benefit. The clinical evidence for UVBI specifically remains limited and largely preliminary.",
        ],
      },
      {
        heading: "What the evidence does and does not show",
        body: [
          "Interest in UVBI is driven by historical use and mechanistic hypotheses around immune modulation and microbial inactivation. However, high-quality modern randomized controlled trials are scarce, and UVBI is not an FDA-approved therapy for any specific disease.",
          "A trustworthy clinic will present UVBI as investigational, explain the reasoning, and avoid disease-cure claims. Treat any source that promises guaranteed results with appropriate skepticism.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is UVBI the same as a UV light box on the skin?",
        a: "No. UVBI exposes blood to UV light within the extracorporeal circuit, not your skin. In EBO3 it happens inside the sealed single-use loop.",
      },
      {
        q: "Can I get UVBI without ozone?",
        a: "In the EBO3 protocol, UVBI is integrated with filtration and ozonation as one session. Your clinician can explain the configuration options during consultation.",
      },
    ],
    related: ["ebo3-eboo-blood-therapy", "eboo-comparison-guide"],
  },
  {
    slug: "plasmapheresis-tpe",
    kind: "pillar",
    category: "Foundations",
    title: "Plasmapheresis & Therapeutic Plasma Exchange (TPE)",
    excerpt:
      "How therapeutic plasma exchange separates and replaces plasma to reduce circulating inflammatory and toxic load — and how it differs from EBO3.",
    deck:
      "A guide to plasmapheresis: what plasma exchange removes, the clinical path, and how it compares with blood ozone therapy.",
    readMinutes: 7,
    updated: UPDATED,
    sections: [
      {
        heading: "What plasmapheresis does",
        body: [
          "Plasmapheresis, in its therapeutic plasma exchange (TPE) form, separates the liquid plasma from your blood cells, removes a portion of that plasma along with substances dissolved in it, and returns your cells with a replacement fluid. The goal is to reduce the circulating load of inflammatory mediators, antibodies, and certain toxins.",
          "Where EBO3 treats the blood in place by filtering, oxygenating, and irradiating it, plasmapheresis physically removes and replaces plasma. The two approaches address overlapping goals through different mechanisms, which is why some programs offer both.",
        ],
      },
      {
        heading: "The clinical path",
        body: [
          "A plasmapheresis program generally follows a path of evaluation and screening, the exchange procedure itself, monitoring, and follow-up. Sessions are performed by licensed clinicians with appropriate monitoring, and candidacy is determined individually.",
          "As with EBO3, plasmapheresis offered in a wellness setting is investigational for general health optimization and is not a substitute for medically indicated apheresis prescribed for specific diagnoses.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is plasmapheresis better than EBO3?",
        a: "Neither is universally 'better' — they work differently. The right choice depends on your goals and clinical picture, which is what the consultation and eligibility screening are for.",
      },
      {
        q: "Can I do both?",
        a: "Some patients are candidates for a combined plan. This is a clinical decision made with the care team.",
      },
    ],
    related: ["ebo3-eboo-blood-therapy", "eboo-comparison-guide"],
  },
  {
    slug: "eboo-comparison-guide",
    kind: "pillar",
    category: "Comparisons",
    title: "EBOO vs EBO2 vs EBO3 vs Ozone IV: A Comparison Guide",
    excerpt:
      "A clear comparison of the main blood-ozone and blood-therapy options, what distinguishes each, and how to think about which to ask about.",
    deck:
      "The labels overlap and the marketing is noisy. Here is a calm, side-by-side way to understand your options.",
    readMinutes: 9,
    updated: UPDATED,
    sections: [
      {
        heading: "Why the names are confusing",
        body: [
          "Because there is no single regulatory standard for these therapies, clinics use terms like EBOO, EBO2, EBO3, ozone autohemotherapy, and ozone IV in inconsistent ways. The practical differences come down to a few questions: how much blood is treated, whether the blood is filtered, whether UVBI is included, and the device and safety systems used.",
          "Rather than fixating on a label, use those questions to compare any two offerings on equal terms.",
        ],
      },
      {
        heading: "The practical distinctions",
        body: [
          "An ozone IV or major autohemotherapy (MAH) treats a small fixed volume of blood that is mixed with ozone and reinfused — simple and quick, but limited in volume. Extracorporeal approaches (EBOO/EBO2) run blood through a continuous circuit so that a much larger volume can be oxygenated and ozonated in one session.",
          "EBO3, as used here, extends the extracorporeal approach by adding whole-blood filtration through a high-flux membrane and an integrated UVBI stage. Plasmapheresis is different again: it removes and replaces plasma rather than treating the blood in place.",
        ],
      },
      {
        heading: "How to decide what to ask about",
        body: [
          "The most useful step is a consultation in which a clinician maps your goals and health history to the options and explains the trade-offs honestly. No responsible clinic should tell you which therapy is 'best' before understanding your situation.",
          "Our eligibility quiz is a quick first step that helps the care team understand what you are trying to address before that conversation.",
        ],
      },
    ],
    faqs: [
      {
        q: "Which one treats the most blood?",
        a: "Extracorporeal approaches (EBOO/EBO2/EBO3) treat far more blood per session than an ozone IV/MAH, because the blood flows through a continuous loop rather than a single bag.",
      },
      {
        q: "Which one includes UVBI?",
        a: "UVBI is integrated in the EBO3 protocol via a 5-lamp light chamber. Ozone IVs and basic EBOO setups typically do not include UVBI.",
      },
    ],
    related: ["ebo3-eboo-blood-therapy", "uvbi-ultraviolet-blood-irradiation", "plasmapheresis-tpe"],
  },
];

export const SPOKES: LearnArticle[] = [
  {
    slug: "eboo-for-long-covid",
    kind: "spoke",
    category: "Conditions",
    title: "EBO3 / EBOO and Long COVID: What to Know",
    excerpt:
      "How blood ozone therapy is being explored for the lingering fatigue, brain fog, and microvascular issues associated with Long COVID.",
    deck: "Why post-viral microclots and microvascular inflammation have drawn attention to extracorporeal blood therapy.",
    readMinutes: 6,
    updated: UPDATED,
    conditionValue: "Long COVID",
    sections: [
      {
        heading: "The Long COVID picture",
        body: [
          "Long COVID is associated in the research literature with persistent fatigue, cognitive 'brain fog', breathlessness, and signs of microvascular inflammation and microclotting. These features are part of why some clinicians have looked at therapies that act on circulation and inflammation.",
          "EBO3 is being explored in this context because it filters, oxygenates, and irradiates a large blood volume in one session. It is important to state plainly that this is investigational: EBO3 is not an approved treatment for Long COVID, and evidence is preliminary.",
        ],
      },
      {
        heading: "A measured next step",
        body: [
          "If you are dealing with post-viral symptoms, the responsible path is screening and consultation rather than self-directed treatment. Our eligibility quiz captures your symptoms and history so the care team can advise honestly on whether EBO3 is reasonable to consider for you.",
        ],
      },
    ],
    faqs: [
      {
        q: "Will EBO3 cure my Long COVID?",
        a: "No one can promise that. EBO3 is investigational and not approved to treat Long COVID. A consultation will give you an honest, individualized assessment.",
      },
    ],
    related: ["ebo3-eboo-blood-therapy", "uvbi-ultraviolet-blood-irradiation"],
  },
  {
    slug: "eboo-for-lyme-disease",
    kind: "spoke",
    category: "Conditions",
    title: "EBO3 / EBOO and Lyme & Tick-Borne Load",
    excerpt: "How extracorporeal blood therapy is being explored for chronic tick-borne illness and immune load.",
    deck: "Chronic Lyme and co-infections are complex. Here is a careful look at where blood therapy fits the conversation.",
    readMinutes: 6,
    updated: UPDATED,
    conditionValue: "Lyme Disease",
    sections: [
      {
        heading: "Why blood therapy is discussed for tick-borne illness",
        body: [
          "Chronic tick-borne illness can involve persistent immune activation and inflammation. Integrated protocols that combine oxygenation, ozonation, and UVBI are explored on the hypothesis that they may help reduce circulating microbial and inflammatory load while the immune system recovers.",
          "This is an area with strong opinions and limited high-quality evidence. EBO3 is not an approved treatment for Lyme disease, and it should be considered only as part of a broader, clinician-led plan.",
        ],
      },
      {
        heading: "Start with screening",
        body: [
          "Because tick-borne illness is complex and often co-managed, the first step is a consultation and eligibility screening so the care team understands your full picture.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is this a replacement for antibiotics or my Lyme specialist?",
        a: "No. EBO3 is investigational and is not a substitute for care from your treating physician. Always coordinate with your existing providers.",
      },
    ],
    related: ["ebo3-eboo-blood-therapy", "uvbi-ultraviolet-blood-irradiation"],
  },
  {
    slug: "eboo-for-autoimmune",
    kind: "spoke",
    category: "Conditions",
    title: "EBO3 / EBOO and Autoimmune Conditions",
    excerpt: "How blood therapy is being explored for immune modulation in autoimmune-related concerns.",
    deck: "The goal discussed in this space is recalibration, not broad suppression. Here is a balanced overview.",
    readMinutes: 6,
    updated: UPDATED,
    conditionValue: "Autoimmune",
    sections: [
      {
        heading: "The immune-modulation rationale",
        body: [
          "Autoimmune conditions involve the immune system attacking the body's own tissue. Some practitioners explore extracorporeal blood therapies on the hypothesis that controlled oxidative and photo-oxidative inputs may help modulate an overactive inflammatory response without broad immunosuppression.",
          "This is a hypothesis-driven, investigational use. EBO3 is not approved to treat any autoimmune disease, and anyone with autoimmune disease should involve their treating specialist.",
        ],
      },
      {
        heading: "A coordinated approach",
        body: [
          "If you live with an autoimmune condition, screening matters even more, because some situations call for caution. The eligibility quiz and consultation exist precisely to make that assessment carefully.",
        ],
      },
    ],
    faqs: [
      {
        q: "Could this make my autoimmune condition worse?",
        a: "Any immune-modulating approach must be assessed individually. That is why screening and clinician oversight are required before considering EBO3.",
      },
    ],
    related: ["ebo3-eboo-blood-therapy", "plasmapheresis-tpe"],
  },
  {
    slug: "eboo-for-cardiovascular",
    kind: "spoke",
    category: "Conditions",
    title: "EBO3 / EBOO and Cardiovascular & Circulation",
    excerpt: "How blood ozone therapy is being explored for circulation, blood pressure, and vascular health.",
    deck: "Oxygen delivery, oxidative load, and endothelial function — why circulation is a focus of interest.",
    readMinutes: 6,
    updated: UPDATED,
    conditionValue: "Cardiovascular",
    sections: [
      {
        heading: "The circulation rationale",
        body: [
          "Cardiovascular health depends on clean oxygen delivery and healthy blood vessels. The interest in EBO3 here centers on the idea that improved oxygenation and reduced oxidative and inflammatory load may support endothelial function and microcirculation.",
          "These are mechanistic hypotheses. EBO3 is not an approved cardiovascular treatment and is not a substitute for cardiology care, medication, or lifestyle change.",
        ],
      },
      {
        heading: "Screening first",
        body: [
          "Cardiovascular history is exactly the kind of information the eligibility screening is designed to capture, so the care team can advise safely.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I stop my blood pressure medication?",
        a: "Never stop prescribed medication on your own. EBO3 is not a replacement for cardiovascular care; coordinate with your physician.",
      },
    ],
    related: ["ebo3-eboo-blood-therapy"],
  },
  {
    slug: "eboo-for-chronic-fatigue",
    kind: "spoke",
    category: "Conditions",
    title: "EBO3 / EBOO and Chronic Fatigue",
    excerpt: "How blood therapy is being explored for persistent low energy and brain fog.",
    deck: "When inflammatory drag and poor oxygen delivery weigh on energy and cognition.",
    readMinutes: 5,
    updated: UPDATED,
    conditionValue: "Chronic Fatigue",
    sections: [
      {
        heading: "Energy, oxygen, and inflammation",
        body: [
          "Persistent fatigue and brain fog can have many causes. The hypothesis explored with EBO3 is that improving oxygen delivery and lowering inflammatory and oxidative load may, in some people, support energy and cognition.",
          "This remains investigational and individual. A proper evaluation should rule out treatable causes of fatigue before any wellness therapy is considered.",
        ],
      },
      {
        heading: "Begin with the quiz",
        body: [
          "Our eligibility quiz captures your energy-related symptoms and history so the care team can give honest guidance.",
        ],
      },
    ],
    faqs: [
      {
        q: "How quickly would I notice anything?",
        a: "Responses vary widely and are not guaranteed. We avoid promising timelines; your clinician will set realistic expectations.",
      },
    ],
    related: ["ebo3-eboo-blood-therapy", "eboo-for-long-covid"],
  },
  {
    slug: "eboo-for-mold-and-toxins",
    kind: "spoke",
    category: "Conditions",
    title: "EBO3 / EBOO and Mold / Toxin Load",
    excerpt: "How blood therapy is being explored for mycotoxin and environmental toxin burden.",
    deck: "Mycotoxins, heavy metals, and oxidized compounds — and why detox claims need a careful, honest framing.",
    readMinutes: 5,
    updated: UPDATED,
    conditionValue: "Mold / Toxin",
    sections: [
      {
        heading: "The detox conversation, honestly",
        body: [
          "'Detox' is a heavily over-marketed word. In a careful framing, the interest in EBO3 for mold and toxin load rests on the idea that filtration and controlled oxidation may support the clearance of certain circulating compounds. That is a mechanistic hypothesis, not a proven cure.",
          "Genuine environmental-illness care is multi-faceted — source removal, medical evaluation, and supportive measures. EBO3 would only ever be one part of a clinician-led plan, and it is investigational.",
        ],
      },
      {
        heading: "Screen before you treat",
        body: [
          "Because toxin-related illness overlaps with many other conditions, screening and consultation are the right first step.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does EBO3 remove heavy metals?",
        a: "We do not make removal claims. The mechanism is hypothesized to support clearance of some compounds, but this is investigational and individual.",
      },
    ],
    related: ["ebo3-eboo-blood-therapy"],
  },
  {
    slug: "eboo-for-longevity",
    kind: "spoke",
    category: "Conditions",
    title: "EBO3 / EBOO and Longevity & Performance",
    excerpt: "How blood therapy is being explored within longevity and performance-optimization programs.",
    deck: "Biological-age markers, repair signaling, and the appeal — and limits — of optimization framing.",
    readMinutes: 5,
    updated: UPDATED,
    conditionValue: "Longevity",
    sections: [
      {
        heading: "Where longevity interest comes from",
        body: [
          "Longevity-focused individuals are drawn to EBO3 on the hypothesis that lowering oxidative and inflammatory burden and improving oxygen delivery may support repair signaling and markers associated with biological aging.",
          "This is the most speculative use of all, and the one where honest framing matters most. EBO3 is not proven to extend lifespan or reverse aging; it is an investigational input some people choose to explore as part of a broader healthspan program.",
        ],
      },
      {
        heading: "A data-informed plan",
        body: [
          "Longevity work is best done with baseline testing and clear goals. The consultation is where that plan — if any — is built responsibly.",
        ],
      },
    ],
    faqs: [
      {
        q: "Will this make me live longer?",
        a: "There is no evidence to claim that, and we will not. EBO3 is investigational; we focus on honest expectations, not anti-aging promises.",
      },
    ],
    related: ["ebo3-eboo-blood-therapy", "eboo-comparison-guide"],
  },
];

/**
 * Curated third-party research & publications, surfaced in the Learning Center
 * as references. These are NOT rEBOOtBlood studies and are provided for
 * education only; listing them is not an efficacy claim. Each links to the
 * original source document.
 */
/**
 * Date our care team last verified the citation details and framing of the
 * publications list. Update this single constant whenever the list is reviewed;
 * individual entries may override it via the optional `lastReviewed` field.
 */
export const PUBLICATIONS_LAST_REVIEWED = "2026-06-18";

export type Publication = {
  title: string;
  authors: string;
  /** ISO date (YYYY-MM-DD) this entry was last reviewed; falls back to PUBLICATIONS_LAST_REVIEWED. */
  lastReviewed?: string;
  venue: string; // journal + year
  summary: string;
  url: string;
  topic: string;
};

export const PUBLICATIONS: Publication[] = [
  {
    title: "A Plausible \u201cPenny\u201d Costing Effective Treatment for Corona Virus \u2014 Ozone Therapy",
    authors: "Rowen RJ, Robins H",
    venue: "Journal of Infectious Diseases and Epidemiology, 2020",
    summary:
      "A commentary proposing that, because many viruses (including SARS-CoV-2) depend on oxidation-sensitive sulfhydryl groups, ozone\u2019s oxidative action may exploit that vulnerability. Hypothesis-generating commentary, not a clinical trial.",
    url: "https://www.ozonedoctor.net/wp-content/uploads/2022/02/Corona-Published.pdf",
    topic: "Antiviral mechanism",
  },
  {
    title: "Rapid Resolution of Hemorrhagic Fever (Ebola) in Sierra Leone with Ozone Therapy",
    authors: "Rowen RJ, Robins H, Carew K, Kamara MM, Jalloh MI",
    venue: "African Journal of Infectious Diseases, 2016",
    summary:
      "A small consecutive case series (five patients) reporting symptom remission after ozone therapy during the West African Ebola outbreak. A preliminary field report with no control group; interpret with caution.",
    url: "https://www.ozonedoctor.net/wp-content/uploads/2022/02/ebola-ozone-rowen.pdf",
    topic: "Antiviral case series",
  },
  {
    title: "Benefits of Functional Medicine for Mold Toxicity and Mixed Mold Mycotoxicosis",
    authors: "Robins HF",
    venue: "Online Journal of Complementary & Alternative Medicine, 2020",
    summary:
      "A mini-review of mixed mold mycotoxicosis and integrative treatment strategies, including a case treated with direct intravenous ozone therapy. Narrative review plus single-case observation.",
    url: "https://www.ozonedoctor.net/wp-content/uploads/2022/01/147281.pdf",
    topic: "Mold / toxin load",
  },
  {
    title: "Beneficial Effect of a Juice-Based Probiotic for Colon Health",
    authors: "Robins HF, Kamarei AR",
    venue: "Journal of Gastroenterology Research, 2020",
    summary:
      "A post-marketing surveillance study of a juice-based probiotic/synbiotic, noting relevance to gut support including during ozone therapy. Self-reported questionnaire data from 80 users.",
    url: "https://www.ozonedoctor.net/wp-content/uploads/2022/02/Beneficial-effect.pdf",
    topic: "Gut & microbiome",
  },
  {
    title: "Clostridioides difficile Inhibition by DBCH Bioactive Compounds",
    authors: "Robins HF, et al.",
    venue: "Laboratory study",
    summary:
      "A laboratory report describing inhibition of C. difficile colony formation by bioactive compounds in a juice-based probiotic. In-vitro work, not a human clinical trial.",
    url: "https://www.ozonedoctor.net/wp-content/uploads/2022/02/C-difficle-paper.pdf",
    topic: "Gut & microbiome",
  },
  {
    title: "Successful Ozone Treatment of EBV and HSV-Related Viral Urticaria",
    authors: "Manfredi G, Apuzzo D",
    venue: "Frontiers in Medical Case Reports, 2020",
    summary:
      "A two-patient case report describing improvement in viral-related chronic urticaria/angioedema after a course of small ozonized autohemotherapy, framed around ozone\u2019s proposed antiviral action. A small, uncontrolled case report.",
    url: "https://www.jmedicalcasereports.org/uploads/178/7211_pdf.pdf",
    topic: "Antiviral case report",
  },
  {
    title: "Bio-Oxidative Therapy: An Alternative Therapeutic Approach for Podiatrists (White Paper)",
    authors: "Robins HF",
    venue: "White paper",
    summary:
      "An overview white paper on oxygen-ozone (bio-oxidative) therapy, its proposed mechanisms and applications, written for clinicians. Educational overview, not a controlled study.",
    url: "https://www.ozonedoctor.net/wp-content/uploads/2022/05/Bio-Oxidative-Therapy-for-Podiatrists-for-website.pdf",
    topic: "Foundations / mechanism",
  },
  {
    title: "Modulation of Oxidative Stress by Ozone Therapy in the Prevention and Treatment of Chemotherapy-Induced Toxicity",
    authors: "Clavo B, Rodríguez-Esparragón F, Rodríguez-Abreu D, et al.",
    venue: "Antioxidants (Basel), 2019",
    summary:
      "A review of the proposed rationale for ozone therapy as an adjunct that may modulate oxidative stress and reduce chemotherapy-induced toxicity. A narrative review and prospects piece, not a clinical trial of cancer treatment.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6943601/",
    topic: "Oxidative stress / oncology support",
  },
  {
    title: "Ozone Therapy Effects on Biomarkers and Lung Function in Asthma",
    authors: "Hernández Rosales FA, Calunga Fernández JL, Turrent Figueras J, et al.",
    venue: "Archives of Medical Research, 2005",
    summary:
      "A study reporting reductions in IgE and inflammatory markers and improved lung-function/symptom scores in atopic asthma patients across ozone therapy cycles. Small, uncontrolled clinical study; interpret as exploratory.",
    url: "https://pubmed.ncbi.nlm.nih.gov/16099337/",
    topic: "Respiratory / immune modulation",
  },
  {
    title: "Clinical Utility of Ozone Therapy for Musculoskeletal Disorders",
    authors: "Seyam O, Smith NL, Reid I, et al.",
    venue: "Medical Gas Research, 2018",
    summary:
      "A review surveying applications of oxygen-ozone therapy for musculoskeletal and pain conditions and its proposed anti-inflammatory and analgesic mechanisms. A narrative review summarizing heterogeneous evidence.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6178642/",
    topic: "Musculoskeletal / pain",
  },
  {
    title: "Ozone Therapy for Complex Regional Pain Syndrome: Review and Case Report",
    authors: "Rowen RJ, Robins H",
    venue: "Current Pain and Headache Reports, 2019",
    summary:
      "A review of ozone therapy in complex regional pain syndrome accompanied by a single case report. Hypothesis-generating; a case report cannot establish efficacy.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6502773/",
    topic: "Musculoskeletal / pain",
  },
  {
    title: "Ozone Therapy for the Treatment of COVID-19 Pneumonia: A Scoping Review",
    authors: "Izadi M, Cegolon L, Javanbakht M, et al.",
    venue: "International Immunopharmacology, 2021",
    summary:
      "A scoping review mapping early reports on ozone therapy as an adjunct in COVID-19 pneumonia and calling for controlled trials. Summarizes preliminary, mostly low-quality evidence; not a treatment recommendation.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7752030/",
    topic: "Antiviral / respiratory",
  },
  {
    title: "Oxygen-Ozone (O2-O3) Therapy in Peripheral Arterial Disease (PAD): A Review Study",
    authors: "Juchniewicz H, Lubkowska A",
    venue: "Therapeutics and Clinical Risk Management, 2020",
    summary:
      "A review of oxygen-ozone therapy as a proposed adjunct in peripheral arterial disease, discussing possible effects on tissue oxygenation and healing. A narrative review of limited primary studies.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7334138/",
    topic: "Circulation / vascular",
  },
];

/**
 * SEO landing articles built around high-intent search queries (EBOO/EBO2
 * therapy, "blood oil change"). They are routable at /learn/:slug and emit
 * Article + FAQ JSON-LD via ArticleLayout, but are surfaced through a dedicated
 * "Popular questions" row on the hub rather than the Foundations/Conditions
 * grids.
 */
export const SEO_ARTICLES: LearnArticle[] = [
  {
    slug: "what-is-eboo-therapy",
    kind: "pillar",
    category: "Explainers",
    title: "What Is EBOO Therapy? How EBO3 Ozone Blood Treatment Works",
    excerpt:
      "What is EBOO therapy? Learn how EBO3 ozone blood treatment filters and oxygenates blood, what a session involves, and who it may help.",
    deck: "A plain-language explainer of EBOO / EBO3 ozone blood therapy — what it is, how a session works, and how to think about it honestly.",
    readMinutes: 6,
    updated: UPDATED,
    sections: [
      {
        heading: "What EBOO therapy is",
        body: [
          "EBOO — extracorporeal blood oxygenation and ozonation — is a dialysis-style therapy in which blood is drawn from one arm, treated outside the body in a continuous closed loop, and returned to the other. Because the blood flows in a loop rather than a single bag, a large volume can be treated in one controlled session. People also search for it as EBO2 therapy, EBO3, or informally a ‘blood oil change.’",
          "EBO3, the protocol we use, extends EBOO by adding whole-blood filtration through a high-flux dialyzer membrane and an integrated stage of ultraviolet blood irradiation (UVBI) — oxygenation, ozonation, filtration, and UV exposure in one session.",
        ],
      },
      {
        heading: "What happens during an EBOO session",
        body: [
          "After a clinician places two IV lines, blood passes through a sterile single-use circuit: a filter captures inflammatory debris and oxidized material, an oxygen-ozone exchange charges the blood, and a UVBI light chamber applies ultraviolet exposure before the oxygen-rich blood is returned. The cycle is continuous and monitored throughout.",
          "A typical EBO3 session runs about 45–120 minutes depending on whether roughly 3, 4.5, or 6 litres of blood volume are treated — a clinical decision made with the care team during screening.",
        ],
      },
      {
        heading: "Who EBOO therapy may help — and an honest framing",
        body: [
          "Interest in EBOO/EBO3 centers on inflammation, immune balance, circulation, post-viral symptoms, and general wellness optimization. It is important to be clear that these are investigational, research-stage wellness therapies: they are not FDA-approved to diagnose, treat, cure, or prevent any disease, and individual responses vary.",
          "The responsible next step is screening and consultation rather than self-directed treatment. Our eligibility quiz captures your history and goals so the care team can advise honestly.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is EBOO therapy in simple terms?",
        a: "EBOO is a dialysis-style ozone blood therapy: blood is drawn, filtered, oxygenated, ozonated (and in EBO3, exposed to UVBI) outside the body in a continuous loop, then returned. It treats a much larger blood volume than an ozone IV.",
      },
      {
        q: "How long does an EBOO session take?",
        a: "A typical EBO3 / EBOO session runs about 45–120 minutes depending on whether 3L, 4.5L, or 6L of blood volume is treated, with continuous monitoring throughout.",
      },
      {
        q: "Is EBOO therapy FDA-approved?",
        a: "No. EBOO, EBO2, ozone, and UVBI therapies are not FDA-approved to diagnose, treat, cure, or prevent any disease. They are offered as investigational wellness procedures after screening and informed consent.",
      },
    ],
    related: ["eboo-comparison-guide", "ebo3-eboo-blood-therapy", "blood-oil-change"],
  },
  {
    slug: "ebo2-vs-eboo",
    kind: "pillar",
    category: "Comparisons",
    title: "EBO2 vs EBOO vs EBO3: What's the Difference?",
    excerpt:
      "EBO2 vs EBOO vs EBO3 explained — how the ozone blood therapy tiers differ in volume, filtration, and UVBI, and which may be right for you.",
    deck: "The labels overlap and the marketing is noisy. Here is a calm, side-by-side way to understand EBO2, EBOO, and EBO3.",
    readMinutes: 5,
    updated: UPDATED,
    sections: [
      {
        heading: "Why the names overlap",
        body: [
          "There is no single regulatory standard for these therapies, so clinics use ‘EBOO,’ ‘EBO2,’ and ‘EBO3’ inconsistently. In broad terms, EBOO and EBO2 describe extracorporeal blood oxygenation and ozonation at different ozone concentrations and flow configurations, while EBO3 is used here for a protocol that also adds whole-blood filtration and UVBI in the same loop.",
          "Rather than fixating on the label, the useful questions are: how much blood is treated, is the blood filtered, is UVBI included, and what device and safety systems are used?",
        ],
      },
      {
        heading: "EBO2 vs EBOO vs EBO3, side by side",
        body: [
          "EBO2 typically refers to extracorporeal ozonation at a higher gamma (ozone concentration) range. EBOO is the broader extracorporeal oxygenation-and-ozonation approach. Our device supports both an EBOO mode (about 3–5 gamma) and an EBO2 mode (about 20–30 gamma), across a full adjustable 1–35 gamma range.",
          "EBO3 is the most comprehensive tier: it keeps the continuous extracorporeal loop and adds high-flux whole-blood filtration plus a 5-lamp UVBI light chamber, so filtration, oxygenation, ozonation, and UV exposure all happen in one session.",
        ],
      },
      {
        heading: "Which tier is right for you",
        body: [
          "The right tier depends on your goals, your health history, and a clinician's assessment — not on the name alone. No responsible clinic should tell you which is ‘best’ before understanding your situation.",
          "Our eligibility quiz is a quick first step that helps the care team recommend a volume and protocol during your consultation.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the difference between EBO2 and EBOO?",
        a: "Both are extracorporeal blood ozonation/oxygenation; EBO2 generally refers to a higher ozone-concentration (gamma) configuration, while EBOO is the broader term. Our platform supports an EBOO mode (~3–5 gamma) and an EBO2 mode (~20–30 gamma).",
      },
      {
        q: "Is EBO3 better than EBO2 or EBOO?",
        a: "EBO3 is the most comprehensive tier because it adds whole-blood filtration and UVBI to the loop, but ‘better’ depends on your goals and clinical picture. The volume and protocol are chosen with your care team.",
      },
      {
        q: "Which one includes UVBI?",
        a: "UVBI is integrated in the EBO3 protocol via a 5-lamp light chamber. Basic EBOO/EBO2 setups and ozone IVs typically do not include UVBI.",
      },
    ],
    related: ["eboo-comparison-guide", "what-is-eboo-therapy", "ebo3-eboo-blood-therapy"],
  },
  {
    slug: "blood-oil-change",
    kind: "spoke",
    category: "Explainers",
    title: 'Is a "Blood Oil Change" Real? EBOO Ozone Therapy Explained',
    excerpt:
      'A “blood oil change” is the nickname for EBOO ozone blood therapy. Here is what it actually is, what it costs, and how to consider it.',
    deck: 'The viral nickname, explained — what people mean by a “blood oil change,” and what the actual procedure (EBOO / EBO3) involves.',
    readMinutes: 4,
    updated: UPDATED,
    sections: [
      {
        heading: 'Where the “blood oil change” nickname comes from',
        body: [
          'You may have seen the phrase “blood oil change” (or “human blood oil change”) on social media. It is a colloquial nickname — not a medical term — for EBOO / EBO3 ozone blood therapy, where blood is filtered, oxygenated, and ozonated outside the body and then returned. The ‘oil change’ metaphor refers to the visible filtration of the blood, not to any actual oil.',
          'The real procedure is a dialysis-style closed-loop therapy performed under clinical supervision. It is the same thing people search for as EBOO treatment, EBO2 therapy, or EBO3.',
        ],
      },
      {
        heading: 'What the procedure actually does',
        body: [
          'In an EBO3 session, blood passes through a high-flux filter, an oxygen-ozone exchange, and a UVBI light chamber in a continuous loop before being returned. A typical session treats about 3–6 litres of blood volume over roughly 45–120 minutes, fully monitored.',
          'It is best understood as an investigational wellness therapy: it is not FDA-approved to treat any disease, and claims of a dramatic ‘detox’ should be read with healthy skepticism.',
        ],
      },
      {
        heading: 'What it costs and how to consider it',
        body: [
          'EBOO / EBO3 is self-pay and priced by treated blood volume — single sessions start around $1,000, with multi-session packages reducing the per-session cost. See our EBOO cost page for the full breakdown.',
          'If you are curious, the sensible path is a screening and consultation rather than chasing a viral trend. Our eligibility quiz is a fast first step.',
        ],
      },
    ],
    faqs: [
      {
        q: "Is a 'blood oil change' a real medical procedure?",
        a: "‘Blood oil change’ is a social-media nickname for EBOO / EBO3 ozone blood therapy — a real, clinically supervised dialysis-style procedure that filters, oxygenates, and ozonates blood. The nickname is informal, not a medical term.",
      },
      {
        q: "How much does a 'blood oil change' (EBOO) cost?",
        a: "EBOO / EBO3 is self-pay and priced by blood volume — single sessions start around $1,000, with packages lowering the per-session cost. See our EBOO cost page for current pricing.",
      },
      {
        q: "Is it safe?",
        a: "It has a defined screening process and contraindications (for example, G6PD deficiency is an absolute contraindication) and is performed under clinical monitoring. It remains investigational and is not FDA-approved to treat disease.",
      },
    ],
    related: ["what-is-eboo-therapy", "eboo-comparison-guide", "ebo3-eboo-blood-therapy"],
  },
];

/**
 * Articles adapted from third-party explainers into rEBOOtBlood's non-claim,
 * educational voice. The topic and useful background are retained, but strong
 * efficacy/marketing claims are softened to "proponents report / evidence is
 * limited," competitor and clinic names are removed, and the standard
 * educational disclaimer applies. Each carries a `byline` crediting the
 * original author/source, rendered as a citation block by ArticleLayout.
 *
 * Source: EBOO Medical (eboomedical.com) editorial team — primarily Kim Look
 * (Regenerative Medicine Specialist), Jason DeLeon (EBOO Specialist), and
 * Ralph Montague (longevity author), with specific bylines where the original
 * post named one. Two off-brand source posts (one critical of EBOO and naming
 * a competing clinic; one promoting a specific overseas clinic) were
 * intentionally excluded.
 */
const EBOOMED = "EBOO Medical (eboomedical.com)";
const EXTERNAL_UPDATED = "2026-06-28";

export const EXTERNAL_ARTICLES: LearnArticle[] = [
  {
    slug: "does-eboo-really-work",
    kind: "external",
    category: "Explainers",
    title: "Does EBOO Treatment Really Work? Examining the Evidence",
    excerpt:
      "‘Does EBOO really work?’ is one of the most-searched questions about blood ozone therapy. Here is an honest look at the proposed mechanisms, what the research does and does not show, and how to think about it.",
    deck:
      "A measured look at the biological rationale behind EBOO, the state of the evidence, and why screening matters more than promises.",
    readMinutes: 7,
    updated: EXTERNAL_UPDATED,
    sections: [
      {
        heading: "What EBOO is designed to do",
        body: [
          "EBOO — extracorporeal blood oxygenation and ozonation — is an evolution of older ozone therapies that processes a larger volume of blood (commonly up to about 1.5 litres per session in basic configurations) through a controlled loop of oxygenation and ozonation before returning it to the body. Rather than a single injection, it is a continuous, monitored process.",
          "Proponents describe several proposed mechanisms: supporting mitochondrial energy production through improved oxygen delivery, modulating inflammation, improving the flow characteristics of blood and microcirculation, and stimulating the body’s own antioxidant systems through a controlled (hormetic) oxidative stimulus. These are hypotheses and observations from practitioners and laboratory work, not settled clinical fact.",
        ],
      },
      {
        heading: "What the research does — and does not — show",
        body: [
          "EBOO specifically has limited long-term clinical-trial data. The broader ozone-therapy literature reports laboratory and small-study signals — for example, changes in red-blood-cell flexibility, shifts in inflammatory markers such as IL-6 and TNF-α, and stimulation of antioxidant enzymes — but much of this evidence is preliminary, heterogeneous, or uncontrolled.",
          "It is important to be clear: EBOO, EBO2, ozone, and UVBI are not FDA-approved to diagnose, treat, cure, or prevent any disease. Reports of benefit, including patient testimonials, are not a substitute for controlled trials, and individual responses vary widely.",
        ],
      },
      {
        heading: "How to think about whether it is right for you",
        body: [
          "EBOO is best understood as an investigational wellness optimizer rather than a cure. Where it is considered, it is most reasonable as one strategic component within a broader, clinician-guided plan — alongside nutrition, sleep, stress management, and conventional care — not as a replacement for any of those.",
          "The responsible next step is a comprehensive evaluation: a clinician reviews your history, current status, and goals, and explains honestly what is and is not known. Our eligibility quiz is a quick first step before that conversation.",
        ],
      },
    ],
    faqs: [
      {
        q: "So does EBOO actually work?",
        a: "There is a plausible biological rationale and encouraging preliminary and anecdotal reports, but high-quality clinical-trial evidence for EBOO specifically is limited. It is investigational and not FDA-approved to treat any disease; honest expectations and clinician screening are essential.",
      },
      {
        q: "Is one session enough?",
        a: "Practitioners typically describe a series rather than a single session, because any cumulative effects are thought to build over a protocol. Your care team will discuss what, if anything, is reasonable for you — no fixed outcome is promised.",
      },
    ],
    related: ["what-is-eboo-therapy", "eboo-comparison-guide", "ebo3-eboo-blood-therapy"],
    byline: {
      author: "Kim Look",
      sourceName: EBOOMED,
      sourceUrl: "https://eboomedical.com/does-eboo-treatment-really-work/",
      note: "Adapted and edited into rEBOOtBlood’s non-claim, educational voice; efficacy language softened and patient/celebrity references removed.",
    },
  },
  {
    slug: "eboo-urinary-toxin-case-report",
    kind: "external",
    category: "Research notes",
    title: "Observed Reduction in Urinary Toxins After EBOO: A Case Report",
    excerpt:
      "A single published case report describes reductions in urinary mycotoxins, heavy metals, and environmental toxins after two EBOO treatment cycles. Here is a plain-language summary and why it should be read cautiously.",
    deck:
      "What one case report observed about toxin levels after EBOO — and the important limits of a single, uncontrolled report.",
    readMinutes: 4,
    updated: EXTERNAL_UPDATED,
    sections: [
      {
        heading: "What the case report described",
        body: [
          "EBOO is an ex-vivo blood-filtration technique with similarities to hemodialysis. A published case report followed an 88-year-old woman with chronic iron-deficiency anemia who presented with elevated urinary levels of mycotoxins, heavy metals, and environmental toxins. She underwent two treatment cycles, each consisting of three sequential EBOO sessions.",
          "Urinary toxin-to-creatinine ratios were measured at baseline, after the first cycle, and after the second. From baseline to the end of the second series, the report noted average decreases of roughly 64.8% for mycotoxins, 25.7% for heavy metals, and 55.1% for environmental toxins. Notably, nickel increased over the period, and hemoglobin remained relatively stable.",
        ],
      },
      {
        heading: "How to read this responsibly",
        body: [
          "A single case report cannot establish that a therapy works. External exposure factors were not controlled, there was no control group, and one metal moved in the opposite direction. The authors themselves framed the findings as suggesting EBOO may warrant further investigation as a supportive approach — not as proof.",
          "This is consistent with how we present all such literature: educational and transparent, not a claim of efficacy. EBOO is investigational and not FDA-approved to remove toxins or treat any condition.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does this prove EBOO removes toxins?",
        a: "No. It is one small, uncontrolled case report. It is hypothesis-generating and warrants further study; it does not establish efficacy, and one metal (nickel) actually rose during the period.",
      },
    ],
    related: ["eboo-remove-heavy-metals", "eboo-for-mold-and-toxins", "eboo-comparison-guide"],
    byline: {
      author: "EBOO Medical editorial team",
      sourceName: EBOOMED,
      sourceUrl: "https://eboomedical.com/observed-reduction-in-urinary-toxin-eboo/",
      note: "Summarized from a third-party case report shared by the source. Read the original report for full methods and limitations.",
    },
  },
  {
    slug: "eboo-clinical-biological-implications",
    kind: "external",
    category: "Research notes",
    title: "Clinical and Biological Implications of EBOO Ozone Therapy",
    excerpt:
      "A foundational research abstract (Di Paolo, Gaggiotti & Galli) on the biology of extracorporeal blood ozonation — summarized in plain language, with its preliminary nature kept front and center.",
    deck:
      "What an early peer-reviewed paper described about EBOO’s biology and proposed clinical applications — and why it remains preliminary.",
    readMinutes: 5,
    updated: EXTERNAL_UPDATED,
    sections: [
      {
        heading: "The biological rationale",
        body: [
          "The rationale for ozone therapy rests on a controlled interaction between pro-oxidants (ozone) and the body’s antioxidant systems — a measured oxidative stimulus that some research suggests may be relevant in certain immune and chronic degenerative conditions. Immune and endothelial (blood-vessel-lining) cells are considered primary targets of these effects.",
          "Ozone has been used via autohemotherapy (treating a small volume of blood) for roughly four decades with encouraging observations, though broad clinical validation and standardization remain limited.",
        ],
      },
      {
        heading: "What the EBOO paper reported",
        body: [
          "The paper described EBOO as a higher-volume method: a high-efficiency system treating up to several litres of heparinized blood during about an hour of extracorporeal circulation with an oxygen–ozone mixture, compared with roughly 250 ml in conventional autohemotherapy. The protocol it described spanned several weeks of sessions and could be integrated with dialysis systems.",
          "Biochemically, the authors reported a several-fold rise in oxidative markers (TBARS) and a corresponding drop in plasma protein thiols without significant red-cell hemolysis, proposing these as practical indicators for monitoring response. They reported promising signals in serious vascular conditions while calling for further controlled study.",
        ],
      },
      {
        heading: "An honest framing",
        body: [
          "This is foundational, hypothesis-generating work, not large-scale proof of efficacy. We cite it for education and transparency. EBOO remains investigational and is not FDA-approved to treat the conditions discussed in the literature.",
        ],
      },
    ],
    faqs: [
      {
        q: "Who authored the original research?",
        a: "The abstract is credited to N. Di Paolo, E. Gaggiotti, and F. Galli (PMID 16156950). It is an early paper describing EBOO’s biology and proposed applications and should be read as preliminary.",
      },
    ],
    related: ["ebo3-eboo-blood-therapy", "eboo-comparison-guide", "uvbi-ultraviolet-blood-irradiation"],
    byline: {
      author: "Di Paolo N, Gaggiotti E, Galli F (original research) — via EBOO Medical",
      sourceName: EBOOMED,
      sourceUrl: "https://eboomedical.com/clinical-and-biological-implications-of-eboo-ozone-therapy/",
      note: "Plain-language summary of a third-party peer-reviewed abstract (PMID 16156950). See the original for full detail.",
    },
  },
  {
    slug: "athletes-and-eboo-recovery-trend",
    kind: "external",
    category: "Trends",
    title: "Why Some Athletes Are Exploring EBOO for Recovery",
    excerpt:
      "High-performing athletes have drawn attention to blood ozone therapy as part of the modern recovery toolkit. Here is what the interest is about — and a realistic, non-promotional framing.",
    deck:
      "From ice baths to high-tech recovery: where EBOO fits in the conversation, and why visibility is not the same as proof.",
    readMinutes: 5,
    updated: EXTERNAL_UPDATED,
    sections: [
      {
        heading: "A high-tech recovery trend",
        body: [
          "Athlete recovery has grown into a sophisticated field, from hyperbaric oxygen and red-light therapy to advanced rehab equipment. In that context, EBOO — in which blood is drawn, filtered, enriched with oxygen and ozone, and reinfused — has been discussed by some athletes and practitioners as a possible tool for managing oxidative stress, circulation, and inflammation associated with intense training and injury recovery.",
          "Some public figures in professional sport have shared their own EBOO sessions, which has pushed the therapy further into mainstream conversation.",
        ],
      },
      {
        heading: "What proponents suggest — with a caveat",
        body: [
          "Advocates propose that improved oxygen delivery and reduced oxidative stress could, in theory, support tissue recovery. These are mechanistic hypotheses; EBOO is not proven to accelerate healing, and it remains controversial in mainstream sports medicine precisely because rigorous clinical evidence is limited.",
          "Visibility among elite athletes reflects interest and access, not validated efficacy. Anyone considering EBOO for recovery should treat it as investigational and discuss it with a qualified clinician.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does EBOO speed up injury recovery?",
        a: "There is no high-quality clinical evidence establishing that EBOO speeds recovery. The interest is based on proposed mechanisms and anecdotal reports. It is investigational and not FDA-approved for this use.",
      },
    ],
    related: ["what-is-eboo-therapy", "does-eboo-really-work", "eboo-for-longevity"],
    byline: {
      author: "EBOO Medical editorial team",
      sourceName: EBOOMED,
      sourceUrl: "https://eboomedical.com/changing-the-game-for-sports-injury-recovery/",
      note: "Adapted into rEBOOtBlood’s non-claim voice; specific athlete names, dollar figures, and third-party clinic references removed.",
    },
  },
  {
    slug: "eboo-athlete-wellness-spotlight",
    kind: "external",
    category: "Trends",
    title: "Public Interest in EBOO: The Athlete Wellness Spotlight",
    excerpt:
      "When a professional athlete shares an EBOO session publicly, interest spikes. Here is a calm explainer of what the procedure involves and why coverage is not the same as clinical proof.",
    deck:
      "What people are actually seeing when an athlete posts an EBOO session — and how to separate the procedure from the hype.",
    readMinutes: 4,
    updated: EXTERNAL_UPDATED,
    sections: [
      {
        heading: "What the procedure involves",
        body: [
          "In the sessions athletes have shared publicly, blood is drawn, circulated outside the body where it is exposed to an oxygen–ozone mixture and high-grade filtration, and then returned. A portion of the patient’s blood is processed in a continuous loop over the course of a session.",
          "The benefits proponents typically list — improved circulation, reduced inflammation, immune support, more energy, and toxin removal — are proposed effects, not established outcomes.",
        ],
      },
      {
        heading: "Why visibility isn’t evidence",
        body: [
          "Public interest from high-performance circles has raised EBOO’s profile, but the therapy remains controversial in the broader medical community because clinical research is limited. A celebrity or athlete trying something says nothing about whether it is safe or effective for you.",
          "EBOO is investigational and not FDA-approved to treat any condition. If you are curious, the sensible path is screening and a clinician conversation rather than following a trend.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is EBOO safe because famous athletes do it?",
        a: "Celebrity use is not a safety or efficacy signal. EBOO has defined contraindications and should only be performed by qualified clinicians after screening. It remains investigational.",
      },
    ],
    related: ["athletes-and-eboo-recovery-trend", "what-is-eboo-therapy", "does-eboo-really-work"],
    byline: {
      author: "EBOO Medical editorial team",
      sourceName: EBOOMED,
      sourceUrl: "https://eboomedical.com/bryce-harper-tries-eboo-therapy/",
      note: "Adapted into rEBOOtBlood’s non-claim voice; the specific individual’s name and identifying details were removed.",
    },
  },
  {
    slug: "eboo-blood-oil-change-explainer",
    kind: "external",
    category: "Explainers",
    title: "EBOO as an ‘Oil Change for the Body’: What That Means",
    excerpt:
      "Patients sometimes describe EBOO as feeling like ‘an oil change’ because of the visible filtration of blood. Here is what that nickname actually refers to, and a grounded view of the reported benefits.",
    deck:
      "Where the ‘oil change’ metaphor comes from, what the procedure does, and why it is investigational.",
    readMinutes: 4,
    updated: EXTERNAL_UPDATED,
    sections: [
      {
        heading: "Where the metaphor comes from",
        body: [
          "In EBOO, blood is withdrawn from one arm, filtered, oxygenated, and ozonated, and then returned through the other arm. Patients often remark on the visible contrast — darker blood leaving the body and lighter, pinker blood returning — which is where the informal ‘oil change’ comparison comes from. It is a metaphor about filtration, not a literal description.",
        ],
      },
      {
        heading: "What practitioners report — and the limits",
        body: [
          "Some integrative practitioners report improvements in energy and bloodwork among patients, and describe using EBOO for symptom-driven cases such as long-standing peripheral neuropathy, with the broad aim of reducing inflammation and supporting recovery. They also point to research interest in chronic infections, autoimmune conditions, and metabolic concerns.",
          "These are clinical observations and hypotheses, not proof. Most clinicians agree oxidative stress contributes to many diseases, but that general principle does not establish that EBOO treats them. EBOO is investigational and not FDA-approved, and it does not treat conditions like diabetes directly.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is EBOO literally an oil change for your blood?",
        a: "No. ‘Oil change’ is an informal metaphor patients use for the visible filtration of blood during EBOO. The procedure is a clinically supervised, dialysis-style loop — and it is investigational, not a proven detox.",
      },
    ],
    related: ["blood-oil-change", "what-is-eboo-therapy", "does-eboo-really-work"],
    byline: {
      author: "EBOO Medical editorial team",
      sourceName: EBOOMED,
      sourceUrl: "https://eboomedical.com/eboo-therapy-as-the-oil-change-for-the-body/",
      note: "Adapted into rEBOOtBlood’s non-claim voice; the named physician and his clinic were removed.",
    },
  },
  {
    slug: "eboo-remove-heavy-metals",
    kind: "external",
    category: "Explainers",
    title: "Does EBOO Remove Heavy Metals? An Honest Look",
    excerpt:
      "‘Detox’ and ‘heavy-metal removal’ are among the most common EBOO claims online. Here is what the proposed mechanisms are, and why the evidence does not support treating it as a proven chelation method.",
    deck:
      "The proposed detox mechanisms behind EBOO, the metals people ask about, and a careful, non-claim framing.",
    readMinutes: 5,
    updated: EXTERNAL_UPDATED,
    sections: [
      {
        heading: "The proposed mechanisms",
        body: [
          "Proponents suggest EBOO may support the body’s own detoxification in a few ways: by improving circulation so the organs of elimination are better supplied; through ozone’s oxidative action, which is proposed to alter some compounds in the blood; and by generally supporting immune and metabolic function. Heavy metals such as lead, mercury, cadmium, and arsenic accumulate from environmental and occupational exposure and are genuinely harmful at sufficient levels.",
        ],
      },
      {
        heading: "Why this must be framed carefully",
        body: [
          "It is important to be precise: EBOO is not an established, FDA-approved chelation or heavy-metal-removal therapy. The mechanisms above are hypotheses, and clinical evidence that EBOO meaningfully lowers body burden of specific metals is limited (a small case report is discussed in our research notes). Genuine heavy-metal toxicity is a medical diagnosis that requires evaluation and, where indicated, proven treatment under a clinician.",
          "If you are worried about heavy-metal exposure, the right first step is testing and a clinician’s assessment — not self-directed ‘detox.’ EBOO, where considered at all, would be investigational and adjunctive.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can EBOO chelate heavy metals out of my body?",
        a: "EBOO is not a proven or FDA-approved chelation therapy. Some proposed mechanisms and a small case report exist, but the evidence is limited. Suspected heavy-metal toxicity should be evaluated and treated by a clinician using validated methods.",
      },
    ],
    related: ["eboo-urinary-toxin-case-report", "eboo-for-mold-and-toxins", "what-is-eboo-therapy"],
    byline: {
      author: "EBOO Medical editorial team",
      sourceName: EBOOMED,
      sourceUrl: "https://eboomedical.com/does-eboo-remove-heavy-metals/",
      note: "Adapted into rEBOOtBlood’s non-claim voice; absolute claims softened to proposed mechanisms with explicit limits.",
    },
  },
  {
    slug: "eboo-and-lyme-supportive-care",
    kind: "external",
    category: "Conditions",
    title: "EBOO and Lyme Disease: Supportive Care, Not a Cure",
    excerpt:
      "Some integrative practitioners explore EBOO as supportive care for lingering Lyme symptoms. Here is a balanced overview — what it might address, what the evidence says, and why antibiotics remain the standard of care.",
    deck:
      "A careful look at EBOO as a possible adjunct for chronic Lyme symptoms — emphatically not a replacement for evidence-based treatment.",
    readMinutes: 5,
    updated: EXTERNAL_UPDATED,
    conditionValue: "Lyme disease",
    sections: [
      {
        heading: "Lyme disease and lingering symptoms",
        body: [
          "Lyme disease is caused by the bacterium Borrelia and is usually treated effectively with antibiotics when caught early. Some people experience persistent symptoms afterward — fatigue, brain fog, joint or muscle pain, and sleep disturbance — sometimes described as Post-Treatment Lyme Disease Syndrome (PTLDS). This is where some integrative practitioners discuss adjuncts like EBOO.",
        ],
      },
      {
        heading: "How EBOO is proposed to help — and the evidence",
        body: [
          "Proposed rationales include enhancing oxygen delivery to inflamed tissue, ozone’s general antimicrobial action, supporting circulation and the body’s detoxification, and modulating an over-active immune response. These are hypotheses; they have not been confirmed in large trials.",
          "The honest evidence picture: EBOO is not FDA-approved for Lyme, no large peer-reviewed trials validate it for Lyme or PTLDS, and general ozone research cannot be directly extrapolated to EBOO. Importantly, the bacteria largely reside in tissues rather than the bloodstream, so ‘cleaning’ blood does not target the infection where it lives.",
        ],
      },
      {
        heading: "A responsible approach",
        body: [
          "If EBOO is considered at all for chronic Lyme symptoms, it should be viewed as adjunctive and supportive — never a standalone or a substitute for antibiotics guided by a Lyme-literate physician or infectious-disease specialist. It is also not recommended for people with certain blood disorders or G6PD deficiency.",
          "Always consult your physician before pursuing EBOO, and do not delay evidence-based treatment.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can EBOO cure Lyme disease?",
        a: "No. EBOO is not a cure and is not FDA-approved for Lyme. Standard care is antibiotics guided by a clinician. EBOO is, at most, an investigational adjunct for lingering symptoms and does not target bacteria residing in tissues.",
      },
      {
        q: "Is EBOO safe for everyone with Lyme?",
        a: "No. It is not recommended for people with certain blood disorders, hyperthyroidism, or G6PD deficiency, and may cause transient fatigue or flu-like symptoms. Screening by a clinician is essential.",
      },
    ],
    related: ["eboo-for-lyme-disease", "what-is-eboo-therapy", "eboo-comparison-guide"],
    byline: {
      author: "EBOO Medical editorial team",
      sourceName: EBOOMED,
      sourceUrl: "https://eboomedical.com/eboo-therapy-for-lyme-disease/",
      note: "Adapted into rEBOOtBlood’s non-claim voice; balanced framing and antibiotics-as-standard-of-care emphasis retained.",
    },
  },
  {
    slug: "eboo-uv-light-therapy-explained",
    kind: "external",
    category: "Explainers",
    title: "EBOO + UV Light Therapy: What It Is",
    excerpt:
      "EBOO is sometimes combined with ultraviolet blood irradiation (UVBI) in a single session. Here is a plain explainer of what that adds — with the marketing statistics deliberately set aside.",
    deck:
      "How UV light is combined with blood ozonation, what proponents claim, and why precise, modest framing matters.",
    readMinutes: 5,
    updated: EXTERNAL_UPDATED,
    sections: [
      {
        heading: "What ‘EBOO + UV light’ means",
        body: [
          "Some protocols integrate three steps in one session: extracorporeal blood filtration, oxygen–ozone saturation, and a stage of ultraviolet (UV) blood irradiation. Processing happens in a continuous loop over roughly an hour, treating a larger volume of blood than a simple ozone IV. This combined approach is closely related to what we describe as EBO3.",
        ],
      },
      {
        heading: "A note on the bold numbers you may see",
        body: [
          "Marketing materials for EBOO + UV often quote dramatic percentages — large drops in inflammatory markers, big jumps in energy metabolism, near-total ‘detox.’ We deliberately do not repeat those figures as facts. Many come from small, uncontrolled, or vendor-sponsored sources and should be treated with caution.",
          "The honest position: UVBI and ozone therapies are investigational and not FDA-approved to treat any disease. The rationale for combining them is a protocol-design choice, not a guarantee of added benefit, and the clinical evidence for UVBI specifically remains limited.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does adding UV light make EBOO more effective?",
        a: "Combining UVBI with ozonation is a protocol-design choice based on proposed complementary mechanisms, not proven added benefit. UVBI evidence is limited and it is not FDA-approved to treat disease.",
      },
      {
        q: "Why don’t you cite the big percentage improvements?",
        a: "Many widely circulated EBOO + UV statistics come from small, uncontrolled, or promotional sources. We present this topic conservatively and avoid repeating unverified numbers as fact.",
      },
    ],
    related: ["uvbi-ultraviolet-blood-irradiation", "what-is-eboo-therapy", "ebo3-eboo-blood-therapy"],
    byline: {
      author: "Biana Borchenko",
      sourceName: EBOOMED,
      sourceUrl: "https://eboomedical.com/eboo-uv-light-therapy/",
      note: "Adapted into rEBOOtBlood’s non-claim voice; aggressive efficacy statistics and pricing/clinic-selection claims intentionally omitted.",
    },
  },
  {
    slug: "who-invented-eboo-therapy",
    kind: "external",
    category: "Foundations",
    title: "Who Invented EBOO Therapy? Origins and Development",
    excerpt:
      "EBOO grew out of decades of medical ozone research. Here is a brief, factual history — from early ozone autohemotherapy to the high-volume extracorporeal systems used today.",
    deck:
      "The roots of EBOO in ozone medicine, the figures who shaped the field, and how the modern extracorporeal approach developed.",
    readMinutes: 6,
    updated: EXTERNAL_UPDATED,
    sections: [
      {
        heading: "Roots in medical ozone",
        body: [
          "Using ozone therapeutically is not new. Medical ozone has been practiced since the early twentieth century, primarily in Europe, in forms such as ozonated oils, insufflations, and Major Autohemotherapy (MAH), in which a small amount of blood is withdrawn, mixed with ozone, and reinfused.",
          "A pivotal figure in modern ozone medicine is Dr. Velio Bocci, a professor emeritus of physiology at the University of Siena, whose research from the 1990s onward helped explain ozone’s proposed biological mechanisms — modulating oxidative stress, activating the immune system, and influencing oxygen metabolism. He did not invent EBOO, but his work helped legitimize the field that inspired it.",
        ],
      },
      {
        heading: "The development of EBOO",
        body: [
          "EBOO emerged in the early 2000s from the work of biomedical researchers and engineers — with significant contributions from Italian teams — who sought to overcome the small volumes of MAH by treating a much larger volume of blood in a closed-loop extracorporeal system. The design goals included continuous oxygen and ozone exposure, a dialysis-style filtration membrane, and hemodynamic stability using medical-grade materials.",
          "Over time, systems added high-efficiency filters, programmable ozone generators, single-use biocompatible tubing, and real-time monitoring. In some configurations, blood is recirculated and ozonated multiple times in a session — an approach sometimes called recirculatory hemoperfusion.",
        ],
      },
      {
        heading: "No single inventor — and still investigational",
        body: [
          "No single individual holds a public claim to inventing EBOO; it developed collaboratively across researchers, ozone-therapy pioneers, and equipment manufacturers, with various proprietary systems used under different names. It has seen growing adoption in integrative clinics in the US, Europe, and Asia.",
          "As interest grows, it remains important to note that EBOO is still considered experimental or adjunctive in conventional medicine, with large-scale clinical trials limited or ongoing. It is not FDA-approved to treat any disease.",
        ],
      },
    ],
    faqs: [
      {
        q: "Who invented EBOO therapy?",
        a: "There is no single inventor. EBOO developed in the early 2000s through collaboration among biomedical researchers (notably Italian teams), ozone-therapy pioneers, and equipment manufacturers, building on foundational ozone research by figures such as Dr. Velio Bocci.",
      },
    ],
    related: ["ebo3-eboo-blood-therapy", "uvbi-ultraviolet-blood-irradiation", "what-is-eboo-therapy"],
    byline: {
      author: "Ralph Montague",
      sourceName: EBOOMED,
      sourceUrl: "https://eboomedical.com/who-invented-eboo-therapy/",
      note: "Adapted into rEBOOtBlood’s educational voice; this history piece is largely factual with light editing for tone.",
    },
  },
];

export const ALL_ARTICLES: LearnArticle[] = [...PILLARS, ...SPOKES, ...SEO_ARTICLES, ...EXTERNAL_ARTICLES];

export function getArticle(slug: string): LearnArticle | undefined {
  return ALL_ARTICLES.find((a) => a.slug === slug);
}
