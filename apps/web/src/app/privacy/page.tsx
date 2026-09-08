import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Lock } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy — ZaPost',
  description: 'ZaPost Privacy Policy, Cookie Usage, and Consent Mode v2 Information.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 text-zinc-300 space-y-6 text-xs leading-relaxed">
      <Link href="/" className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold mb-2 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="border-b border-white/10 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-400" />
          Privacy Policy
        </h1>
        <p className="text-[11px] text-zinc-400 mt-1">Effective Date: September 2026 • CCPA & US Compliant</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-white">1. Information We Collect</h2>
        <p>
          We collect information you provide directly, such as your business name, phone number, email address, and uploaded marketing assets (photos and voice notes).
        </p>
        <p>
          We also capture attribution parameters (such as <code>gclid</code> and UTM parameters) via first-party cookies to measure advertising effectiveness across Google Ads and Google Analytics.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-white">2. Google Consent Mode v2 & Analytics</h2>
        <p>
          We implement Google Consent Mode v2 (<code>ad_storage</code>, <code>analytics_storage</code>, <code>ad_user_data</code>, <code>ad_personalization</code>). Personal data sent for conversion modeling (such as email) is strictly transformed using SHA-256 one-way cryptographic hashing before transmission to ad platforms.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-white">3. How We Use Your Data</h2>
        <ul className="list-disc pl-5 space-y-1 text-zinc-400">
          <li>To generate tailored localized marketing creatives in Portuguese and English.</li>
          <li>To process transactions securely through Stripe.</li>
          <li>To deliver customer support via WhatsApp or email.</li>
        </ul>
        <p>We do not sell, rent, or trade your personal data to third parties.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-white">4. Your Privacy Rights</h2>
        <p>
          Under applicable state privacy laws (including California, Colorado, Connecticut, and Virginia), you have the right to access, delete, or correct your personal information by contacting support@zapost.com.
        </p>
      </section>

      <div className="pt-4 border-t border-white/10 text-center text-zinc-500 text-[11px]">
        ZaPost Inc. • Privacy Office: privacy@zapost.com • USA
      </div>
    </div>
  )
}
