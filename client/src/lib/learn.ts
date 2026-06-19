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

export type LearnArticle = {
  slug: string;
  kind: "pillar" | "spoke";
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
export type Publication = {
  title: string;
  authors: string;
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
];

export const ALL_ARTICLES: LearnArticle[] = [...PILLARS, ...SPOKES];

export function getArticle(slug: string): LearnArticle | undefined {
  return ALL_ARTICLES.find((a) => a.slug === slug);
}
