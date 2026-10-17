import { Head, Link, router } from '@inertiajs/react';
import {
    Activity,
    CheckCircle2,
    Clock,
    Cpu,
    ExternalLink,
    Play,
    Plus,
    Radio,
    Repeat,
    Server,
    Sliders,
    Wifi,
    Zap,
} from 'lucide-react';
import AppLayout, { AppLayoutContext } from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import type { BrokerInfo, DashboardStats, Device, DeviceExecutionLog, DeviceTopic } from '@/types/iot';
import { useContext, useEffect } from 'react';

interface Props {
    stats: DashboardStats;
    quick_switches: DeviceTopic[];
    recent_logs: DeviceExecutionLog[];
    recent_devices: Device[];
    broker_info: BrokerInfo;
}

export default function Dashboard({
    stats,
    quick_switches,
    recent_logs,
    recent_devices,
    broker_info,
}: Props) {
    const handleToggle = (topic: DeviceTopic) => {
        router.post(`/topics/${topic.id}/toggle`, {}, {
            preserveScroll: true,
        });
    };

    const handleTrigger = (topic: DeviceTopic) => {
        router.post(`/topics/${topic.id}/trigger`, {}, {
            preserveScroll: true,
        });
    };

    const appLayoutContext = useContext(AppLayoutContext);

    useEffect(() => {
        appLayoutContext.setBreadcrumbsData([{ title: 'Dashboard', href: '/dashboard' }])
    }, []);

    return (
        <>
            <Head title="IoT Dashboard - LARAVEL-IO" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                            IoT Operations Center
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Real-time message broker controller and device telemetry.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button asChild className="gap-2">
                            <Link href="/devices">
                                <Plus className="size-4" />
                                Add / Manage Devices
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Metric Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border shadow-xs">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Total Devices
                            </CardTitle>
                            <Cpu className="size-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.devices_count}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats.online_devices_count} online / active
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-xs">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Broker Topics
                            </CardTitle>
                            <Radio className="size-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.topics_count}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats.active_topics_count} enabled endpoints
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-xs">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Executions Today
                            </CardTitle>
                            <Activity className="size-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.executions_today}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Messages dispatched today
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-xs">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Broker Engine
                            </CardTitle>
                            <Server className="size-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-1.5 font-bold text-xl uppercase">
                                {broker_info.default}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {broker_info.auto_fallback ? 'Auto-fallback enabled' : 'Strict mode'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Controls Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold flex items-center gap-2">
                            <Zap className="size-4 text-amber-500" />
                            Quick Controls (Active Switches)
                        </h2>
                        <span className="text-xs text-muted-foreground">
                            Instant broker dispatch
                        </span>
                    </div>

                    {quick_switches.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">
                            No switch-type topics created yet. When you configure topics with "Switch Mode", they will appear here for fast one-tap control!
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {quick_switches.map((topic) => (
                                <Card
                                    key={topic.id}
                                    className="border shadow-xs transition-all hover:border-primary/40"
                                >
                                    <CardHeader className="p-4 pb-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="space-y-0.5 truncate">
                                                <CardTitle className="text-sm font-semibold truncate">
                                                    {topic.name}
                                                </CardTitle>
                                                <p className="text-[11px] text-muted-foreground truncate">
                                                    {topic.device?.name}
                                                </p>
                                            </div>
                                            <Switch
                                                checked={topic.switch_state}
                                                onCheckedChange={() => handleToggle(topic)}
                                            />
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-4 pt-1 text-xs">
                                        <div className="flex items-center justify-between mt-2 pt-2 border-t text-[11px]">
                                            <span className="font-mono text-muted-foreground truncate max-w-[140px]">
                                                {topic.routing_key}
                                            </span>
                                            <span className="font-semibold uppercase text-xs">
                                                {topic.switch_state ? 'ON' : 'OFF'}
                                            </span>
                                        </div>
                                        {topic.is_inverted && (
                                            <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                                                <Repeat className="size-2.5" />
                                                Inverted logic
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Lower Grid: Recent Devices & Logs */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Recent Devices */}
                    <Card className="border shadow-xs lg:col-span-1">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold">
                                    Registered Devices
                                </CardTitle>
                                <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                                    <Link href="/devices">View All</Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3 text-xs">
                            {recent_devices.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">
                                    No devices yet.
                                </p>
                            ) : (
                                recent_devices.map((dev) => (
                                    <div
                                        key={dev.id}
                                        className="flex items-center justify-between p-2.5 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                                    >
                                        <div className="space-y-0.5">
                                            <Link
                                                href={`/devices/${dev.id}`}
                                                className="font-medium hover:underline text-foreground"
                                            >
                                                {dev.name}
                                            </Link>
                                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                                <span className="font-mono">{dev.device_code}</span>
                                                <span>&bull;</span>
                                                <span>{dev.topics_count ?? 0} topics</span>
                                            </div>
                                        </div>
                                        <Badge
                                            variant={dev.status === 'online' ? 'default' : 'secondary'}
                                            className="text-[10px] capitalize"
                                        >
                                            {dev.status}
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Execution Feed */}
                    <Card className="border shadow-xs lg:col-span-2">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Activity className="size-4 text-emerald-500" />
                                    Live Message Log Stream
                                </CardTitle>
                                <span className="text-xs text-muted-foreground">
                                    Latest {recent_logs.length} events
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {recent_logs.length === 0 ? (
                                <p className="text-xs text-muted-foreground text-center py-8">
                                    No messages logged yet. Trigger a switch or schedule to see logs.
                                </p>
                            ) : (
                                <div className="divide-y text-xs">
                                    {recent_logs.map((log) => (
                                        <div
                                            key={log.id}
                                            className="flex items-center justify-between p-3 hover:bg-muted/20"
                                        >
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-semibold text-foreground">
                                                        {log.routing_key}
                                                    </span>
                                                    <Badge
                                                        variant={
                                                            log.status === 'success'
                                                                ? 'default'
                                                                : log.status === 'simulated'
                                                                    ? 'secondary'
                                                                    : 'destructive'
                                                        }
                                                        className="text-[10px] py-0 capitalize"
                                                    >
                                                        {log.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground">
                                                    Payload: <span className="font-mono font-medium text-foreground">{log.payload_sent}</span>
                                                    {' '}&bull; Trigger: {log.triggered_by}
                                                    {' '}&bull; {log.device?.name || 'Device'}
                                                </p>
                                            </div>

                                            <div className="text-right text-[11px] text-muted-foreground whitespace-nowrap">
                                                <div>{new Date(log.created_at).toLocaleTimeString()}</div>
                                                <div>{log.execution_time_ms ? `${log.execution_time_ms}ms` : ''}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
