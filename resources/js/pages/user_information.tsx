import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    Activity, Calculator,
    CalendarIcon, ChevronDown,
    Clock,
    Dumbbell,
    Info, Ruler, Scale,
    Shield,
    Target,
    TrendingUp, User,
    Utensils
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import React, { FormEventHandler, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mon panel',
        href: '/dashboard',
    },
    {
        title: 'Information',
        href: '/information-board',
    },
];

type UserInformationForm = {
    birthdate: string;
    gender: string;
    height: string;
    weight: string;
    level: string;
    sport: string;
    frequencies: string;
};

interface Props {
    userInformation: Partial<UserInformationForm> | null;
}

export default function UserInformation({ userInformation }: Props) {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined)

    const { data, setData, post, processing, errors, reset } = useForm<Required<UserInformationForm>>({
        birthdate: userInformation?.birthdate || '',
        gender: userInformation?.gender || '',
        height: userInformation?.height || '',
        weight: userInformation?.weight || '',
        level: userInformation?.level || '',
        sport: userInformation?.sport || '',
        frequencies: userInformation?.frequencies || '',
    });

    useEffect(() => {
        if (userInformation?.birthdate) {
            setDate(new Date(userInformation.birthdate));
        }
    }, [userInformation]);


    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('information-board-store'), {
            onSuccess: ()=>{
                toast('Information enregistrée')
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mon panel" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 shadow-sm border">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">
                        Informations corporelles
                    </h1>
                    <h3 className="text-muted-foreground leading-relaxed">
                        Entrez vos informations pour pouvoir débloquer toutes les fonctionnalités de l'application
                    </h3>
                </div>

                {/* Disclaimer avec shadcn Alert */}
                <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                        <div className="space-y-2">
                            <h4 className="font-medium">
                                Protection de vos données
                            </h4>
                            <p className="text-sm leading-relaxed">
                                Vos informations personnelles sont sécurisées et utilisées uniquement pour personnaliser
                                votre expérience nutritionnelle.
                                Nous ne partageons jamais vos données avec des tiers et vous pouvez les modifier ou les
                                supprimer à tout moment dans les paramètres.
                            </p>
                        </div>
                    </AlertDescription>
                </Alert>

                {/* Formulaire amélioré */}
                <form onSubmit={submit} className="space-y-8">
                    {/* Section Informations personnelles */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b">
                            <User className="h-5 w-5" />
                            <h3 className="text-lg font-semibold">Informations personnelles</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Votre civilité
                                </Label>
                                <Select
                                    value={data?.gender}
                                    onValueChange={(value) => setData('gender', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Sélectionnez votre civilité" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Homme</SelectItem>
                                        <SelectItem value="female">Femme</SelectItem>
                                        <SelectItem value="other">Autre</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date" className="text-sm font-medium flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4" />
                                    Date de naissance
                                </Label>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="date"
                                            className="w-full justify-between font-normal"
                                        >
                                            {date ? date.toLocaleDateString() : "Sélectionnez votre date de naissance"}
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                setDate(date);
                                                if (date) setData('birthdate', date.toISOString().split('T')[0]);
                                                setOpen(false);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>

                    {/* Section Mesures corporelles */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b">
                            <Scale className="h-5 w-5" />
                            <h3 className="text-lg font-semibold">Mesures corporelles</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="weight" className="text-sm font-medium flex items-center gap-2">
                                    <Scale className="h-4 w-4" />
                                    Votre poids (en kg)
                                </Label>
                                <Input
                                    type="number"
                                    id="weight"
                                    placeholder="Ex: 70.5"
                                    className="w-full"
                                    step="0.1"
                                    value={data.weight}
                                    onChange={(e) => setData('weight', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="height" className="text-sm font-medium flex items-center gap-2">
                                    <Ruler className="h-4 w-4" />
                                    Votre taille (en cm)
                                </Label>
                                <Input
                                    type="number"
                                    id="height"
                                    placeholder="Ex: 175"
                                    className="w-full"
                                    value={data.height}
                                    onChange={(e) => setData('height', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section Activité sportive */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b">
                            <Activity className="h-5 w-5" />
                            <h3 className="text-lg font-semibold">Activité sportive</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium flex items-center gap-2">
                                    <Dumbbell className="h-4 w-4" />
                                    Votre niveau de sport
                                </Label>
                                <Select
                                    defaultValue={data?.level.trim()}
                                    onValueChange={(value) => setData('level', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Sélectionnez votre niveau" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="beginner">Débutant</SelectItem>
                                        <SelectItem value="novice">Novice</SelectItem>
                                        <SelectItem value="advanced">Avancé</SelectItem>
                                        <SelectItem value="confirmed">Confirmé</SelectItem>
                                        <SelectItem value="pro">Professionnel</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sport" className="text-sm font-medium flex items-center gap-2">
                                    <Activity className="h-4 w-4" />
                                    Quel sport pratiquez-vous ?
                                </Label>
                                <Input
                                    type="text"
                                    id="sport"
                                    placeholder="Ex: Football, Natation, Course..."
                                    className="w-full"
                                    value={data.sport}
                                    onChange={(e) => setData('sport', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-sm font-medium flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    À quelle fréquence le pratiquez-vous ?
                                </Label>
                                <Select
                                    value={data.frequencies}
                                    onValueChange={(value) => setData('frequencies', value)}
                                >
                                    <SelectTrigger className="w-full md:w-64">
                                        <SelectValue placeholder="Sélectionnez la fréquence" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1-2">1-2 séances par semaine</SelectItem>
                                        <SelectItem value="2-3">2-3 séances par semaine</SelectItem>
                                        <SelectItem value="3-4">3-4 séances par semaine</SelectItem>
                                        <SelectItem value="5+">5+ séances par semaine</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Bouton de validation */}
                    <div className="pt-4">
                        <Button className="cursor-pointer" variant="outline" disabled={processing}>
                            Enregistrer mes informations
                        </Button>
                    </div>
                </form>

                {/* Additional Info */}
                <div className="rounded-lg p-4 border">
                    <div className="flex items-center gap-2 mb-3">
                        <Info className="h-4 w-4" />
                        <h4 className="text-sm font-medium">
                            Pourquoi ces informations ?
                        </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calculator className="h-3 w-3" />
                            <span>Calcul précis de vos besoins caloriques quotidiens</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Target className="h-3 w-3" />
                            <span>Recommandations nutritionnelles personnalisées</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <TrendingUp className="h-3 w-3" />
                            <span>Suivi adapté à vos objectifs de santé</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Utensils className="h-3 w-3" />
                            <span>Plans alimentaires sur mesure</span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
