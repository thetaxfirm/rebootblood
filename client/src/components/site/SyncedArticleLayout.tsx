import { Link, useLocation } from "wouter";
import { useMemo } from "react";
import { goToContact } from "@/lib/goToContact";
import { ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout, { Eyebrow } from "@/components/site/SiteLayout";
import ContactSection from "@/components/site/ContactSection";
import { useSeo } from "@/hooks/useSeo";
import { ASSETS, SITE } from "@/lib/site";

export type SyncedArticleView = {
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  heroImageUrl: string;
  keywords: string[];
  contentHtml: string;
  remoteCreatedAt: Date | string | number | null;
  publishedAt: Date | string | number | null;
};

function fmtDate(d: Date | string | number) {
  return new Date(d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Public renderer for a published, LinkArtemis-synced article. Mirrors the
 * hand-authored ArticleLayout shell (hero, sidebar CTAs, disclaimer, SEO +
 * Article JSON-LD) but renders the sanitized HTML body. The HTML is sanitized
 * server-side before storage; we only render it here.
 */
export default function SyncedArticleLayout({ article }: { article: SyncedArticleView }) {
  const [, navigate] = useLocation();
  const heroImg = article.heroImageUrl || `${SITE.url}${ASSETS.heroAbstract}`;
  const dateForDisplay = article.publishedAt ?? article.remoteCreatedAt ?? new Date();
  const isoDate = new Date(dateForDisplay).toISOString();

  const articleJsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.metaDescription || article.excerpt,
      image: article.heroImageUrl || `${SITE.url}${ASSETS.heroAbstract}`,
      datePublished: isoDate,
      dateModified: isoDate,
      inLanguage: "en",
      author: { "@type": "Organization", name: SITE.name },
      publisher: {
        "@type": "Organization",
        name: SITE.name,
        logo: { "@type": "ImageObject", url: `${SITE.url}${ASSETS.logo}` },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${SITE.url}/learn/${article.slug}`,
      },
    }),
    [article, isoDate],
  );

  useSeo({
    title: `${article.title} — rEBOOtBlood Learning Center`,
    description: (article.metaDescription || article.excerpt).slice(0, 158),
    jsonLd: articleJsonLd,
  });

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="h-full w-full object-cover" />
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
            <Eyebrow>Learning Center</Eyebrow>
            <h1 className="mt-4 text-balance text-4xl leading-[1.08] md:text-5xl">{article.title}</h1>
            {article.excerpt && (
              <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{article.excerpt}</p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[color:var(--gold)]" /> Reviewed for educational accuracy
              </span>
              <span>Published {fmtDate(dateForDisplay)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="pb-8">
        <div className="container grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="max-w-2xl">
            <div
              className="article-html"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />

            {/* Non-claim / educational disclaimer */}
            <div className="mt-10 rounded-xl border border-border bg-card/50 p-5 text-sm leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Educational information only.</strong> This article is provided for
              general education and is not medical advice. EBO3, EBOO, UVBI, and plasmapheresis are investigational,
              research-stage therapies and are not FDA-approved to diagnose, treat, cure, or prevent any disease.
              Individual results vary. Always consult a qualified clinician and do not change prescribed care based on
              this page.
            </div>
          </article>

          {/* SIDEBAR */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-border bg-card/60 p-6">
              <h3 className="text-lg">Is this right for you?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Take the eligibility quiz — it takes a few minutes and helps our care team advise you honestly.
              </p>
              <Link href="/eligibility">
                <Button className="btn-press mt-4 w-full">
                  Take Eligibility Quiz <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="btn-press mt-2 w-full border-border bg-background/30"
                onClick={() => goToContact(navigate)}
              >
                Book a Consultation
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <ContactSection />
    </SiteLayout>
  );
}
