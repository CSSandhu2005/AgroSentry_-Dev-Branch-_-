import Link from 'next/link';
import Navbar from '@/components/SuperUI/Navbar';
import { getSession } from '@/lib/session';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sprout,
  Stethoscope,
  Compass,
  Calendar,
  Bot,
  FileText,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Cpu,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    icon: Sprout,
    title: 'AI Crop Recommendation',
    desc: 'Get high-yield crop suggestions tailored to your soil chemistry, water availability, and seasonal forecasts.',
    href: '/recommendation',
    badge: 'Agronomic AI',
  },
  {
    icon: Stethoscope,
    title: 'Disease Diagnostic Scanner',
    desc: 'Upload a leaf photo for instant computer-vision pathogen identification and organic/chemical treatment plans.',
    href: '/disease',
    badge: 'Vision AI',
  },
  {
    icon: Compass,
    title: '3D Spatial Digital Twin',
    desc: 'Map your field on satellite imagery and simulate optimal companion planting & row arrangements in 3D.',
    href: '/spatial-planner',
    badge: 'Spatial Intelligence',
  },
  {
    icon: Calendar,
    title: 'Precision Crop Planner',
    desc: 'Full lifecycle management: sowing dates, automated irrigation schedules, fertilizer doses, and harvest windows.',
    href: '/plan',
    badge: 'Lifecycle Agent',
  },
  {
    icon: Bot,
    title: 'Voice-First AI Assistant',
    desc: 'Multilingual conversational AI supporting Hindi, Kannada, Tamil, Telugu, and English via voice or text.',
    href: '/agent-chat',
    badge: 'Voice AI',
  },
  {
    icon: FileText,
    title: 'Executive Farm Reports',
    desc: 'Generate printable PDF analytical reports summarizing health scores, risk levels, and drone mission logs.',
    href: '/reports',
    badge: 'Analytics',
  },
];

const mandiPrices = [
  { name: 'Wheat', price: '₹2,275/q', change: '+1.2%', up: true },
  { name: 'Rice', price: '₹3,900/q', change: '+0.8%', up: true },
  { name: 'Tomato', price: '₹1,450/q', change: '-3.5%', up: false },
  { name: 'Onion', price: '₹980/q', change: '+2.1%', up: true },
  { name: 'Soybean', price: '₹4,200/q', change: '+0.5%', up: true },
  { name: 'Maize', price: '₹1,820/q', change: '-1.0%', up: false },
  { name: 'Cotton', price: '₹6,500/q', change: '+1.8%', up: true },
  { name: 'Groundnut', price: '₹5,150/q', change: '+0.3%', up: true },
];

export default async function LandingPage() {
  const session = await getSession();
  const loggedIn = !!session.userId;
  const hasProfile = !!session.farmerId;

  return (
    <div className="flex flex-col gap-12 w-full max-w-7xl mx-auto py-6 px-4">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="flex flex-col items-center text-center  pt-8 pb-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mt-20 rounded-full bg-muted border border-border text-xs font-semibold">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Next-Gen Agricultural Intelligence Engine</span>
          <Badge variant="secondary" className="text-[10px] uppercase font-bold">v2.0</Badge>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground max-w-4xl leading-tight">
          Farm Smarter with{' '}
          <span className="bg-gradient-to-r from-emerald-500 via-green-400 to-lime-400 bg-clip-text text-transparent">
            Multi-Agent AI Intelligence
          </span>
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Voice-first AI platform for Indian agriculture. Get real-time crop advice, automated pest diagnosis, 3D spatial mapping, and autonomous drone flight rosters.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {loggedIn ? (
            <Link
              href={hasProfile ? '/dashboard' : '/intake'}
              className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-bold text-sm inline-flex items-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
            >
              {hasProfile ? 'Launch AI Dashboard' : 'Complete Setup'} <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-bold text-sm inline-flex items-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
              >
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="h-12 px-8 rounded-xl border border-input bg-background text-foreground font-semibold text-sm inline-flex items-center hover:bg-accent transition-colors"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Quick status bar */}
        {loggedIn && (
          <div className="p-3 rounded-xl bg-muted/60 border border-border text-xs text-muted-foreground flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Logged in as <strong>{session.email || 'Farmer User'}</strong>.</span>
            <Link href="/dashboard" className="text-primary font-bold hover:underline">
              Go to Dashboard →
            </Link>
          </div>
        )}
      </section>

      {/* ── Live Mandi Price Ticker ── */}
      <div className="w-full rounded-2xl bg-card border border-border p-4 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 mb-3">
          <Badge variant="outline" className="text-[10px] font-extrabold uppercase tracking-wider gap-1">
            <TrendingUp className="h-3 w-3 text-primary" /> Live Mandi Commodity Rates
          </Badge>
          <span className="text-xs text-muted-foreground">Updated hourly</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {mandiPrices.map((item, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-muted/30 border border-border text-center">
              <div className="text-xs font-bold text-foreground">{item.name}</div>
              <div className="text-[11px] font-semibold text-muted-foreground mt-0.5">{item.price}</div>
              <span className={`text-[10px] font-bold mt-1 inline-block ${item.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                {item.up ? '▲' : '▼'} {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Feature Cards Grid ── */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
            AI Platform Capabilities
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Powered by 6 Specialized AI Agents
          </h2>
          <p className="text-xs text-muted-foreground">
            Every module works together to maximize crop yields and minimize input costs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const IconComponent = f.icon;
            return (
              <Card key={f.title} className="flex flex-col justify-between border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {f.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-foreground">{f.title}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground leading-relaxed mt-1">
                    {f.desc}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link
                    href={loggedIn ? f.href : '/signup'}
                    className="w-full flex items-center justify-between text-xs font-semibold py-1.5 text-foreground hover:text-primary transition-colors border-t border-border mt-2 pt-2"
                  >
                    <span>Explore Capability</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ── Drone & Satellite Tech Spotlight ── */}
      <section className="p-8 rounded-3xl bg-card border border-border shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">
            <Cpu className="h-3 w-3 text-primary mr-1" /> Autonomous Drone & Satellite Tech
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Real-time Aerial Surveys & Satellite Twin
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            AgroSentry automatically generates flight path missions for autonomous agricultural drones. Monitor crop canopy health, spot irrigation stress, and save field boundaries directly from satellite overlays.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> Autonomous Flight Pathing
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> Centroid & Area Polygon Saved
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> Real-time Water Saving Analytics
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> Multilingual Voice Interface
            </div>
          </div>
        </div>

        <div className="w-full lg:w-96 p-6 rounded-2xl bg-muted/40 border border-border flex flex-col gap-4 text-center">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mx-auto">
            <Bot className="h-7 w-7" />
          </div>
          <div>
            <div className="text-base font-bold text-foreground">AgroSentry Command Center</div>
            <div className="text-xs text-muted-foreground mt-1">Access all 6 agents from a single unified dashboard.</div>
          </div>
          <Link
            href={loggedIn ? '/dashboard' : '/signup'}
            className="h-10 rounded-xl bg-primary text-primary-foreground text-xs font-bold inline-flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity"
          >
            {loggedIn ? 'Open Dashboard' : 'Start Free Account'}
          </Link>
        </div>
      </section>

      {/* ── Final Call to Action ── */}
      <section className="text-center py-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-black text-foreground">
          Ready to Modernize Your Agriculture?
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground max-w-md mx-auto">
          Join thousands of farmers using AI-driven precision agriculture for higher yields and sustainable farming.
        </p>
        <div className="pt-2">
          <Link
            href={loggedIn ? '/dashboard' : '/signup'}
            className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-bold text-sm inline-flex items-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
          >
            {loggedIn ? 'Access AI Dashboard' : 'Create Free Account'} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
