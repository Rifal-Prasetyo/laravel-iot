import { Head, Link, useForm } from '@inertiajs/react';
import { useContext, useEffect, useState } from 'react';
import {
    Activity,
    Cpu,
    Filter,
    HardDrive,
    MapPin,
    Plus,
    Radio,
    Search,
    Trash2,
} from 'lucide-react';
import AppLayout, { AppLayoutContext } from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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
import type { Device } from '@/types/iot';

interface Props {
    devices: {
        data: Device[];
        links: any[];
        total: number;
    };
}

export default function DevicesIndex({ devices }: Props) {
    const [search, setSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        location: '',
    });

    const handleCreateDevice = (e: React.FormEvent) => {
        e.preventDefault();
        post('/devices', {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
            },
        });
    };

    const filteredDevices = devices.data.filter((dev) =>
        dev.name.toLowerCase().includes(search.toLowerCase()) ||
        dev.device_code.toLowerCase().includes(search.toLowerCase()) ||
        (dev.location && dev.location.toLowerCase().includes(search.toLowerCase()))
    );

    const appLayoutContext = useContext(AppLayoutContext);

    useEffect(() => {
        appLayoutContext.setBreadcrumbsData([
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'IoT Devices', href: '/devices' },
        ])
    }, []);

    return (
        <>
            <Head title="IoT Devices - LARAVEL-IO" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Header & Controls */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                            IoT Devices
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage microcontrollers, sensors, and message broker endpoints.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2 shadow-sm">
                                    <Plus className="size-4" />
                                    Add New Device
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <form onSubmit={handleCreateDevice}>
                                    <DialogHeader>
                                        <DialogTitle>Register IoT Device</DialogTitle>
                                        <DialogDescription>
                                            Add a new physical board (ESP32, ESP8266, Raspberry Pi, etc.) to your broker network.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">
                                                Device Name <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="e.g. ESP32 Living Room Relay"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                required
                                            />
                                            {errors.name && (
                                                <p className="text-xs text-destructive">{errors.name}</p>
                                            )}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="location">Location / Area</Label>
                                            <Input
                                                id="location"
                                                placeholder="e.g. Living Room, Greenhouse, Workshop"
                                                value={data.location}
                                                onChange={(e) => setData('location', e.target.value)}
                                            />
                                            {errors.location && (
                                                <p className="text-xs text-destructive">{errors.location}</p>
                                            )}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="description">Short Description</Label>
                                            <textarea
                                                id="description"
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Controls ceiling lamps and reads DHT22 temperature sensor"
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                            />
                                            {errors.description && (
                                                <p className="text-xs text-destructive">{errors.description}</p>
                                            )}
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsCreateOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            {processing && <Spinner className="mr-2" />}
                                            Save Device
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Filter devices by name, code, or area..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Device Cards Grid */}
                {filteredDevices.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
                        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                            <Cpu className="size-7" />
                        </div>
                        <h3 className="text-lg font-semibold">No Devices Registered Yet</h3>
                        <p className="max-w-sm text-sm text-muted-foreground mt-1 mb-6">
                            Start by adding your first IoT device. You can then attach RabbitMQ/MQTT topics, configure switches, and set execution schedules.
                        </p>
                        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                            <Plus className="size-4" />
                            Add Your First Device
                        </Button>
                    </Card>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredDevices.map((device) => (
                            <Card
                                key={device.id}
                                className="group relative flex flex-col justify-between overflow-hidden border transition-all duration-200 hover:shadow-md hover:border-primary/40"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                                                <Link href={`/devices/${device.id}`}>
                                                    {device.name}
                                                </Link>
                                            </CardTitle>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                                    {device.device_code}
                                                </span>
                                                {device.location && (
                                                    <span className="flex items-center text-xs text-muted-foreground gap-1">
                                                        <MapPin className="size-3" />
                                                        {device.location}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <Badge
                                            variant={device.status === 'online' ? 'default' : 'secondary'}
                                            className="capitalize"
                                        >
                                            {device.status}
                                        </Badge>
                                    </div>

                                    {device.description && (
                                        <CardDescription className="line-clamp-2 mt-2 text-xs">
                                            {device.description}
                                        </CardDescription>
                                    )}
                                </CardHeader>

                                <CardContent className="py-2 text-xs text-muted-foreground">
                                    <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-2.5">
                                        <div className="flex items-center gap-2">
                                            <Radio className="size-4 text-primary" />
                                            <span>
                                                <strong>{device.topics_count ?? 0}</strong> Topics
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Activity className="size-4 text-emerald-500" />
                                            <span>
                                                <strong>{device.execution_logs_count ?? 0}</strong> Logs
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-2 border-t flex items-center justify-between">
                                    <span className="text-[11px] text-muted-foreground">
                                        Added {new Date(device.created_at).toLocaleDateString()}
                                    </span>
                                    <Button asChild size="sm" variant="ghost" className="gap-1.5">
                                        <Link href={`/devices/${device.id}`}>
                                            Manage Topics &rarr;
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
