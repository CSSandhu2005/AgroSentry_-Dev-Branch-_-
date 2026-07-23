import { cn } from "@/lib/utils";
import { Header } from "@/components/header"; // @efferd/header-2
import { HeroSection } from "@/components/hero";
import { LogosSection } from "@/components/logos-section";
import { Footer } from "@/components/footer";
import { FeatureSection } from "@/components/feature-section";
import { Integrations } from "@/components/integrations";
import { PrismaHero } from "@/components/prisma-hero";

export default function page() {
	return (
		<div className="relative flex min-h-screen flex-col overflow-hidden px-4 supports-[overflow:clip]:overflow-clip">
			<Header />
			<main
				className={cn(
					"relative mx-auto max-w-7xl grow",
					// X Borders
					"before:absolute before:-inset-y-14 before:-left-px before:w-px before:bg-border",
					"after:absolute after:-inset-y-14 after:-right-px after:w-px after:bg-border"
				)}
			>
				<HeroSection />
				<LogosSection />
        <Integrations/>
        <PrismaHero />
        <FeatureSection />
        <Footer />
			</main>
		</div>
	);
}
