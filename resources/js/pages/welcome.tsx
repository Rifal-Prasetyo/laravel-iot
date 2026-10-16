import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    Cpu,
    Lock,
    Radio,
    Repeat,
    Server,
    ShieldCheck,
    Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboard, login } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props as any;

    return (
        <>
            <Head title="LARAVEL-IO - Smart IoT & Message Broker Platform" />

            <div className="relative min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary selection:text-primary-foreground">
                {/* Navbar */}
                <header className="border-b bg-card/60 backdrop-blur-md sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="size-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                                <Cpu className="size-5" />
                            </div>
                            <div>
                                <span className="font-bold tracking-tight text-lg">LARAVEL-IO</span>
                                <span className="text-[10px] ml-1.5 px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono font-medium">
                                    MQTT & AMQP
                                </span>
                            </div>
                        </div>

                        <nav className="flex items-center gap-3">
                            {auth?.user ? (
                                <Button asChild className="gap-2">
                                    <Link href={dashboard()}>
                                        Go to Dashboard
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <Button asChild className="gap-2 shadow-sm">
                                    <Link href={login()}>
                                        Log In
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 max-w-5xl mx-auto text-center">
                    <Badge variant="outline" className="mb-4 gap-1.5 px-3 py-1 text-xs">
                        <Zap className="size-3 text-amber-500 fill-amber-500" />
                        Next-Gen Scalable IoT Middleware
                    </Badge>

                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.15]">
                        Unified Command Center for{' '}
                        <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                            IoT Microcontrollers & Brokers
                        </span>
                    </h1>

                    <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl">
                        Seamlessly bridge ESP32, ESP8266, and Raspberry Pi devices with RabbitMQ AMQP and MQTT brokers. Featuring inverted logic compensation and flexible automation schedules.
                    </p>

                    {/* Admin Credentials Card */}
                    <div className="mt-8 p-4 rounded-xl border bg-card/80 backdrop-blur shadow-sm max-w-md w-full text-left">
                        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-primary">
                            <ShieldCheck className="size-4" />
                            Default Admin Credentials:
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-muted/60 p-2.5 rounded-lg border">
                            <div>
                                <span className="text-muted-foreground block text-[10px] uppercase">Username</span>
                                <strong className="text-foreground">admin</strong>
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-[10px] uppercase">Password</span>
                                <strong className="text-foreground">Indonesia</strong>
                            </div>
                        </div>
                        <div className="mt-3">
                            <Button asChild className="w-full gap-2">
                                <Link href={login()}>
                                    Enter Control Center
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Feature Highlights Grid */}
                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left w-full">
                        <div className="rounded-xl border bg-card p-5 space-y-2.5 shadow-xs">
                            <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                <Server className="size-5" />
                            </div>
                            <h3 className="font-semibold text-sm">RabbitMQ & MQTT Ready</h3>
                            <p className="text-xs text-muted-foreground">
                                High-throughput AMQP and MQTT drivers with automatic fallback to local simulation mode during development.
                            </p>
                        </div>

                        <div className="rounded-xl border bg-card p-5 space-y-2.5 shadow-xs">
                            <div className="size-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                <Repeat className="size-5" />
                            </div>
                            <h3 className="font-semibold text-sm">Inverted Logic Handling</h3>
                            <p className="text-xs text-muted-foreground">
                                Built-in compensation for active-low hardware relays and reversed board wiring logic directly from the UI.
                            </p>
                        </div>

                        <div className="rounded-xl border bg-card p-5 space-y-2.5 shadow-xs">
                            <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                <Activity className="size-5" />
                            </div>
                            <h3 className="font-semibold text-sm">Custom Schedules & Logs</h3>
                            <p className="text-xs text-muted-foreground">
                                Cron, interval, daily and one-off scheduling accompanied by low-latency live execution telemetry.
                            </p>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t py-6 text-center text-xs text-muted-foreground bg-card/40">
                    <p>LARAVEL-IO &copy; 2026. Built with Laravel 12, Inertia.js, React, and Shadcn UI.</p>
                </footer>
            </div>
        </>
    );
}
