import { HeroProps } from "@pagopa/mui-italia/dist/components/Hero";

export const getHeroData = (): HeroProps => ({
  title: 'Inviare notifiche a valore legale? Facile a dirsi.',
  subtitle: 'E da oggi anche a farsi. Piattaforma Notifiche digitalizza la gestione delle notifiche a valore legale, semplificando il processo per tutti: chi le invia, e chi le riceve.',
  ctaPrimary: {
    label: 'Scopri come aderire',
    title: 'Scopri come aderire title',
    href: 'PRIMARY_CTA_URL'
  },
  ctaSecondary: {
    label: 'Accedi',
    title: 'Accedi title',
    href: 'SECONDARY_CTA_URL'
  },
  // inverse?: boolean,
  image: "FOREGROUND_IMAGE_URL",
  altText: "",
  background: "BACKGROUND_IMAGE_URL",
});