import { Head, Link, router, useForm } from '@inertiajs/react';
import { useContext, useEffect, useState } from 'react';
import {
    Activity,
    ArrowLeft,
    Calendar,
    Clock,
    Cpu,
    ExternalLink,
    Play,
    Plus,
    Radio,
    RefreshCw,
    Repeat,
    Sliders,
    Trash2,
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import type { Device, DeviceTopic } from '@/types/iot';

interface Props {
    device: Device;
}

export default function DeviceShow({ device }: Props) {
    const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
    const [editingTopic, setEditingTopic] = useState<DeviceTopic | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        protocol: 'amqp',
        exchange: 'amq.topic',
        routing_key: '',
        payload_type: 'switch',
        is_inverted: false,
        string_payload: '',
        active_payload: '1',
        inactive_payload: '0',
        schedule_type: 'none',
        schedule_value: '',
        schedule_days: [] as string[],
        is_enabled: true,
    });

    const resetForm = () => {
        setData({
            name: '',
            protocol: 'amqp',
            exchange: 'amq.topic',
            routing_key: '',
            payload_type: 'switch',
            is_inverted: false,
            string_payload: '',
            active_payload: '1',
            inactive_payload: '0',
            schedule_type: 'none',
            schedule_value: '',
            schedule_days: [],
            is_enabled: true,
        });
        setEditingTopic(null);
    };

    const openEditModal = (topic: DeviceTopic) => {
        setEditingTopic(topic);
        setData({
            name: topic.name,
            protocol: topic.protocol || 'amqp',
            exchange: topic.exchange || 'amq.topic',
            routing_key: topic.routing_key,
            payload_type: topic.payload_type,
            is_inverted: topic.is_inverted,
            string_payload: topic.string_payload || '',
            active_payload: topic.active_payload || '1',
            inactive_payload: topic.inactive_payload || '0',
            schedule_type: topic.schedule_type,
            schedule_value: topic.schedule_value || '',
            schedule_days: (topic.schedule_days as string[]) || [],
            is_enabled: topic.is_enabled,
        });
        setIsAddTopicOpen(true);
    };

    const handleSubmitTopic = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTopic) {
            put(`/topics/${editingTopic.id}`, {
                onSuccess: () => {
                    setIsAddTopicOpen(false);
                    resetForm();
                },
            });
        } else {
            post(`/devices/${device.id}/topics`, {
                onSuccess: () => {
                    setIsAddTopicOpen(false);
                    resetForm();
                },
            });
        }
    };

    const handleToggleTopic = (topic: DeviceTopic) => {
        router.post(`/topics/${topic.id}/toggle`, {
            preserveScroll: true,
        });
    };

    const handleTriggerTopic = (topic: DeviceTopic) => {
        router.post(`/topics/${topic.id}/trigger`, {}, {
            preserveScroll: true,
        });
    };

    const handleDeleteTopic = (topic: DeviceTopic) => {
        if (confirm(`Delete topic "${topic.name}"?`)) {
            router.delete(`/topics/${topic.id}`, {
                preserveScroll: true,
            });
        }
    };

    const handleDeleteDevice = () => {
        if (confirm(`Are you sure you want to delete device "${device.name}"?`)) {
            router.delete(`/devices/${device.id}`);
        }
    };

    const appLayoutContext = useContext(AppLayoutContext);

    useEffect(() => {
        appLayoutContext.setBreadcrumbsData([
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'IoT Devices', href: '/devices' },
            { title: device.name, href: `/devices/${device.id}` },
        ])
    }, []);


    return (
        <>
            <Head title={`${device.name} - LARAVEL-IO`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Back Link & Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Button asChild variant="outline" size="sm" className="h-8 gap-1">
                                <Link href="/devices">
                                    <ArrowLeft className="size-3.5" />
                                    Back to Devices
                                </Link>
                            </Button>
                            <Badge variant={device.status === 'online' ? 'default' : 'secondary'}>
                                {device.status}
                            </Badge>
                            <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted">
                                {device.device_code}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                            {device.name}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {device.description || 'No description provided.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Dialog
                            open={isAddTopicOpen}
                            onOpenChange={(open) => {
                                setIsAddTopicOpen(open);
                                if (!open) resetForm();
                            }}
                        >
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Plus className="size-4" />
                                    Add Message Topic
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                                <form onSubmit={handleSubmitTopic}>
                                    <DialogHeader>
                                        <DialogTitle>
                                            {editingTopic ? 'Edit Topic / Endpoint' : 'Add Message Broker Topic'}
                                        </DialogTitle>
                                        <DialogDescription>
                                            Configure RabbitMQ or MQTT topic, payload behavior, inverted logic, and custom schedules.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="grid gap-4 py-4 text-sm">
                                        {/* Name */}
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="topic-name">Topic Label / Name *</Label>
                                            <Input
                                                id="topic-name"
                                                placeholder="e.g. Relay Channel 1 or DHT22 Telemetry"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                required
                                            />
                                            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                                        </div>

                                        {/* Protocol & Exchange */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="grid gap-1.5">
                                                <Label htmlFor="protocol">Broker Protocol</Label>
                                                <select
                                                    id="protocol"
                                                    value={data.protocol}
                                                    onChange={(e) => setData('protocol', e.target.value)}
                                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                >
                                                    <option value="amqp">RabbitMQ (AMQP 0-9-1)</option>
                                                    <option value="mqtt">MQTT Protocol</option>
                                                </select>
                                            </div>

                                            <div className="grid gap-1.5">
                                                <Label htmlFor="exchange">Exchange (AMQP)</Label>
                                                <Input
                                                    id="exchange"
                                                    placeholder="amq.topic"
                                                    value={data.exchange}
                                                    onChange={(e) => setData('exchange', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Routing Key */}
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="routing_key">
                                                Routing Key / Topic Name *
                                            </Label>
                                            <Input
                                                id="routing_key"
                                                placeholder="e.g. home.livingroom.light.relay1"
                                                value={data.routing_key}
                                                onChange={(e) => setData('routing_key', e.target.value)}
                                                required
                                            />
                                            {errors.routing_key && (
                                                <p className="text-xs text-destructive">{errors.routing_key}</p>
                                            )}
                                        </div>

                                        {/* Payload Type */}
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="payload_type">Payload Format</Label>
                                            <select
                                                id="payload_type"
                                                value={data.payload_type}
                                                onChange={(e) => setData('payload_type', e.target.value)}
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                            >
                                                <option value="switch">Switch Mode (Toggle 0/1 or ON/OFF)</option>
                                                <option value="string">Custom String</option>
                                                <option value="json">Raw JSON</option>
                                            </select>
                                        </div>

                                        {/* Switch Specific Options */}
                                        {data.payload_type === 'switch' && (
                                            <div className="rounded-lg border bg-muted/40 p-3 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label className="text-xs font-semibold">
                                                            Inverted Logic Mode (Logika Terbalik)
                                                        </Label>
                                                        <p className="text-[11px] text-muted-foreground">
                                                            Aktifkan jika modul board IoT Anda wired terbalik (misal relay aktif LOW: kirim 0 saat ON, dan kirim 1 saat OFF).
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={data.is_inverted}
                                                        onCheckedChange={(checked) => setData('is_inverted', checked)}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                                                    <div>
                                                        <Label className="text-xs">ON Value (Active)</Label>
                                                        <Input
                                                            className="h-8 text-xs"
                                                            value={data.active_payload}
                                                            onChange={(e) => setData('active_payload', e.target.value)}
                                                            placeholder="1"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs">OFF Value (Inactive)</Label>
                                                        <Input
                                                            className="h-8 text-xs"
                                                            value={data.inactive_payload}
                                                            onChange={(e) => setData('inactive_payload', e.target.value)}
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* String / JSON specific option */}
                                        {(data.payload_type === 'string' || data.payload_type === 'json') && (
                                            <div className="grid gap-1.5">
                                                <Label htmlFor="string_payload">Payload Content</Label>
                                                <textarea
                                                    id="string_payload"
                                                    rows={3}
                                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs font-mono shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                    placeholder='{"action": "ping", "unit": "celsius"}'
                                                    value={data.string_payload}
                                                    onChange={(e) => setData('string_payload', e.target.value)}
                                                />
                                            </div>
                                        )}

                                        {/* Custom Schedule Section */}
                                        <div className="rounded-lg border p-3 space-y-3 bg-card">
                                            <div className="flex items-center gap-1.5 font-medium text-xs">
                                                <Clock className="size-3.5 text-primary" />
                                                <span>Custom Execution Schedule (Jadwal Eksekusi)</span>
                                            </div>

                                            <div className="grid gap-2">
                                                <select
                                                    value={data.schedule_type}
                                                    onChange={(e) => setData('schedule_type', e.target.value)}
                                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                >
                                                    <option value="none">Manual Trigger Only (No Schedule)</option>
                                                    <option value="interval">Periodic Interval (Every X Minutes)</option>
                                                    <option value="daily">Daily At Specific Time (Jam:Menit)</option>
                                                    <option value="cron">Custom Cron Expression</option>
                                                    <option value="once">One-off DateTime (Sekali Eksekusi)</option>
                                                </select>

                                                {data.schedule_type === 'interval' && (
                                                    <div className="grid gap-1">
                                                        <Label className="text-xs">Interval (dalam menit)</Label>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            placeholder="Contoh: 15 (setiap 15 menit)"
                                                            value={data.schedule_value}
                                                            onChange={(e) => setData('schedule_value', e.target.value)}
                                                        />
                                                    </div>
                                                )}

                                                {data.schedule_type === 'daily' && (
                                                    <div className="grid gap-2">
                                                        <div className="grid gap-1">
                                                            <Label className="text-xs">Jam Eksekusi (Format 24 Jam, HH:MM)</Label>
                                                            <Input
                                                                type="time"
                                                                value={data.schedule_value}
                                                                onChange={(e) => setData('schedule_value', e.target.value)}
                                                            />
                                                        </div>
                                                        <p className="text-[11px] text-muted-foreground">
                                                            Dieksekusi otomatis setiap hari pada jam tersebut via background worker.
                                                        </p>
                                                    </div>
                                                )}

                                                {data.schedule_type === 'cron' && (
                                                    <div className="grid gap-1.5">
                                                        <Label className="text-xs">Cron Expression (5 bagian)</Label>
                                                        <Input
                                                            className="font-mono text-xs"
                                                            placeholder="*/5 * * * *"
                                                            value={data.schedule_value}
                                                            onChange={(e) => setData('schedule_value', e.target.value)}
                                                        />
                                                        <div className="flex flex-wrap gap-1 text-[11px]">
                                                            <button
                                                                type="button"
                                                                onClick={() => setData('schedule_value', '* * * * *')}
                                                                className="px-1.5 py-0.5 rounded bg-muted hover:bg-muted/80"
                                                            >
                                                                Tiap Menit (* * * * *)
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setData('schedule_value', '*/5 * * * *')}
                                                                className="px-1.5 py-0.5 rounded bg-muted hover:bg-muted/80"
                                                            >
                                                                Tiap 5 Menit (*/5 * * * *)
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setData('schedule_value', '0 * * * *')}
                                                                className="px-1.5 py-0.5 rounded bg-muted hover:bg-muted/80"
                                                            >
                                                                Tiap Jam (0 * * * *)
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {data.schedule_type === 'once' && (
                                                    <div className="grid gap-1">
                                                        <Label className="text-xs">Waktu Eksekusi</Label>
                                                        <Input
                                                            type="datetime-local"
                                                            value={data.schedule_value}
                                                            onChange={(e) => setData('schedule_value', e.target.value)}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setIsAddTopicOpen(false);
                                                resetForm();
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            {processing && <Spinner className="mr-2" />}
                                            {editingTopic ? 'Update Topic' : 'Add Topic'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={handleDeleteDevice}
                            title="Delete Device"
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                </div>

                {/* Topics Grid */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Radio className="size-5 text-primary" />
                            Message Broker Topics & Controls ({device.topics?.length ?? 0})
                        </h2>
                    </div>

                    {!device.topics || device.topics.length === 0 ? (
                        <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed">
                            <Radio className="size-8 text-muted-foreground/60 mb-2" />
                            <h3 className="font-semibold text-sm">No Topics Configured</h3>
                            <p className="text-xs text-muted-foreground mt-1 mb-4 max-w-sm">
                                Create a topic to link this device with RabbitMQ routing keys, interactive switches, and automation schedules.
                            </p>
                            <Button size="sm" onClick={() => setIsAddTopicOpen(true)}>
                                Add First Topic
                            </Button>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {device.topics.map((topic) => (
                                <Card
                                    key={topic.id}
                                    className="flex flex-col justify-between border shadow-xs transition-all hover:border-primary/50"
                                >
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="space-y-0.5">
                                                <CardTitle className="text-base font-semibold">
                                                    {topic.name}
                                                </CardTitle>
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                                        {topic.routing_key}
                                                    </span>
                                                    <Badge variant="outline" className="text-[10px] uppercase font-mono">
                                                        {topic.protocol}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {topic.payload_type === 'switch' && (
                                                <div className="flex flex-col items-end gap-1">
                                                    <Switch
                                                        checked={topic.switch_state}
                                                        onCheckedChange={() => handleToggleTopic(topic)}
                                                    />
                                                    <span className="text-[10px] font-semibold uppercase">
                                                        {topic.switch_state ? 'ON' : 'OFF'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <CardDescription className="text-xs pt-2">
                                            Exchange: <span className="font-mono text-foreground">{topic.exchange}</span>
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-2 py-2 text-xs">
                                        {/* Inverted logic indicator */}
                                        {topic.payload_type === 'switch' && topic.is_inverted && (
                                            <div className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                                                <Repeat className="size-3" />
                                                Inverted Wiring Logic Active
                                            </div>
                                        )}

                                        {/* Schedule indicator */}
                                        {topic.schedule_type !== 'none' && (
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Calendar className="size-3.5 text-primary" />
                                                <span>
                                                    Schedule: <strong className="text-foreground capitalize">{topic.schedule_type}</strong> ({topic.schedule_value})
                                                </span>
                                            </div>
                                        )}

                                        {/* Last status & payload sent */}
                                        {topic.last_dispatched_at && (
                                            <div className="rounded bg-muted/50 p-2 text-[11px] space-y-1">
                                                <div className="flex items-center justify-between text-muted-foreground">
                                                    <span>Last sent: {new Date(topic.last_dispatched_at).toLocaleTimeString()}</span>
                                                    <Badge
                                                        variant={
                                                            topic.last_status === 'success'
                                                                ? 'default'
                                                                : topic.last_status === 'simulated'
                                                                    ? 'secondary'
                                                                    : 'destructive'
                                                        }
                                                        className="text-[10px] py-0 px-1.5 capitalize"
                                                    >
                                                        {topic.last_status}
                                                    </Badge>
                                                </div>
                                                <div className="truncate font-mono">
                                                    Payload: <span className="font-semibold text-foreground">{topic.last_payload_sent}</span>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>

                                    <div className="p-3 pt-0 border-t mt-2 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleTriggerTopic(topic)}
                                                className="gap-1.5 h-7 text-xs"
                                                title="Send broker message immediately"
                                            >
                                                <Play className="size-3 fill-current" />
                                                Publish Now
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => openEditModal(topic)}
                                                className="h-7 text-xs"
                                            >
                                                Edit
                                            </Button>
                                        </div>

                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleDeleteTopic(topic)}
                                            className="size-7 text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Execution Logs Table */}
                <div className="space-y-3 pt-4 border-t">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Activity className="size-5 text-emerald-500" />
                        Recent Broker Execution Logs ({device.execution_logs?.length ?? 0})
                    </h2>

                    {!device.execution_logs || device.execution_logs.length === 0 ? (
                        <div className="rounded-lg border p-6 text-center text-xs text-muted-foreground">
                            No messages have been published for this device yet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b bg-muted/60 text-muted-foreground uppercase text-[10px]">
                                    <tr>
                                        <th className="px-3 py-2.5">Time</th>
                                        <th className="px-3 py-2.5">Routing Key</th>
                                        <th className="px-3 py-2.5">Payload</th>
                                        <th className="px-3 py-2.5">Triggered By</th>
                                        <th className="px-3 py-2.5">Status</th>
                                        <th className="px-3 py-2.5">Latency</th>
                                        <th className="px-3 py-2.5">Response Message</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {device.execution_logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-muted/30">
                                            <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">
                                                {new Date(log.created_at).toLocaleTimeString()}
                                            </td>
                                            <td className="px-3 py-2 font-mono">{log.routing_key}</td>
                                            <td className="px-3 py-2 font-mono font-medium">{log.payload_sent}</td>
                                            <td className="px-3 py-2 capitalize">{log.triggered_by}</td>
                                            <td className="px-3 py-2">
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
                                            </td>
                                            <td className="px-3 py-2 text-muted-foreground">
                                                {log.execution_time_ms !== null ? `${log.execution_time_ms} ms` : '-'}
                                            </td>
                                            <td className="px-3 py-2 text-muted-foreground truncate max-w-xs">
                                                {log.response_message || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
