import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Target, TrendingDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import React from 'react';
import GoalsList from '@/components/goal-list';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mon panel',
        href: '/dashboard',
    },
    {
        title: 'Mes objectifs',
        href: '/dashboard',
    },
];

type Goals = {
    start_date: string;
    end_date: string;
    isSuccess: boolean | null;
    actual_weight: string;
    target_weight: string;
    created_at: string;
}

interface Props {
    goals: Goals[];
}

export default function Goals({ goals }: Props) {
    const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
    const [startOpen, setStartOpen] = React.useState(false);
    const [endOpen, setEndOpen] = React.useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<Required<Goals>>({
        start_date: '',
        end_date:  '',
        isSuccess:  null,
        actual_weight:  '',
        target_weight:  '',
        created_at:  '',
    });

    const handleDelete = (goalId: number) => {

        router.delete(route('goals-delete', goalId), {
            onSuccess: () => {
                console.log('Objectif supprimé.');
            },
            onError: (errors) => {
                console.error('Erreur lors de la suppression', errors);
            },
        });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('goals-store'), {
            onSuccess: () => {
                toast('Objectif enregistré avec succès !');
                reset();
                setStartDate(undefined);
                setEndDate(undefined);
            }
        });
    };

    const handleStartDateSelect = (date: Date | undefined) => {
        setStartDate(date);
        setData('start_date', date ? format(date, 'yyyy-MM-dd') : '');
        setStartOpen(false);
    };

    const handleEndDateSelect = (date: Date | undefined) => {
        setEndDate(date);
        setData('end_date', date ? format(date, 'yyyy-MM-dd') : '');
        setEndOpen(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes objectifs" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">

                <div className="grid gap-6 max-w-2xl mx-auto w-full">

                    {/* Header Card */}
                    <Card>
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                <Target className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">Définir mes objectifs</CardTitle>
                            <CardDescription>
                                Fixez-vous un objectif de poids et une période pour l'atteindre
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Form Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingDown className="h-5 w-5" />
                                Nouvel objectif
                            </CardTitle>
                            <CardDescription>
                                Remplissez les informations pour créer votre objectif de poids
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">

                                {/* Poids actuel et objectif */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="actual_weight">Poids actuel (kg)</Label>
                                        <Input
                                            id="actual_weight"
                                            type="number"
                                            step="0.1"
                                            placeholder="Ex: 75.5"
                                            value={data.actual_weight}
                                            onChange={(e) => setData('actual_weight', e.target.value)}
                                            className={errors.actual_weight ? 'border-destructive' : ''}
                                        />
                                        {errors.actual_weight && (
                                            <p className="text-sm text-destructive">{errors.actual_weight}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="target_weight">Poids objectif (kg)</Label>
                                        <Input
                                            id="target_weight"
                                            type="number"
                                            step="0.1"
                                            placeholder="Ex: 70.0"
                                            value={data.target_weight}
                                            onChange={(e) => setData('target_weight', e.target.value)}
                                            className={errors.target_weight ? 'border-destructive' : ''}
                                        />
                                        {errors.target_weight && (
                                            <p className="text-sm text-destructive">{errors.target_weight}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Date de début</Label>
                                        <Popover open={startOpen} onOpenChange={setStartOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !startDate && "text-muted-foreground",
                                                        errors.start_date && "border-destructive"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {startDate ? (
                                                        format(startDate, "dd MMMM yyyy", { locale: fr })
                                                    ) : (
                                                        "Sélectionner une date"
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={startDate}
                                                    onSelect={handleStartDateSelect}
                                                    locale={fr}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {errors.start_date && (
                                            <p className="text-sm text-destructive">{errors.start_date}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Date de fin</Label>
                                        <Popover open={endOpen} onOpenChange={setEndOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !endDate && "text-muted-foreground",
                                                        errors.end_date && "border-destructive"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {endDate ? (
                                                        format(endDate, "dd MMMM yyyy", { locale: fr })
                                                    ) : (
                                                        "Sélectionner une date"
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={endDate}
                                                    onSelect={handleEndDateSelect}
                                                    locale={fr}
                                                    initialFocus
                                                    disabled={(date) =>
                                                        startDate ? date <= startDate : false
                                                    }
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {errors.end_date && (
                                            <p className="text-sm text-destructive">{errors.end_date}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Calcul automatique de la différence */}
                                {data.actual_weight && data.target_weight && (
                                    <div className="rounded-lg bg-muted/50 p-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span>Perte de poids prévue :</span>
                                            <span className="font-medium">
                                                {(parseFloat(data.actual_weight) - parseFloat(data.target_weight)).toFixed(1)} kg
                                            </span>
                                        </div>
                                        {startDate && endDate && (
                                            <div className="flex items-center justify-between text-sm mt-2">
                                                <span>Durée :</span>
                                                <span className="font-medium">
                                                    {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} jours
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                    size="lg"
                                >
                                    {processing ? 'Enregistrement...' : 'Créer mon objectif'}
                                </Button>

                            </form>
                        </CardContent>
                    </Card>
                </div>
                <GoalsList
                    goals={goals}
                    onDelete={handleDelete}
                />
            </div>
        </AppLayout>
    );
}
