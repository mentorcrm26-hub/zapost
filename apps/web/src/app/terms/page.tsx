import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service — ZaPost',
  description: 'Terms and Conditions for using ZaPost AI Marketing Platform in the United States.',
}

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 text-zinc-300 space-y-6 text-xs leading-relaxed">
      <Link href="/" className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold mb-2 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="border-b border-white/10 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          Terms of Service
        </h1>
        <p className="text-[11px] text-zinc-400 mt-1">Last Updated: September 2026 • Governed by US Law</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-white">1. Service Overview</h2>
        <p>
          ZaPost provides AI-assisted digital marketing asset generation specifically designed for small business owners in the United States. By accessing or using our platform, web applications, or WhatsApp integration, you agree to be bound by these Terms of Service.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-white">2. Subscriptions & Credit Ledger</h2>
        <p>
          - <strong>Credits (⚡ Rays):</strong> Subscriptions provide monthly creative credits. Credits are deducted strictly upon final creative approval or execution of extra enhancements (e.g., photo AI touchups).
        </p>
        <p>
          - <strong>Free Trial:</strong> We offer a 5-creative quantity-based free trial with no credit card required. We never auto-charge without explicit subscription checkout.
        </p>
        <p>
          - <strong>Billing Currency:</strong> All prices are in USD (United States Dollars) and processed securely via Stripe.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-white">3. Content Moderation & Acceptable Use</h2>
        <p>
          Users agree not to generate advertisements containing:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-zinc-400">
          <li>Unsubstantiated medical claims or guaranteed disease cures.</li>
          <li>Guaranteed income schemes or misleading financial claims.</li>
          <li>Guaranteed immigration or visa outcomes.</li>
          <li>Fraudulent, defamatory, or copyright-infringing materials.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-white">4. Cancellation & Refund Policy</h2>
        <p>
          You may cancel your subscription at any time with a single click via our Stripe Customer Portal or from the &quot;Minha Conta&quot; page. Access remains active through the end of the current billing cycle.
        </p>
      </section>

      {/* TODO: US SaaS Sales Tax compliance review with CPA */}
      <div className="bg-zinc-900 border border-white/10 rounded-xl p-3 text-[11px] text-zinc-400">
        <strong>Sales Tax Notice:</strong> Applicable state and local sales taxes may apply based on your billing ZIP code in compliance with US state tax laws.
      </div>

      <div className="pt-4 border-t border-white/10 text-center text-zinc-500 text-[11px]">
        ZaPost Inc. • Contact: support@zapost.com • USA
      </div>
    </div>
  )
}
