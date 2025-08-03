import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Calendar,
    Target,
    CheckCircle,
    Clock,
    AlertCircle,
    Edit,
    Trash2
} from 'lucide-react';
import { format, differenceInDays, isAfter, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';

type Goals = {
    id?: number;
    start_date: string;
    end_date: string;
    isSuccess: boolean | null;
    actual_weight: string;
    target_weight: string;
    created_at: string;
}

interface Props {
    goals: Goals[];
    onDelete?: (goalId: number) => void;
}

export default function GoalsList({ goals, onDelete }: Props) {
    const getGoalStatus = (goal: Goals) => {
        const today = new Date();
        const startDate = new Date(goal.start_date);
        const endDate = new Date(goal.end_date);

        if (goal.isSuccess === true) {
            return { status: 'success', label: 'Réussi', color: 'bg-green-500' };
        }

        if (goal.isSuccess === false) {
            return { status: 'failed', label: 'Échoué', color: 'bg-red-500' };
        }

        if (isBefore(today, startDate)) {
            return { status: 'upcoming', label: 'À venir', color: 'bg-blue-500' };
        }

        if (isAfter(today, endDate)) {
            return { status: 'expired', label: 'Expiré', color: 'bg-gray-500' };
        }

        return { status: 'active', label: 'En cours', color: 'bg-orange-500' };
    };

    const getProgress = (goal: Goals) => {
        const today = new Date();
        const startDate = new Date(goal.start_date);
        const endDate = new Date(goal.end_date);

        const totalDays = differenceInDays(endDate, startDate);
        const daysPassed = differenceInDays(today, startDate);

        if (daysPassed < 0) return 0;
        if (daysPassed > totalDays) return 100;

        return Math.round((daysPassed / totalDays) * 100);
    };

    const getDaysRemaining = (goal: Goals) => {
        const today = new Date();
        const endDate = new Date(goal.end_date);
        const days = differenceInDays(endDate, today);

        if (days < 0) return 0;
        return days;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="h-4 w-4" />;
            case 'failed':
                return <AlertCircle className="h-4 w-4" />;
            case 'active':
                return <Clock className="h-4 w-4" />;
            case 'upcoming':
                return <Calendar className="h-4 w-4" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    if (!goals || goals.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <Target className="h-12 w-12 text-muted-foreground mb-4" />
                    <CardTitle className="text-xl text-muted-foreground mb-2">
                        Aucun objectif défini
                    </CardTitle>
                    <CardDescription className="text-center">
                        Commencez par créer votre premier objectif de poids pour suivre vos progrès
                    </CardDescription>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Mes objectifs</h2>
                    <p className="text-muted-foreground">
                        {goals.length} objectif{goals.length > 1 ? 's' : ''} défini{goals.length > 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            <div className="grid gap-4">
                {goals.map((goal, index) => {
                    const { status, label, color } = getGoalStatus(goal);
                    const progress = getProgress(goal);
                    const daysRemaining = getDaysRemaining(goal);
                    const weightDiff = parseFloat(goal.actual_weight) - parseFloat(goal.target_weight);

                    return (
                        <Card key={goal.id || index} className="relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1 h-full ${color}`} />

                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="gap-1">
                                                {getStatusIcon(status)}
                                                {label}
                                            </Badge>
                                            {status === 'active' && (
                                                <Badge variant="outline">
                                                    {daysRemaining} jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''}
                                                </Badge>
                                            )}
                                        </div>
                                        <CardTitle className="text-lg">
                                            Objectif : {goal.target_weight} kg
                                        </CardTitle>
                                        <CardDescription>
                                            Créé le {format(new Date(goal.created_at), 'dd MMMM yyyy', { locale: fr })}
                                        </CardDescription>
                                    </div>

                                    <div className="flex gap-2">
                                        {onDelete && goal.id && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onDelete(goal.id!)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Informations principales */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">
                                            {goal.actual_weight}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Poids actuel (kg)
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-2xl font-bold">
                                            {goal.target_weight}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Objectif (kg)
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-600">
                                            -{weightDiff.toFixed(1)}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            À perdre (kg)
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-2xl font-bold">
                                            {differenceInDays(new Date(goal.end_date), new Date(goal.start_date))}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Durée (jours)
                                        </div>
                                    </div>
                                </div>

                                {/* Période */}
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            Du {format(new Date(goal.start_date), 'dd MMM', { locale: fr })} au {format(new Date(goal.end_date), 'dd MMM yyyy', { locale: fr })}
                                        </span>
                                    </div>
                                </div>

                                {/* Barre de progression */}
                                {status === 'active' && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Progression temporelle</span>
                                            <span className="font-medium">{progress}%</span>
                                        </div>
                                        <Progress value={progress} className="h-2" />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
