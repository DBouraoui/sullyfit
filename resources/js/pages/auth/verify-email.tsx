// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthLayout title="Vérification de l'adresse email" description="Merci de vérifier votre adresse email en cliquant sur le boutton juste en dessous pour reçevoir l'email.">
            <Head title="Verify email" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Un nouveau lien de vérification vas être envoyer en cliquant sur le boutton en dessous
                </div>
            )}

            <form onSubmit={submit} className="space-y-6 text-center">
                <Button disabled={processing} variant="secondary">
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Envoyé l'email de vérification
                </Button>

                <TextLink href={route('logout')} method="post" className="mx-auto block text-sm">
                    Déconnexion
                </TextLink>
            </form>
        </AuthLayout>
    );
}
