import CardStat from '@/Components/CardStat'; // Tambahkan import untuk CardStat
import HeaderTitle from '@/Components/HeaderTitle';
import { AppLayout } from '@/Layouts/AppLayout';
import { usePage } from '@inertiajs/react';
import { IconBooks, IconBuildingSkyscraper, IconDoor, IconLayout2, IconSchool } from '@tabler/icons-react';

export default function Dashboard(props) {
    const auth = usePage().props.auth.user;
    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconLayout2}
                />
            </div>
            <div className="mb-8 flex flex-col">
                <h2 className="text-xl font-medium leading-relaxed text-foreground">Hi, {auth.name}</h2>
                <p className="text-muted-foreground">Selamat Datang Di Sistem Informasi Akademik Unifversitas</p>
            </div>
            <div className="mb-8 grid gap-4 lg:grid-cols-4">
                <CardStat
                    data={{
                        title: 'Total fakultas',
                        icon: IconBuildingSkyscraper,
                        background: 'text-white bg-gradient-to-r from-red-400 via-red-500 to-red-500',
                        iconClassName: 'text-white',
                    }}
                >
                    <div className="text-2xl font-bold">{props.count.faculties}</div>
                </CardStat>
                <CardStat
                    data={{
                        title: 'Total program studi',
                        icon: IconSchool,
                        background: 'text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-500',
                        iconClassName: 'text-white',
                    }}
                >
                    <div className="text-2xl font-bold">{props.count.departments}</div>
                </CardStat>
                <CardStat
                    data={{
                        title: 'Total Kelas',
                        icon: IconDoor,
                        background: 'text-white bg-gradient-to-r from-lime-400 via-lime-500 to-lime-500',
                        iconClassName: 'text-white',
                    }}
                >
                    <div className="text-2xl font-bold">{props.count.classrooms}</div>
                </CardStat>
                <CardStat
                    data={{
                        title: 'Total Mata Kuliah',
                        icon: IconBooks,
                        background: 'text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-500',
                        iconClassName: 'text-white',
                    }}
                >
                    <div className="text-2xl font-bold">{props.count.courses}</div>
                </CardStat>
            </div>
        </div>
    );
}

Dashboard.layout = (page) => <AppLayout title={page.props.page_settings.title} children={page} />;
