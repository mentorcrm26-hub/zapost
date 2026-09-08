import React from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, CreditCard, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Cancellation Policy — ZaPost',
  description: '1-Click Easy Cancellation Policy and Instructions for ZaPost Customers.',
}

export default function CancellationPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 text-zinc-300 space-y-6 text-xs leading-relaxed">
      <Link href="/" className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold mb-2 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="border-b border-white/10 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Cancellation & Subscription Terms
        </h1>
        <p className="text-[11px] text-zinc-400 mt-1">Simple, Transparent, and Free of Hassle</p>
      </div>

      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
        <h2 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          How to Cancel Your Subscription in 1 Click
        </h2>
        <p className="text-zinc-200">
          We believe canceling should be just as easy as subscribing. In accordance with US federal and state consumer protection standards:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5 text-zinc-300 pt-1">
          <li>Go to the <Link href="/conta" className="text-amber-400 font-bold underline">Minha Conta</Link> page.</li>
          <li>Click on <strong>&quot;Cancelar Assinatura&quot;</strong> or <strong>&quot;Gerenciar Cartão e Faturas&quot;</strong>.</li>
          <li>In the secure Stripe Customer Portal, click <strong>&quot;Cancel Plan&quot;</strong>.</li>
        </ol>
      </div>

      <section className="space-y-2">
        <h3 className="text-sm font-bold text-white">What Happens After Cancellation?</h3>
        <p>
          - You will retain full access to your remaining credits (⚡ rays) until the end of your prepaid billing period.
        </p>
        <p>
          - No further charges will ever be made to your payment method.
        </p>
        <p>
          - You can reactivate your account at any time with zero penalty.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-bold text-white">Need Assistance?</h3>
        <p>
          If you encounter any difficulty canceling or need a refund for an inadvertent renewal, contact our human support team directly via WhatsApp at +1 (508) 555-0142 or email support@zapost.com.
        </p>
      </section>

      <div className="pt-4 border-t border-white/10 text-center text-zinc-500 text-[11px]">
        ZaPost Inc. • Customer Protection Compliance • USA
      </div>
    </div>
  )
}
