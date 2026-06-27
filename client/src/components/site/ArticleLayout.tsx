import { Link } from "wouter";
import { ArrowRight, ArrowLeft, Clock, ShieldCheck, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SiteLayout, { Eyebrow } from "@/components/site/SiteLayout";
import ContactSection from "@/components/site/ContactSection";
import { useSeo } from "@/hooks/useSeo";
import { ASSETS } from "@/lib/site";
import { getArticle, type LearnArticle } from "@/lib/learn";

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ArticleLayout({ article }: { article: LearnArticle }) {
  const quizHref = article.conditionValue
    ? `/eligibility?condition=${encodeURIComponent(article.conditionValue)}`
    : "/eligibility";
  const related = article.related
    .map(getArticle)
    .filter((a): a is LearnArticle => Boolean(a));

  useSeo({
    title: `${article.title} — rEBOOtBlood Learning Center`,
    description: article.excerpt.slice(0, 158),
  });

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={ASSETS.heroAbstract} alt="Abstract visualization of oxygenated blood flow" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
        </div>
        <div className="container relative pt-36 pb-14 md:pt-44 md:pb-20">
          <div className="max-w-3xl reveal">
            <Link
              href="/learn"
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Learning Center
            </Link>
            <Eyebrow>{article.category}</Eyebrow>
            <h1 className="mt-4 text-balance text-4xl leading-[1.08] md:text-5xl">{article.title}</h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{article.deck}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {article.readMinutes} min read
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[color:var(--gold)]" /> Medically reviewed for educational accuracy
              </span>
              <span>Last updated {fmtDate(article.updated)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="pb-8">
        <div className="container grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="max-w-2xl">
            {article.sections.map((s) => (
              <div key={s.heading} className="mb-10">
                <h2 className="mb-4 text-2xl md:text-3xl">{s.heading}</h2>
                {s.body.map((p, i) => (
                  <p key={i} className="mb-4 leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>
            ))}

            {/* Non-claim / educational disclaimer */}
            <div className="rounded-xl border border-border bg-card/50 p-5 text-sm leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Educational information only.</strong> This article is provided for
              general education and is not medical advice. EBO3, EBOO, UVBI, and plasmapheresis are investigational,
              research-stage therapies and are not FDA-approved to diagnose, treat, cure, or prevent any disease.
              Individual results vary. Always consult a qualified clinician and do not change prescribed care based on
              this page.
            </div>

            {article.faqs.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-4 text-2xl md:text-3xl">Frequently asked</h2>
                <Accordion type="single" collapsible>
                  {article.faqs.map((f, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="border-border">
                      <AccordionTrigger className="text-left text-base hover:no-underline">{f.q}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </article>

          {/* SIDEBAR */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-border bg-card/60 p-6">
              <h3 className="text-lg">Is this right for you?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Take the eligibility quiz — it takes a few minutes and helps our care team advise you honestly.
              </p>
              <Link href={quizHref}>
                <Button className="btn-press mt-4 w-full">
                  Take Eligibility Quiz <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/#contact">
                <Button variant="outline" className="btn-press mt-2 w-full border-border bg-background/30">
                  Book a Consultation
                </Button>
              </Link>
            </div>

            {related.length > 0 && (
              <div className="mt-6 rounded-2xl border border-border bg-card/40 p-6">
                <h3 className="mb-3 flex items-center gap-2 text-base">
                  <BookOpen className="h-4 w-4 text-[color:var(--gold)]" /> Keep reading
                </h3>
                <ul className="space-y-3">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/learn/${r.slug}`}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {r.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      <ContactSection />
    </SiteLayout>
  );
}
