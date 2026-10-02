import type { Metadata } from "next";
import { Mail, MapPin, MessageSquareText, PhoneCall } from "lucide-react";

import ContactForm from "./ContactForm";
import {
	organizationAddress,
	organizationEmail,
	siteShortName,
} from "@/lib/seo";

export const metadata: Metadata = {
	title: "Contact Us",
	description:
		"Reach the CM-CMMC team with questions, coordination requests, or event concerns.",
	alternates: {
		canonical: "/contact-us",
	},
};

const contactDetails = [
	{
		icon: Mail,
		label: "Email",
		value: organizationEmail,
		href: `mailto:${organizationEmail}`,
	},
	{
		icon: MapPin,
		label: "Office",
		value: `${organizationAddress.streetAddress}, ${organizationAddress.addressLocality}, ${organizationAddress.addressRegion}`,
		href: null,
	},
	{
		icon: PhoneCall,
		label: "Follow-up",
		value: "Include your preferred reply method in the message body.",
		href: null,
	},
];

export default function Page() {
	return (
			<main className="relative overflow-hidden bg-[linear-gradient(180deg,#f7fbff_0%,#eef4fb_48%,#dfeaf7_100%)]">
				<div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,rgba(86,174,255,0.32),transparent_34%),radial-gradient(circle_at_top_right,rgba(26,46,90,0.28),transparent_32%)]" />

				<section className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
					<div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
						<div className="max-w-3xl space-y-6">
							<span className="inline-flex items-center rounded-full border border-[#56aeff]/30 bg-[#56aeff]/10 px-4 py-1 text-sm font-medium text-[#1a2e5a] shadow-sm backdrop-blur">
							Contact {siteShortName}
						</span>
						<div className="space-y-4">
								<h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-[#0f1e3d] sm:text-5xl lg:text-6xl">
								Send your question, coordination request, or concern in one place.
							</h1>
								<p className="max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
								Use the form below to reach the conference team directly. We review
								messages carefully and route them to the right person as quickly as
								possible.
							</p>
						</div>
						</div>

						<div className="rounded-3xl border border-white/20 bg-[linear-gradient(135deg,#1a2e5a_0%,#0f1e3d_100%)] p-6 shadow-[0_24px_70px_rgba(15,30,61,0.28)] backdrop-blur">
							<div className="flex items-start gap-4">
								<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#56aeff] text-white shadow-lg shadow-[#56aeff]/30">
								<MessageSquareText className="size-6" />
							</div>
							<div className="space-y-2">
									<p className="text-sm font-medium uppercase tracking-[0.2em] text-[#9dd2ff]">
									Message first
								</p>
									<p className="text-lg font-semibold text-white">
									Tell us what you need and we will handle the rest.
								</p>
									<p className="text-sm leading-6 text-slate-200">
									If your message is time-sensitive, add the deadline in the body so
									it can be prioritized.
								</p>
							</div>
						</div>
					</div>
					</div>

					<div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
						<div className="rounded-[2rem] border border-white/70 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,30,61,0.08)] sm:p-8">
							<div className="mb-8 space-y-2">
								<p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#22959d]">
								Contact form
							</p>
								<h2 className="text-2xl font-semibold tracking-tight text-[#0f1e3d] sm:text-3xl">
								Write to the team
							</h2>
							</div>
							<ContactForm />
						</div>

						<div className="space-y-6">
							<div className="rounded-[2rem] border border-[#1a2e5a]/15 bg-[linear-gradient(135deg,#1a2e5a_0%,#0f1e3d_100%)] p-6 text-white shadow-[0_20px_60px_rgba(15,30,61,0.22)] sm:p-8">
								<p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9dd2ff]">
								Direct contact
							</p>
								<div className="mt-6 space-y-4">
								{contactDetails.map((item) => {
									const Icon = item.icon;

									const content = (
											<div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
												<div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#56aeff]/15 text-[#9dd2ff]">
												<Icon className="size-5" />
											</div>
											<div className="space-y-1">
													<p className="text-sm font-medium text-white/70">
													{item.label}
												</p>
												<p className="text-sm leading-6 text-white">{item.value}</p>
											</div>
										</div>
									);

									return item.href ? (
										<a key={item.label} href={item.href} className="block">
											{content}
										</a>
									) : (
										<div key={item.label}>{content}</div>
									);
								})}
								</div>
							</div>

							<div className="rounded-[2rem] border border-[#56aeff]/20 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,30,61,0.08)] backdrop-blur sm:p-8">
								<p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1a2e5a]">
								Before you send
							</p>
								<ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
								<li>Include your name and a working email address.</li>
								<li>Keep the message focused so we can route it quickly.</li>
								<li>For event concerns, add the topic, date, and any deadline.</li>
							</ul>
                            </div>
						</div>
					</div>
				</section>
			</main>
	);
}
