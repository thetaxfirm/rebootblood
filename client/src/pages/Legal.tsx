import SiteLayout, { Eyebrow } from "@/components/site/SiteLayout";
import { SITE } from "@/lib/site";
import { useSeo } from "@/hooks/useSeo";

function LegalShell({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <SiteLayout>
      <section className="pt-36 pb-20 md:pt-44">
        <div className="container max-w-3xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-3 text-4xl md:text-5xl">{title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated {new Date().getFullYear()}</p>
          <div className="prose-legal mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:text-foreground [&_strong]:text-foreground/90">
            {children}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

export function Privacy() {
  useSeo({
    title: "Privacy Policy — rEBOOtBlood",
    description:
      "How rEBOOtBlood collects, uses, and protects the information you provide through our eligibility questionnaire and contact forms.",
  });
  return (
    <LegalShell title="Privacy Policy" eyebrow="Your Privacy">
      <p>
        This Privacy Policy explains how {SITE.name} ("we", "us") collects, uses, and protects information you
        provide through {SITE.domain}, including the patient eligibility questionnaire and contact forms. This
        policy is a template provided for informational purposes and should be reviewed by your legal counsel
        before launch.
      </p>
      <h2>Information we collect</h2>
      <p>
        We collect information you voluntarily submit, such as your name, contact details, and the health-related
        information you provide in the eligibility questionnaire. Health information you submit is treated as
        sensitive and is encrypted at rest.
      </p>
      <h2>How we protect your information</h2>
      <p>
        We apply administrative and technical safeguards designed to align with HIPAA principles, including
        encryption of submitted health information at rest, strict role-based access so that only authorized
        staff can view patient submissions, and audit logging of access to that information. No method of
        transmission or storage is completely secure, and full HIPAA compliance also depends on signed Business
        Associate Agreements with our service providers and our internal policies.
      </p>
      <h2>How we use your information</h2>
      <p>
        We use your information to respond to your inquiry, determine potential eligibility, schedule
        consultations, and communicate with you about our services. We do not sell your personal information.
      </p>
      <h2>Your choices</h2>
      <p>
        You may request access to, correction of, or deletion of your information by contacting us at{" "}
        <a href={SITE.emailHref} className="underline">{SITE.email}</a>. You may withdraw consent to be contacted
        at any time.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about this policy can be directed to {SITE.email}.
      </p>
    </LegalShell>
  );
}

export function Terms() {
  useSeo({
    title: "Terms of Service — rEBOOtBlood",
    description:
      "The terms governing your use of the rEBOOtBlood website, including educational-only content and important medical and safety disclaimers.",
  });
  return (
    <LegalShell title="Terms of Service" eyebrow="Terms">
      <p>
        These Terms of Service govern your use of {SITE.domain}. By using this site you agree to these terms.
        This document is a template provided for informational purposes and should be reviewed by your legal
        counsel before launch.
      </p>
      <h2>Educational information only</h2>
      <p>
        All content on this website is provided for general educational and informational purposes only and is
        not medical advice. It is not intended for self-diagnosis or to replace consultation with a qualified
        licensed healthcare provider.
      </p>
      <h2>No FDA evaluation; no guarantee of results</h2>
      <p>
        The therapies described have not been evaluated by the U.S. Food and Drug Administration and are not
        intended to diagnose, treat, cure, or prevent any disease. Results cannot be guaranteed and individual
        responses vary.
      </p>
      <h2>Assumption of risk</h2>
      <p>
        As with any procedure involving the circulatory system, these therapies carry inherent risks. By
        engaging our services you acknowledge that you have been informed of the potential risks and benefits and
        voluntarily assume the risks associated with treatment. Formal informed consent is reviewed and signed
        with a licensed provider before any procedure.
      </p>
      <h2>Not for emergencies</h2>
      <p>
        This website and its forms are not for medical emergencies. If you are experiencing an emergency, call
        your local emergency number immediately.
      </p>
      <h2>Contact</h2>
      <p>Questions about these terms can be directed to {SITE.email}.</p>
    </LegalShell>
  );
}
