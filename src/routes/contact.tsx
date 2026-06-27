import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Phone, MapPin, Clock, Mail } from "lucide-react";
import { waGeneral, WA_DISPLAY } from "@/lib/whatsapp";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — Ali Mobile Zone" }, { name: "description", content: "Get in touch with Ali Mobile Zone via WhatsApp at 0322 0066229." }] }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-navy">Get in touch</h1>
        <p className="mt-2 text-muted-foreground">We're here to help — WhatsApp is the fastest way to reach us.</p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-navy p-8 text-white">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-whatsapp"><MessageCircle className="h-7 w-7" /></div>
          <h3 className="mt-4 text-2xl font-extrabold">Chat on WhatsApp</h3>
          <p className="mt-2 text-sm text-white/70">Send us your order, ask about products, or get delivery updates.</p>
          <a href={`tel:+92${WA_DISPLAY.replace(/\s/g, "")}`} className="mt-4 block text-2xl font-extrabold text-gold">{WA_DISPLAY}</a>
          <a href={waGeneral()} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-whatsapp px-6 py-3 text-sm font-bold text-white hover:bg-whatsapp-dark">
            <MessageCircle className="h-4 w-4" /> Open WhatsApp
          </a>
        </div>

        <div className="space-y-4">
          {[
            { Icon: Phone, title: "Call us", text: WA_DISPLAY },
            { Icon: MapPin, title: "Service area", text: "Nationwide delivery across Pakistan 🇵🇰" },
            { Icon: Clock, title: "Open hours", text: "Mon–Sun · 10:00 AM – 11:00 PM" },
            { Icon: Mail, title: "Email", text: "support@alimobilezone.com" },
          ].map(({ Icon, title, text }) => (
            <div key={title} className="flex items-start gap-4 rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gold text-navy"><Icon className="h-5 w-5" /></div>
              <div>
                <div className="text-sm font-bold text-navy">{title}</div>
                <div className="text-sm text-muted-foreground">{text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
