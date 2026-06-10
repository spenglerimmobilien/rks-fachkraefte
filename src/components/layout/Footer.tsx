import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER, CONTACT_EMAIL } from "@/lib/constants";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const legal = useTranslations("legal");

  return (
    <footer className="bg-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 mountain-pattern opacity-30" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Logo size="md" variant="light" className="mb-4" />
            <p className="text-white/70 mb-4 max-w-sm">{t("tagline")}</p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-brand-red-light">{t("quickLinks")}</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li><Link href="/fuer-fachkraefte" className="hover:text-white transition-colors">{nav("candidates")}</Link></li>
              <li><Link href="/fuer-arbeitgeber" className="hover:text-white transition-colors">{nav("employers")}</Link></li>
              <li><Link href="/ablauf" className="hover:text-white transition-colors">{nav("process")}</Link></li>
              <li><Link href="/bewerbung" className="hover:text-white transition-colors">{nav("apply")}</Link></li>
              <li><Link href="/anfrage" className="hover:text-white transition-colors">{nav("request")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-brand-red-light">{t("legal")}</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li><Link href="/impressum" className="hover:text-white transition-colors">{legal("imprint")}</Link></li>
              <li><Link href="/datenschutz" className="hover:text-white transition-colors">{legal("privacy")}</Link></li>
              <li><Link href="/agb" className="hover:text-white transition-colors">{legal("terms")}</Link></li>
              <li><a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white transition-colors">{CONTACT_EMAIL}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-white/50 text-sm">
          <span>© {new Date().getFullYear()} RKS Fachkräfte. {t("rights")}</span>
          <span className="flex items-center gap-1.5">
            <span className="text-brand-red">★</span>
            Van-Straße 1, Essen-Katternberg
          </span>
        </div>
      </div>
    </footer>
  );
}
