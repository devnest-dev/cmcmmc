import type { Metadata } from 'next'
import {
  eventInfo,
  logoImage,
  ogImage,
  organizationAddress,
  organizationEmail,
  organizationName,
  siteDescription,
  siteName,
  siteUrl,
} from '@/lib/seo'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import SpeakersSection from '@/components/SpeakersSection'
import BreakoutSection from '@/components/BreakoutSection'
import FirstCongress from '@/components/FirstCongress'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: "Home",
  description: siteDescription,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    url: '/',
    title: siteName,
    description: siteDescription,
  },
  twitter: {
    title: siteName,
    description: siteDescription,
  },
}

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: organizationName,
    url: siteUrl,
    email: organizationEmail,
    logo: `${siteUrl}${logoImage}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: organizationAddress.streetAddress,
      addressLocality: organizationAddress.addressLocality,
      addressRegion: organizationAddress.addressRegion,
      addressCountry: organizationAddress.addressCountry,
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    inLanguage: 'en',
    publisher: {
      '@type': 'Organization',
      name: organizationName,
      url: siteUrl,
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: eventInfo.name,
    description: siteDescription,
    startDate: eventInfo.startDate,
    endDate: eventInfo.endDate,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    image: [`${siteUrl}${ogImage}`],
    location: {
      '@type': 'Place',
      name: eventInfo.locationName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: eventInfo.locationAddress,
        addressLocality: organizationAddress.addressLocality,
        addressRegion: organizationAddress.addressRegion,
        addressCountry: organizationAddress.addressCountry,
      },
    },
    organizer: {
      '@type': 'Organization',
      name: organizationName,
      url: siteUrl,
    },
  },
]

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main>
        <HeroSection />
        <AboutSection />
        <SpeakersSection />
        <BreakoutSection />
        <FirstCongress />
        <CTASection />
      </main>
    </>
  )
}
