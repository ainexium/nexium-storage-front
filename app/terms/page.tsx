import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Terms of Service / Conditions d'utilisation",
  description: "Terms of service for NEXIUM Storage.",
};

const EFFECTIVE_DATE_FR = "24 septembre 2026";
const EFFECTIVE_DATE_EN = "September 24, 2026";
const CONTACT_EMAIL = "ai.nexium@gmail.com";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10">
      <h2 className="text-lg font-semibold text-white mb-3 pb-2 border-b border-white/10">{title}</h2>
      <div className="space-y-3 text-[15px] text-gray-400 leading-relaxed">{children}</div>
    </section>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="mt-1.5 w-1 h-1 rounded-full bg-[#9b3dff] shrink-0" />
      <span>{children}</span>
    </li>
  );
}

// ── French content ────────────────────────────────────────────────────────────

function ContentFR() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#9b3dff] mb-3">
          Conditions d'utilisation
        </p>
        <h1 className="text-3xl font-bold text-white mb-4">
          Conditions générales d'utilisation
        </h1>
        <p className="text-gray-500 text-sm">
          En vigueur à compter du <span className="text-gray-300">{EFFECTIVE_DATE_FR}</span>
        </p>
        <p className="mt-4 text-[15px] text-gray-400 leading-relaxed">
          En créant un compte ou en utilisant NEXIUM Storage, vous acceptez sans réserve les présentes
          conditions. Lisez-les attentivement avant de vous inscrire.
        </p>
      </div>

      <nav className="mb-12 p-5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Sommaire</p>
        <ol className="space-y-1.5 text-sm text-gray-400">
          {[
            ["#objet",           "1. Objet et acceptation"],
            ["#service",         "2. Description du service"],
            ["#compte",          "3. Accès et compte utilisateur"],
            ["#usage",           "4. Utilisation acceptable"],
            ["#donnees",         "5. Données et stockage"],
            ["#facturation",     "6. Facturation et paiements"],
            ["#disponibilite",   "7. Disponibilité du service"],
            ["#pi",              "8. Propriété intellectuelle"],
            ["#confidentialite", "9. Confidentialité et données personnelles"],
            ["#responsabilite",  "10. Limitation de responsabilité"],
            ["#resiliation",     "11. Résiliation"],
            ["#modifications",   "12. Modifications des conditions"],
            ["#loi",             "13. Loi applicable"],
            ["#contact",         "14. Contact"],
          ].map(([href, label]) => (
            <li key={href}>
              <a href={href} className="hover:text-[#9b3dff] transition">{label}</a>
            </li>
          ))}
        </ol>
      </nav>

      <Section id="objet" title="1. Objet et acceptation">
        <p>
          Les présentes conditions générales d'utilisation (ci-après « CGU ») régissent l'accès et
          l'utilisation de la plateforme NEXIUM Storage (ci-après « le Service »), éditée par NEXIUM.AI.
        </p>
        <p>
          En cochant la case « J'accepte les conditions d'utilisation » lors de l'inscription, vous
          reconnaissez avoir lu, compris et accepté les présentes CGU dans leur intégralité.
          Si vous n'acceptez pas ces conditions, vous ne pouvez pas utiliser le Service.
        </p>
      </Section>

      <Section id="service" title="2. Description du service">
        <p>
          NEXIUM Storage est une plateforme de stockage d'objets en nuage (cloud) permettant aux
          utilisateurs de stocker, organiser, partager et accéder à leurs fichiers via un tableau
          de bord web et une API REST compatible S3.
        </p>
        <p>Le Service comprend :</p>
        <ul className="space-y-1.5 ml-1">
          <Li>La gestion de projets, de buckets et de fichiers</Li>
          <Li>La génération de clés API pour l'intégration dans vos applications</Li>
          <Li>La configuration de webhooks pour les événements liés à vos fichiers</Li>
          <Li>Des plans d'abonnement payants avec des quotas de stockage définis</Li>
          <Li>Des add-ons de stockage supplémentaires pour les abonnés Pro et Business</Li>
        </ul>
        <p>
          Le Service est fourni « en l'état » selon les limites du plan souscrit par l'utilisateur.
        </p>
      </Section>

      <Section id="compte" title="3. Accès et compte utilisateur">
        <p>
          L'accès au Service requiert la création d'un compte avec une adresse e-mail valide et un
          mot de passe d'au moins 8 caractères. Vous devez fournir des informations exactes et les
          maintenir à jour.
        </p>
        <p>
          Vous êtes seul responsable de la confidentialité de vos identifiants et de toutes les
          activités effectuées depuis votre compte. En cas d'accès non autorisé, contactez-nous
          immédiatement à{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#9b3dff] hover:underline">
            {CONTACT_EMAIL}
          </a>.
        </p>
        <p>
          Un seul compte par personne physique ou morale est autorisé. La création de comptes multiples
          pour contourner les limites du plan gratuit constitue une violation des présentes CGU.
        </p>
      </Section>

      <Section id="usage" title="4. Utilisation acceptable">
        <p>Vous vous engagez à utiliser le Service uniquement à des fins licites. Il est strictement interdit de :</p>
        <ul className="space-y-1.5 ml-1">
          <Li>Stocker, diffuser ou partager des contenus illégaux, diffamatoires, obscènes, menaçants ou portant atteinte aux droits de tiers</Li>
          <Li>Utiliser le Service pour distribuer des logiciels malveillants, virus ou tout code nuisible</Li>
          <Li>Tenter d'accéder sans autorisation aux systèmes, serveurs ou données d'autres utilisateurs</Li>
          <Li>Automatiser la création de comptes pour contourner les quotas du plan gratuit</Li>
          <Li>Revendre ou sous-licencier l'accès au Service sans autorisation écrite préalable de NEXIUM.AI</Li>
          <Li>Effectuer des actions susceptibles de perturber ou de surcharger l'infrastructure du Service</Li>
        </ul>
        <p>
          NEXIUM.AI se réserve le droit de suspendre ou supprimer immédiatement tout compte qui
          contreviendrait à ces règles, sans préavis ni remboursement.
        </p>
      </Section>

      <Section id="donnees" title="5. Données et stockage">
        <p>
          Vous conservez l'entière propriété des fichiers et données que vous uploadez sur le Service.
          NEXIUM.AI n'accède à vos données qu'à des fins techniques de fourniture du Service (sauvegarde,
          sécurité, débogage).
        </p>
        <p>
          Les quotas de stockage sont définis par le plan souscrit. Le dépassement de votre quota
          bloque les nouveaux uploads sans affecter l'accès aux fichiers existants.
        </p>
        <p>
          En cas d'expiration de votre abonnement sans renouvellement, vos données passent en mode
          lecture seule. Une <strong className="text-gray-300">période de grâce de 30 jours</strong> vous
          est accordée pour télécharger vos fichiers ou renouveler votre abonnement.
          À l'issue de cette période, vos fichiers sont définitivement supprimés.
        </p>
        <p>
          Les comptes sans activité depuis plus de 90 jours reçoivent un avertissement par e-mail.
          Sans activité pendant 120 jours, les fichiers sont automatiquement supprimés.
        </p>
      </Section>

      <Section id="facturation" title="6. Facturation et paiements">
        <p>
          Les abonnements sont facturés mensuellement en Francs CFA (XOF) selon la grille tarifaire
          affichée sur le Service. Les paiements sont traités via des opérateurs de mobile money
          agréés en Afrique de l'Ouest.
        </p>
        <p>
          Tout paiement validé est définitif et non remboursable, sauf disposition légale contraire
          ou erreur manifeste de facturation.
        </p>
        <p>
          Les add-ons de stockage sont disponibles uniquement sur les plans Pro et Business. Ils sont
          liés à votre abonnement actif et se réactivent automatiquement en cas de renouvellement.
        </p>
        <p>
          NEXIUM.AI se réserve le droit de modifier sa grille tarifaire avec un préavis de 30 jours
          communiqué par e-mail. Le maintien du Service après cette date vaut acceptation des nouveaux tarifs.
        </p>
      </Section>

      <Section id="disponibilite" title="7. Disponibilité du service">
        <p>
          NEXIUM.AI s'efforce d'assurer la disponibilité du Service 24h/24, 7j/7, mais ne peut garantir
          une disponibilité ininterrompue. Des interruptions peuvent survenir pour maintenance,
          mises à jour ou incidents techniques.
        </p>
        <p>
          NEXIUM.AI ne saurait être tenu responsable des pertes de données, interruptions d'activité ou
          tout autre dommage résultant d'une indisponibilité temporaire du Service.
        </p>
      </Section>

      <Section id="pi" title="8. Propriété intellectuelle">
        <p>
          La plateforme NEXIUM Storage, incluant son code source, son interface, ses marques, logos
          et toute documentation associée, est la propriété exclusive de NEXIUM.AI et est protégée par
          les lois applicables en matière de propriété intellectuelle.
        </p>
        <p>
          Vous vous engagez à ne pas reproduire, copier, modifier, distribuer ou exploiter tout
          élément du Service sans autorisation écrite préalable de NEXIUM.AI.
        </p>
      </Section>

      <Section id="confidentialite" title="9. Confidentialité et données personnelles">
        <p>
          NEXIUM.AI collecte et traite vos données personnelles (nom, adresse e-mail, données d'usage)
          dans le but de fournir et améliorer le Service. Ces données ne sont ni vendues ni cédées à
          des tiers à des fins commerciales.
        </p>
        <p>
          En vous inscrivant, vous consentez à recevoir des e-mails transactionnels liés à votre
          compte (confirmations de paiement, rappels d'expiration, alertes de sécurité).
        </p>
        <p>
          Vous disposez d'un droit d'accès, de rectification et de suppression de vos données
          personnelles en nous contactant à{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#9b3dff] hover:underline">
            {CONTACT_EMAIL}
          </a>.
        </p>
      </Section>

      <Section id="responsabilite" title="10. Limitation de responsabilité">
        <p>
          Dans les limites autorisées par la loi applicable, NEXIUM.AI ne pourra être tenu responsable
          de tout dommage indirect, accessoire, spécial ou consécutif résultant de l'utilisation
          ou de l'impossibilité d'utiliser le Service.
        </p>
        <p>
          La responsabilité totale de NEXIUM.AI, quelle qu'en soit la cause, ne pourra excéder le
          montant payé par l'utilisateur pour le Service au cours des 3 derniers mois.
        </p>
        <p>
          Il vous appartient de maintenir des sauvegardes locales de vos données critiques.
          NEXIUM.AI ne saurait être tenu responsable d'une perte de données résultant d'une suppression
          automatique consécutive à une expiration d'abonnement ou à une inactivité prolongée.
        </p>
      </Section>

      <Section id="resiliation" title="11. Résiliation">
        <p>
          Vous pouvez résilier votre compte à tout moment depuis votre tableau de bord. La résiliation
          entraîne la suppression de vos données à l'issue de la période de grâce de 30 jours.
        </p>
        <p>
          NEXIUM.AI se réserve le droit de résilier ou suspendre votre accès en cas de violation des
          présentes CGU, sans préavis ni remboursement.
        </p>
      </Section>

      <Section id="modifications" title="12. Modifications des conditions">
        <p>
          NEXIUM.AI peut modifier les présentes CGU à tout moment. Les modifications sont communiquées
          par e-mail et/ou par notification dans le Service avec un préavis raisonnable.
        </p>
        <p>
          La poursuite de l'utilisation du Service après notification des modifications vaut
          acceptation des nouvelles conditions.
        </p>
      </Section>

      <Section id="loi" title="13. Loi applicable">
        <p>
          Les présentes CGU sont régies par les lois applicables en Afrique de l'Ouest.
          Tout litige relatif à l'interprétation ou à l'exécution des présentes sera soumis à la
          juridiction compétente du lieu du siège de NEXIUM.AI, après tentative de résolution amiable.
        </p>
      </Section>

      <Section id="contact" title="14. Contact">
        <p>Pour toute question relative aux présentes CGU ou au Service, contactez-nous à :</p>
        <p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#9b3dff] hover:underline font-medium">
            {CONTACT_EMAIL}
          </a>
        </p>
      </Section>

      <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-[12px] text-white/25">
          © {new Date().getFullYear()}{" "}
          <a href="https://nexiumai.io" target="_blank" rel="noopener noreferrer" className="text-[#9b3dff] hover:text-[#aa55ff] transition">
            NEXIUM.AI
          </a>
          {" · "}Tous droits réservés.
        </p>
        <Link href="/register" className="text-sm font-medium text-[#9b3dff] hover:text-[#aa55ff] transition">
          Créer un compte →
        </Link>
      </div>
    </>
  );
}

// ── English content ───────────────────────────────────────────────────────────

function ContentEN() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#9b3dff] mb-3">
          Terms of Service
        </p>
        <h1 className="text-3xl font-bold text-white mb-4">
          Terms of Service
        </h1>
        <p className="text-gray-500 text-sm">
          Effective as of <span className="text-gray-300">{EFFECTIVE_DATE_EN}</span>
        </p>
        <p className="mt-4 text-[15px] text-gray-400 leading-relaxed">
          By creating an account or using NEXIUM Storage, you unreservedly agree to these terms.
          Please read them carefully before registering.
        </p>
      </div>

      <nav className="mb-12 p-5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Table of contents</p>
        <ol className="space-y-1.5 text-sm text-gray-400">
          {[
            ["#objet",           "1. Purpose and acceptance"],
            ["#service",         "2. Service description"],
            ["#compte",          "3. Account access"],
            ["#usage",           "4. Acceptable use"],
            ["#donnees",         "5. Data and storage"],
            ["#facturation",     "6. Billing and payments"],
            ["#disponibilite",   "7. Service availability"],
            ["#pi",              "8. Intellectual property"],
            ["#confidentialite", "9. Privacy and personal data"],
            ["#responsabilite",  "10. Limitation of liability"],
            ["#resiliation",     "11. Termination"],
            ["#modifications",   "12. Changes to these terms"],
            ["#loi",             "13. Governing law"],
            ["#contact",         "14. Contact"],
          ].map(([href, label]) => (
            <li key={href}>
              <a href={href} className="hover:text-[#9b3dff] transition">{label}</a>
            </li>
          ))}
        </ol>
      </nav>

      <Section id="objet" title="1. Purpose and acceptance">
        <p>
          These Terms of Service (the "Terms") govern access to and use of the NEXIUM Storage platform
          (the "Service"), published by NEXIUM.AI.
        </p>
        <p>
          By checking the box "I agree to the terms of service" at registration, you acknowledge that
          you have read, understood and agreed to these Terms in full. If you do not accept these Terms,
          you may not use the Service.
        </p>
      </Section>

      <Section id="service" title="2. Service description">
        <p>
          NEXIUM Storage is a cloud object storage platform that lets users store, organize, share
          and access their files through a web dashboard and an S3-compatible REST API.
        </p>
        <p>The Service includes:</p>
        <ul className="space-y-1.5 ml-1">
          <Li>Project, bucket and file management</Li>
          <Li>API key generation for application integration</Li>
          <Li>Webhook configuration for file-related events</Li>
          <Li>Paid subscription plans with defined storage quotas</Li>
          <Li>Additional storage add-ons for Pro and Business subscribers</Li>
        </ul>
        <p>
          The Service is provided "as is" within the limits of the plan subscribed to by the user.
        </p>
      </Section>

      <Section id="compte" title="3. Account access">
        <p>
          Access to the Service requires creating an account with a valid email address and a password
          of at least 8 characters. You must provide accurate information and keep it up to date.
        </p>
        <p>
          You are solely responsible for the confidentiality of your credentials and all activity
          performed from your account. In the event of unauthorized access, contact us immediately at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#9b3dff] hover:underline">
            {CONTACT_EMAIL}
          </a>.
        </p>
        <p>
          Only one account per natural or legal person is permitted. Creating multiple accounts to
          circumvent the free plan quotas constitutes a violation of these Terms.
        </p>
      </Section>

      <Section id="usage" title="4. Acceptable use">
        <p>You agree to use the Service only for lawful purposes. It is strictly prohibited to:</p>
        <ul className="space-y-1.5 ml-1">
          <Li>Store, distribute or share illegal, defamatory, obscene, threatening or third-party rights-infringing content</Li>
          <Li>Use the Service to distribute malware, viruses or any harmful code</Li>
          <Li>Attempt to gain unauthorized access to other users' systems, servers or data</Li>
          <Li>Automate account creation to circumvent free plan quotas</Li>
          <Li>Resell or sublicense access to the Service without prior written authorization from NEXIUM.AI</Li>
          <Li>Perform actions likely to disrupt or overload the Service infrastructure</Li>
        </ul>
        <p>
          NEXIUM.AI reserves the right to immediately suspend or delete any account that violates
          these rules, without notice or refund.
        </p>
      </Section>

      <Section id="donnees" title="5. Data and storage">
        <p>
          You retain full ownership of the files and data you upload to the Service. NEXIUM.AI only
          accesses your data for the technical purposes of providing the Service (backup, security,
          debugging).
        </p>
        <p>
          Storage quotas are defined by your subscribed plan. Exceeding your quota blocks new uploads
          without affecting access to existing files.
        </p>
        <p>
          If your subscription expires without renewal, your data is placed in read-only mode.
          A <strong className="text-gray-300">30-day grace period</strong> is granted for you to
          download your files or renew your subscription. After this period, your files are
          permanently deleted.
        </p>
        <p>
          Accounts inactive for more than 90 days receive an email warning. After 120 days of
          inactivity, files are automatically deleted.
        </p>
      </Section>

      <Section id="facturation" title="6. Billing and payments">
        <p>
          Subscriptions are billed monthly in West African CFA francs (XOF) according to the pricing
          displayed on the Service. Payments are processed via authorized mobile money operators in
          West Africa.
        </p>
        <p>
          All validated payments are final and non-refundable, unless required by applicable law or
          in the case of a clear billing error.
        </p>
        <p>
          Storage add-ons are available only on Pro and Business plans. They are tied to your active
          subscription and automatically reactivated upon renewal.
        </p>
        <p>
          NEXIUM.AI reserves the right to modify its pricing with 30 days' notice communicated by
          email. Continued use of the Service after that date constitutes acceptance of the new prices.
        </p>
      </Section>

      <Section id="disponibilite" title="7. Service availability">
        <p>
          NEXIUM.AI strives to keep the Service available 24/7 but cannot guarantee uninterrupted
          availability. Outages may occur for maintenance, updates or technical incidents.
        </p>
        <p>
          NEXIUM.AI shall not be liable for data loss, business interruptions or any other damage
          resulting from a temporary unavailability of the Service.
        </p>
      </Section>

      <Section id="pi" title="8. Intellectual property">
        <p>
          The NEXIUM Storage platform, including its source code, interface, trademarks, logos and
          all associated documentation, is the exclusive property of NEXIUM.AI and is protected by
          applicable intellectual property laws.
        </p>
        <p>
          You agree not to reproduce, copy, modify, distribute or exploit any element of the Service
          without prior written authorization from NEXIUM.AI.
        </p>
      </Section>

      <Section id="confidentialite" title="9. Privacy and personal data">
        <p>
          NEXIUM.AI collects and processes your personal data (name, email address, usage data) for
          the purpose of providing and improving the Service. This data is neither sold nor transferred
          to third parties for commercial purposes.
        </p>
        <p>
          By registering, you consent to receiving transactional emails related to your account
          (payment confirmations, expiry reminders, security alerts).
        </p>
        <p>
          You have the right to access, correct and delete your personal data by contacting us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#9b3dff] hover:underline">
            {CONTACT_EMAIL}
          </a>.
        </p>
      </Section>

      <Section id="responsabilite" title="10. Limitation of liability">
        <p>
          To the fullest extent permitted by applicable law, NEXIUM.AI shall not be liable for any
          indirect, incidental, special or consequential damages arising from use of or inability to
          use the Service.
        </p>
        <p>
          NEXIUM.AI's total liability, regardless of cause, shall not exceed the amount paid by the
          user for the Service during the last 3 months.
        </p>
        <p>
          You are responsible for maintaining local backups of your critical data. NEXIUM.AI shall
          not be liable for data loss resulting from automatic deletion following subscription
          expiry or prolonged inactivity.
        </p>
      </Section>

      <Section id="resiliation" title="11. Termination">
        <p>
          You may delete your account at any time from your dashboard. Termination results in the
          deletion of your data at the end of the 30-day grace period.
        </p>
        <p>
          NEXIUM.AI reserves the right to terminate or suspend your access for violation of these
          Terms, without notice or refund.
        </p>
      </Section>

      <Section id="modifications" title="12. Changes to these terms">
        <p>
          NEXIUM.AI may modify these Terms at any time. Changes will be communicated by email and/or
          in-app notification with reasonable notice.
        </p>
        <p>
          Continued use of the Service after notification of changes constitutes acceptance of the
          updated Terms.
        </p>
      </Section>

      <Section id="loi" title="13. Governing law">
        <p>
          These Terms are governed by the laws applicable in West Africa. Any dispute relating to
          the interpretation or performance of these Terms shall be submitted to the competent court
          at the registered office of NEXIUM.AI, following an attempt at amicable resolution.
        </p>
      </Section>

      <Section id="contact" title="14. Contact">
        <p>For any questions regarding these Terms or the Service, contact us at:</p>
        <p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#9b3dff] hover:underline font-medium">
            {CONTACT_EMAIL}
          </a>
        </p>
      </Section>

      <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-[12px] text-white/25">
          © {new Date().getFullYear()}{" "}
          <a href="https://nexiumai.io" target="_blank" rel="noopener noreferrer" className="text-[#9b3dff] hover:text-[#aa55ff] transition">
            NEXIUM.AI
          </a>
          {" · "}All rights reserved.
        </p>
        <Link href="/register" className="text-sm font-medium text-[#9b3dff] hover:text-[#aa55ff] transition">
          Create an account →
        </Link>
      </div>
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function TermsPage() {
  const locale = await getLocale();
  const isFR = locale === "fr";

  return (
    <div className="themed-page min-h-screen bg-[#08080f]">

      <header className="lp-header sticky top-0 z-30 border-b border-white/[0.06] backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-[#9b3dff] tracking-tight">NEXIUM</span>
            <span className="text-[11px] text-gray-500 font-medium">Storage</span>
          </Link>
          <Link href="/register" className="text-sm text-gray-400 hover:text-white transition">
            {isFR ? "← Retour à l'inscription" : "← Back to sign up"}
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-14">
        {isFR ? <ContentFR /> : <ContentEN />}
      </main>

    </div>
  );
}
