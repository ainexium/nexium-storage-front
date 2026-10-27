import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Privacy Policy / Politique de confidentialité",
  description: "Privacy policy for NEXIUM Storage.",
};

const EFFECTIVE_DATE_FR = "24 septembre 2026";
const EFFECTIVE_DATE_EN = "September 24, 2026";
const CONTACT_EMAIL = "support@nexiumai.io";

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

function ContentFR() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#9b3dff] mb-3">
          Confidentialité
        </p>
        <h1 className="text-3xl font-bold text-white mb-4">
          Politique de confidentialité
        </h1>
        <p className="text-gray-500 text-sm">
          En vigueur à compter du <span className="text-gray-300">{EFFECTIVE_DATE_FR}</span>
        </p>
        <p className="mt-4 text-[15px] text-gray-400 leading-relaxed">
          NEXIUM.AI s'engage à protéger votre vie privée. Cette politique décrit quelles données nous
          collectons, comment nous les utilisons et vos droits à leur égard.
        </p>
      </div>

      <nav className="mb-12 p-5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Sommaire</p>
        <ol className="space-y-1.5 text-sm text-gray-400">
          {[
            ["#collecte",    "1. Données collectées"],
            ["#utilisation", "2. Utilisation des données"],
            ["#partage",     "3. Partage des données"],
            ["#cookies",     "4. Cookies et traceurs"],
            ["#securite",    "5. Sécurité"],
            ["#retention",   "6. Conservation des données"],
            ["#droits",      "7. Vos droits"],
            ["#mineurs",     "8. Mineurs"],
            ["#modifications","9. Modifications"],
            ["#contact",     "10. Contact"],
          ].map(([href, label]) => (
            <li key={href}>
              <a href={href} className="hover:text-[#9b3dff] transition">{label}</a>
            </li>
          ))}
        </ol>
      </nav>

      <Section id="collecte" title="1. Données collectées">
        <p>Nous collectons les données suivantes lorsque vous utilisez NEXIUM Storage :</p>
        <ul className="space-y-1.5 ml-1">
          <Li><strong className="text-gray-300">Données de compte</strong> : nom, adresse e-mail, mot de passe (haché), date d'inscription</Li>
          <Li><strong className="text-gray-300">Données d'usage</strong> : projets, buckets, fichiers uploadés, clés API générées, appels API</Li>
          <Li><strong className="text-gray-300">Données de paiement</strong> : historique des transactions (montant, date, statut) — aucune donnée bancaire n'est stockée par nos soins</Li>
          <Li><strong className="text-gray-300">Données techniques</strong> : adresse IP, logs d'accès, type de navigateur, lors de la connexion au Service</Li>
          <Li><strong className="text-gray-300">Données OAuth</strong> : si vous vous connectez via Google ou GitHub, nous récupérons votre nom, adresse e-mail et identifiant de profil public</Li>
        </ul>
      </Section>

      <Section id="utilisation" title="2. Utilisation des données">
        <p>Vos données sont utilisées exclusivement pour :</p>
        <ul className="space-y-1.5 ml-1">
          <Li>Fournir, maintenir et améliorer le Service</Li>
          <Li>Gérer votre compte et vos abonnements</Li>
          <Li>Envoyer des e-mails transactionnels (confirmations, alertes de sécurité, rappels d'expiration)</Li>
          <Li>Détecter et prévenir les abus, fraudes et violations des conditions d'utilisation</Li>
          <Li>Respecter nos obligations légales</Li>
        </ul>
        <p>Nous n'utilisons pas vos données à des fins publicitaires.</p>
      </Section>

      <Section id="partage" title="3. Partage des données">
        <p>
          Nous ne vendons, ne louons ni ne cédons vos données personnelles à des tiers à des fins
          commerciales.
        </p>
        <p>Vos données peuvent être partagées uniquement avec :</p>
        <ul className="space-y-1.5 ml-1">
          <Li><strong className="text-gray-300">Cloudflare</strong> : pour le stockage physique des fichiers via R2 et la distribution CDN</Li>
          <Li><strong className="text-gray-300">Opérateurs de paiement</strong> : pour le traitement des transactions mobile money (Orange Money, Wave, MTN, etc.)</Li>
          <Li><strong className="text-gray-300">Autorités légales</strong> : uniquement sur réquisition judiciaire valide</Li>
        </ul>
      </Section>

      <Section id="cookies" title="4. Cookies et traceurs">
        <p>
          NEXIUM Storage utilise uniquement des cookies techniques strictement nécessaires au
          fonctionnement du Service (maintien de session, préférences de langue). Aucun cookie
          publicitaire ou de traçage tiers n'est utilisé.
        </p>
      </Section>

      <Section id="securite" title="5. Sécurité">
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données :
          chiffrement des mots de passe (Argon2id), tokens JWT signés, HTTPS obligatoire, clés API
          hachées en base de données, signatures HMAC-SHA256 sur les webhooks.
        </p>
        <p>
          En cas de violation de données susceptible d'affecter vos droits, nous vous en informerons
          dans les meilleurs délais.
        </p>
      </Section>

      <Section id="retention" title="6. Conservation des données">
        <p>
          Vos données de compte sont conservées tant que votre compte est actif. En cas de résiliation
          ou de suppression de compte, vos fichiers sont supprimés à l'issue d'une période de grâce
          de 30 jours, et vos données personnelles dans un délai de 90 jours.
        </p>
        <p>
          Les journaux techniques (logs) sont conservés 90 jours à des fins de sécurité et de débogage.
        </p>
      </Section>

      <Section id="droits" title="7. Vos droits">
        <p>Conformément à la réglementation applicable, vous disposez des droits suivants :</p>
        <ul className="space-y-1.5 ml-1">
          <Li><strong className="text-gray-300">Accès</strong> : obtenir une copie de vos données personnelles</Li>
          <Li><strong className="text-gray-300">Rectification</strong> : corriger des informations inexactes</Li>
          <Li><strong className="text-gray-300">Suppression</strong> : demander l'effacement de vos données</Li>
          <Li><strong className="text-gray-300">Portabilité</strong> : recevoir vos données dans un format structuré</Li>
          <Li><strong className="text-gray-300">Opposition</strong> : vous opposer à certains traitements</Li>
        </ul>
        <p>
          Pour exercer ces droits, contactez-nous à{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#9b3dff] hover:underline">
            {CONTACT_EMAIL}
          </a>.
          Nous répondons dans un délai de 30 jours.
        </p>
      </Section>

      <Section id="mineurs" title="8. Mineurs">
        <p>
          Le Service est destiné aux personnes âgées d'au moins 16 ans. Si vous avez connaissance
          qu'un mineur nous a transmis des données sans le consentement parental requis, contactez-nous
          afin que nous puissions les supprimer.
        </p>
      </Section>

      <Section id="modifications" title="9. Modifications">
        <p>
          Nous pouvons mettre à jour cette politique à tout moment. En cas de modification substantielle,
          vous serez notifié par e-mail ou par une notification dans le Service. La poursuite de
          l'utilisation du Service vaut acceptation de la politique mise à jour.
        </p>
      </Section>

      <Section id="contact" title="10. Contact">
        <p>Pour toute question relative à cette politique ou à vos données personnelles :</p>
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

function ContentEN() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#9b3dff] mb-3">
          Privacy
        </p>
        <h1 className="text-3xl font-bold text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-500 text-sm">
          Effective as of <span className="text-gray-300">{EFFECTIVE_DATE_EN}</span>
        </p>
        <p className="mt-4 text-[15px] text-gray-400 leading-relaxed">
          NEXIUM.AI is committed to protecting your privacy. This policy describes what data we
          collect, how we use it, and your rights regarding it.
        </p>
      </div>

      <nav className="mb-12 p-5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Table of contents</p>
        <ol className="space-y-1.5 text-sm text-gray-400">
          {[
            ["#collecte",    "1. Data we collect"],
            ["#utilisation", "2. How we use your data"],
            ["#partage",     "3. Data sharing"],
            ["#cookies",     "4. Cookies"],
            ["#securite",    "5. Security"],
            ["#retention",   "6. Data retention"],
            ["#droits",      "7. Your rights"],
            ["#mineurs",     "8. Minors"],
            ["#modifications","9. Changes"],
            ["#contact",     "10. Contact"],
          ].map(([href, label]) => (
            <li key={href}>
              <a href={href} className="hover:text-[#9b3dff] transition">{label}</a>
            </li>
          ))}
        </ol>
      </nav>

      <Section id="collecte" title="1. Data we collect">
        <p>We collect the following data when you use NEXIUM Storage:</p>
        <ul className="space-y-1.5 ml-1">
          <Li><strong className="text-gray-300">Account data</strong>: name, email address, password (hashed), registration date</Li>
          <Li><strong className="text-gray-300">Usage data</strong>: projects, buckets, uploaded files, generated API keys, API calls</Li>
          <Li><strong className="text-gray-300">Payment data</strong>: transaction history (amount, date, status) — no payment card data is stored by us</Li>
          <Li><strong className="text-gray-300">Technical data</strong>: IP address, access logs, browser type, upon connection to the Service</Li>
          <Li><strong className="text-gray-300">OAuth data</strong>: if you sign in via Google or GitHub, we retrieve your name, email address and public profile identifier</Li>
        </ul>
      </Section>

      <Section id="utilisation" title="2. How we use your data">
        <p>Your data is used exclusively to:</p>
        <ul className="space-y-1.5 ml-1">
          <Li>Provide, maintain and improve the Service</Li>
          <Li>Manage your account and subscriptions</Li>
          <Li>Send transactional emails (confirmations, security alerts, expiry reminders)</Li>
          <Li>Detect and prevent abuse, fraud and violations of our Terms of Service</Li>
          <Li>Comply with our legal obligations</Li>
        </ul>
        <p>We do not use your data for advertising purposes.</p>
      </Section>

      <Section id="partage" title="3. Data sharing">
        <p>
          We do not sell, rent or transfer your personal data to third parties for commercial purposes.
        </p>
        <p>Your data may be shared only with:</p>
        <ul className="space-y-1.5 ml-1">
          <Li><strong className="text-gray-300">Cloudflare</strong>: for physical file storage via R2 and CDN distribution</Li>
          <Li><strong className="text-gray-300">Payment operators</strong>: for processing mobile money transactions (Orange Money, Wave, MTN, etc.)</Li>
          <Li><strong className="text-gray-300">Legal authorities</strong>: only upon valid court order</Li>
        </ul>
      </Section>

      <Section id="cookies" title="4. Cookies">
        <p>
          NEXIUM Storage uses only strictly necessary technical cookies for the Service to function
          (session maintenance, language preferences). No advertising or third-party tracking
          cookies are used.
        </p>
      </Section>

      <Section id="securite" title="5. Security">
        <p>
          We implement technical and organizational measures to protect your data: password hashing
          (Argon2id), signed JWT tokens, mandatory HTTPS, hashed API keys in the database, and
          HMAC-SHA256 signatures on webhooks.
        </p>
        <p>
          In the event of a data breach likely to affect your rights, we will notify you as soon
          as possible.
        </p>
      </Section>

      <Section id="retention" title="6. Data retention">
        <p>
          Your account data is kept for as long as your account is active. Upon account termination
          or deletion, your files are deleted after a 30-day grace period, and your personal data
          within 90 days.
        </p>
        <p>
          Technical logs are retained for 90 days for security and debugging purposes.
        </p>
      </Section>

      <Section id="droits" title="7. Your rights">
        <p>Under applicable regulations, you have the following rights:</p>
        <ul className="space-y-1.5 ml-1">
          <Li><strong className="text-gray-300">Access</strong>: obtain a copy of your personal data</Li>
          <Li><strong className="text-gray-300">Rectification</strong>: correct inaccurate information</Li>
          <Li><strong className="text-gray-300">Deletion</strong>: request erasure of your data</Li>
          <Li><strong className="text-gray-300">Portability</strong>: receive your data in a structured format</Li>
          <Li><strong className="text-gray-300">Objection</strong>: object to certain processing activities</Li>
        </ul>
        <p>
          To exercise these rights, contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#9b3dff] hover:underline">
            {CONTACT_EMAIL}
          </a>.
          We respond within 30 days.
        </p>
      </Section>

      <Section id="mineurs" title="8. Minors">
        <p>
          The Service is intended for individuals aged 16 or older. If you are aware that a minor
          has provided us with data without the required parental consent, please contact us so we
          can delete it.
        </p>
      </Section>

      <Section id="modifications" title="9. Changes">
        <p>
          We may update this policy at any time. For material changes, you will be notified by
          email or via an in-app notification. Continued use of the Service after notification
          constitutes acceptance of the updated policy.
        </p>
      </Section>

      <Section id="contact" title="10. Contact">
        <p>For any questions about this policy or your personal data:</p>
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

export default async function PrivacyPage() {
  const locale = await getLocale();
  const isFR = locale === "fr";

  return (
    <div className="themed-page min-h-screen bg-[#08080f]">

      <header className="lp-header sticky top-0 z-30 border-b border-white/[0.06] backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#9b3dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
            </svg>
            <span className="text-[15px] font-bold text-[#9b3dff] tracking-tight">NEXIUM</span>
            <span className="text-[11px] text-gray-500 font-medium">/ storage</span>
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
