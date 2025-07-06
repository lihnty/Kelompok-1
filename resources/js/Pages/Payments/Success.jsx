import { Head } from "@inertiajs/react";


export default function Success() {
    return (
        <>
            <Head title="Pembayaran Berhasil" />
            <div className="flex min-h-screen items-center justify-center">
                <div className="mx-auto max-w-sm">
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-x-2">
                            <IconCircleCheck className="text-green-500" />
                            <div className="">
                                <CardTitle>Pembayaran Berhasil</CardTitle>
                                <CardDescription>Terima kasih telah melakukan pembayaran.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-y-6">
                            <p className="text-start text-foreground">Terima kasih telah melakukan pembayaran.</p>
                            <Button variant="orange" asChild>
                                <Link href={route('dashboard')}>Kembali ke Dashboard</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}