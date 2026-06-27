import { Link, useParams } from "wouter";
import { ArrowRight, Clock, BookOpen, GraduationCap, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout, { Eyebrow } from "@/components/site/SiteLayout";
import CtaBand from "@/components/site/CtaBand";
import ContactSection from "@/components/site/ContactSection";
import ArticleLayout from "@/components/site/ArticleLayout";
import NotFound from "@/pages/NotFound";
import { useSeo } from "@/hooks/useSeo";
import { ASSETS } from "@/lib/site";
import { PILLARS, SPOKES, SEO_ARTICLES, PUBLICATIONS, PUBLICATIONS_LAST_REVIEWED, getArticle, type LearnArticle } from "@/lib/learn";

function ArticleCard({ a }: { a: LearnArticle }) {
  return (
    <Link
      href={`/learn/${a.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card/60 p-7 transition-colors hover:border-[color:var(--gold)]/50"
    >
      <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--gold)]">{a.category}</span>
      <h3 className="mt-3 text-xl leading-snug transition-colors group-hover:text-foreground">{a.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" /> {a.readMinutes} min read
        <ArrowRight className="ml-auto h-4 w-4 text-[color:var(--gold)] transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function LearnIndex() {
  useSeo({
    title: "Learning Center — EBO3, EBOO, UVBI & Plasmapheresis | rEBOOtBlood",
    description:
      "Clear, honest, non-promotional education on EBO3, EBOO, UVBI, and therapeutic plasmapheresis — the science and how these therapies are being studied.",
  });
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={ASSETS.heroAbstract} alt="Abstract visualization of oxygenated blood flow" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
        </div>
        <div className="container relative pt-36 pb-16 md:pt-44 md:pb-24">
          <div className="max-w-3xl reveal">
            <Eyebrow>Learning Center</Eyebrow>
            <h1 className="mt-4 text-balance text-5xl leading-[1.05] md:text-6xl">
              Understand the science <span className="text-gradient-garnet">before you decide</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Clear, honest, non-promotional education on EBO3, EBOO, UVBI, and plasmapheresis — and how they are being
              explored for specific health concerns. No hype, no disease claims.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/eligibility">
                <Button size="lg" className="btn-press w-full sm:w-auto">
                  Take Eligibility Quiz <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/#contact">
                <Button size="lg" variant="outline" className="btn-press w-full border-border bg-background/30 sm:w-auto">
                  Book Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-2xl">
            <Eyebrow>Start Here</Eyebrow>
            <h2 className="mt-3 flex items-center gap-3 text-4xl md:text-5xl">
              <GraduationCap className="h-9 w-9 text-[color:var(--gold)]" /> Foundations
            </h2>
            <p className="mt-4 text-muted-foreground">
              The core guides. Read these to understand what these therapies are, how they differ, and what the
              evidence does and does not say.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {PILLARS.map((a) => (
              <ArticleCard key={a.slug} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR QUESTIONS (SEO explainers) */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-2xl">
            <Eyebrow>Popular Questions</Eyebrow>
            <h2 className="mt-3 flex items-center gap-3 text-4xl md:text-5xl">
              <BookOpen className="h-9 w-9 text-[color:var(--gold)]" /> Quick explainers
            </h2>
            <p className="mt-4 text-muted-foreground">
              Short, plain-language answers to the questions people ask most about EBOO, EBO2, EBO3, and the
              “blood oil change” nickname.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {SEO_ARTICLES.map((a) => (
              <ArticleCard key={a.slug} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* SPOKES */}
      <section className="border-y border-border/70 bg-card/30 py-20 md:py-28">
        <div className="container">
          <div className="max-w-2xl">
            <Eyebrow>By Concern</Eyebrow>
            <h2 className="mt-3 flex items-center gap-3 text-4xl md:text-5xl">
              <BookOpen className="h-9 w-9 text-[color:var(--gold)]" /> Conditions &amp; goals
            </h2>
            <p className="mt-4 text-muted-foreground">
              Explore how blood therapy is being studied for the concerns we hear about most. Each guide links to a
              pre-filled eligibility quiz so the care team can advise you.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SPOKES.map((a) => (
              <ArticleCard key={a.slug} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* RESEARCH & PUBLICATIONS */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-2xl">
            <Eyebrow>References</Eyebrow>
            <h2 className="mt-3 flex items-center gap-3 text-4xl md:text-5xl">
              <FileText className="h-9 w-9 text-[color:var(--gold)]" /> Research &amp; publications
            </h2>
            <p className="mt-4 text-muted-foreground">
              A curated reading list of third-party papers and white papers on ozone and bio-oxidative therapy. These
              are independent publications provided for education and transparency &mdash; listing them is not a claim
              of efficacy by rEBOOtBlood, and much of this literature is preliminary.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {PUBLICATIONS.map((p) => (
              <a
                key={p.url}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-2xl border border-border bg-card/50 p-6 transition-colors hover:border-[color:var(--gold)]/50"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--gold)]">{p.topic}</span>
                  <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                </div>
                <h3 className="mt-3 text-lg leading-snug">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {p.authors} &middot; <span className="italic">{p.venue}</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
                <p className="mt-4 border-t border-border/60 pt-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80">
                  Reviewed by our care team &middot;{" "}
                  {new Date((p.lastReviewed ?? PUBLICATIONS_LAST_REVIEWED) + "T00:00:00").toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </a>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted-foreground">
            Source documents are hosted by their respective publishers/authors and open in a new tab. The presence of a
            paper here does not imply endorsement, and none of these references establish that any therapy is approved
            to diagnose, treat, cure, or prevent disease.
          </p>
        </div>
      </section>

      <CtaBand
        heading="Have a question the articles didn't answer?"
        sub="Our care team can walk you through your options in a private consultation."
      />
      <ContactSection />
    </SiteLayout>
  );
}

export default function Learn() {
  const params = useParams();
  const slug = (params as { slug?: string }).slug;
  if (!slug) return <LearnIndex />;
  const article = getArticle(slug);
  if (!article) return <NotFound />;
  return <ArticleLayout article={article} />;
}
