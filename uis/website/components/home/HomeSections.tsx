"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/LanguageProvider";

export function HeroSection() {
  const { translate: tr } = useI18n();
  return (
    <section
      id="home"
      className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 text-white"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {tr("hero.headline")}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-stone-200 sm:text-xl">
            {tr("hero.subheadline")}
          </p>
          <Link
            href="/application"
            className="mt-8 inline-block rounded-lg bg-amber-600 px-8 py-3 font-semibold text-white shadow-lg hover:bg-amber-500"
          >
            {tr("hero.cta")}
          </Link>
        </div>
        <img
          src="https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop"
          alt={tr("story.imageAlt")}
          width={800}
          height={600}
          className="aspect-[4/3] w-full rounded-xl object-cover shadow-2xl"
        />
      </div>
    </section>
  );
}

export function StorySection() {
  const { translate: tr } = useI18n();
  return (
    <section id="story" className="py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        <div>
          <h2 className="text-3xl font-bold text-stone-900">{tr("story.title")}</h2>
          <p className="mt-6 text-lg leading-relaxed text-stone-600">
            {tr("story.text")}
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop"
          alt={tr("story.imageAlt")}
          width={800}
          height={600}
          className="aspect-[4/3] w-full rounded-xl object-cover shadow-lg"
        />
      </div>
    </section>
  );
}

export function UniqueSection() {
  const { translate: tr } = useI18n();
  const cards = [
    {
      title: tr("unique.qualityTitle"),
      items: [tr("unique.quality1"), tr("unique.quality2")],
    },
    {
      title: tr("unique.experienceTitle"),
      items: [tr("unique.experience1"), tr("unique.experience2")],
    },
    {
      title: tr("unique.speedTitle"),
      items: [tr("unique.speed1"), tr("unique.speed2")],
    },
  ];
  return (
    <section id="unique" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-stone-900">
          {tr("unique.title")}
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.title}
              className="rounded-xl border border-stone-200 bg-stone-50 p-6"
            >
              <h3 className="text-xl font-semibold text-stone-900">
                {card.title}
              </h3>
              <ul className="mt-4 space-y-2 text-stone-600">
                {card.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LocationsSection() {
  const { translate: tr } = useI18n();
  return (
    <section id="locations" className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-stone-900">
          {tr("locations.title")}
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <article className="rounded-xl border border-stone-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-semibold text-amber-800">
              {tr("locations.colombiaTitle")}
            </h3>
            <p className="mt-4 text-stone-600">{tr("locations.colombiaText")}</p>
            <p className="mt-2 text-stone-500">{tr("locations.colombiaHours")}</p>
          </article>
          <article className="rounded-xl border border-stone-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-semibold text-amber-800">
              {tr("locations.usaTitle")}
            </h3>
            <p className="mt-4 text-stone-600">{tr("locations.usaText")}</p>
            <p className="mt-2 text-stone-500">{tr("locations.usaHours")}</p>
          </article>
        </div>
      </div>
    </section>
  );
}

export function MenuSection() {
  const { translate: tr } = useI18n();
  return (
    <section id="menu" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-stone-900">
          {tr("menuSection.title")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
          {tr("menuSection.intro")}
        </p>
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
          {[tr("menuSection.grilled"), tr("menuSection.sides"), tr("menuSection.beverages")].map(
            (label) => (
              <div
                key={label}
                className="rounded-lg border border-stone-200 bg-stone-50 p-6"
              >
                <p className="font-semibold text-stone-900">{label}</p>
              </div>
            ),
          )}
        </div>
        <p className="mt-8 text-stone-500">{tr("menuSection.note")}</p>
      </div>
    </section>
  );
}

export function BrasaPointsSection() {
  const { translate: tr } = useI18n();
  const points = [
    tr("brasaPoints.point1"),
    tr("brasaPoints.point2"),
    tr("brasaPoints.point3"),
    tr("brasaPoints.point4"),
  ];
  return (
    <section id="brasa-points" className="bg-amber-800 py-16 text-white lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8">
        <div>
          <h2 className="text-3xl font-bold">{tr("brasaPoints.title")}</h2>
          <h3 className="mt-2 text-xl text-amber-100">
            {tr("brasaPoints.subtitle")}
          </h3>
          <ul className="mt-8 space-y-4 text-amber-50">
            {points.map((point) => (
              <li key={point} className="flex gap-3">
                <span aria-hidden="true">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-10 text-center lg:mt-0 lg:text-right">
          <Link
            href="/application"
            className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-amber-800 shadow-lg hover:bg-amber-50"
          >
            {tr("brasaPoints.cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  const { translate: tr } = useI18n();
  return (
    <section id="contact" className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-stone-900">{tr("contact.title")}</h2>
        <div className="mt-10 flex flex-col justify-center gap-8 text-lg sm:flex-row">
          <div>
            <p className="font-semibold text-stone-900">{tr("contact.emailLabel")}</p>
            <a href="mailto:hello@brasaland.com" className="text-amber-800 hover:underline">
              hello@brasaland.com
            </a>
          </div>
          <div>
            <p className="font-semibold text-stone-900">{tr("contact.colombiaLabel")}</p>
            <a href="tel:+5741234567" className="text-amber-800 hover:underline">
              +57 4 123 4567
            </a>
          </div>
          <div>
            <p className="font-semibold text-stone-900">{tr("contact.floridaLabel")}</p>
            <a href="tel:+13051234567" className="text-amber-800 hover:underline">
              +1 305 123 4567
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
