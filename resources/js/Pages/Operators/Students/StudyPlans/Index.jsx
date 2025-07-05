import AlertAction from '@/Components/AlertAction';
import EmptyState from '@/Components/EmptyState';
import HeaderTitle from '@/Components/HeaderTitle';
import PaginationTable from '@/Components/PaginationTable';
import ShowFilter from '@/Components/ShowFilter';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import useFilter from '@/hooks/UseFilter';
import { AppLayout } from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { formatDateIndo, deleteAction } from '@/lib/utils';
import {
    IconArrowsDownUp,
    IconPencil,
    IconPlus,
    IconRefresh,
    IconTrash,
    IconUsers,
    IconBuilding,
    IconArrowLeft
} from '@tabler/icons-react';
import { useState } from 'react';
import Detail from './Detail';

export default function Index(props) {
    const { data: studyPlans, meta, links } = props.studyPlans;
    const [params, setParams] = useState(props.state);

    const onSortable = (field) => {
        setParams({
            ...params,
            field: field,
            direction: params.direction === 'asc' ? 'desc' : 'asc',
        });
    };

    useFilter({
        route: route('operators.study-plans.index', props.student),
        params: params,
        only: ['studyPlans'],
    });

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconBuilding}
                />
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('operators.students.index')}>
                        <IconArrowLeft className="size-4" />
                        Kembali
                    </Link>
                </Button>
            </div>

            <div>
                <Card>
                    <CardHeader className="mb-4 p-0">
                        <div className="flex w-full flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center">
                            {/* Filter */}
                            <Input
                                className="w-full sm:w-1/4"
                                placeholder="Search..."
                                value={params?.search}
                                onChange={(e) => setParams((prev) => ({ ...prev, search: e.target.value }))}
                            />
                            <Select value={params?.load} onValueChange={(e) => setParams({ ...params, load: e })}>
                                <SelectTrigger className="w-full sm:w-24">
                                    <SelectValue placeholder="Load" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[10, 25, 50, 75, 100].map((number, index) => {
                                        <SelectItem key={index} value={number}>
                                            {number}
                                        </SelectItem>;
                                    })}
                                </SelectContent>
                            </Select>
                            <Button variant="red" onClick={() => setParams(props.state)} size="xl">
                                <IconRefresh className="size-4" />
                                Bersihkan
                            </Button>
                        </div>
                        {/* Show Filter */}
                        <ShowFilter params={params} />
                    </CardHeader>
                    <CardContent className="p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6">
                        {studyPlans.length === 0 ? (
                            <EmptyState
                                icon={IconBuilding}
                                title="Tidak ada kartu rencana studi"
                                subtitle="Mulailah dengan membuat kartu rencana studi baru"
                            />
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                className="group inline-flex"
                                                onClick={() => onSortable('id')}
                                            >
                                                #
                                                <span className="ml-2 flex-none rounded text-muted-foreground">
                                                    <IconArrowsDownUp className="size-4" />
                                                </span>
                                            </Button>
                                        </TableCell>
                                        <TableCell>Nama</TableCell>
                                        <TableCell>Kelas</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                className="group inline-flex"
                                                onClick={() => onSortable('student_number')}
                                            >
                                                Nomor Pokok Mahasiswa
                                                <span className="ml-2 flex-none rounded text-muted-foreground">
                                                    <IconArrowsDownUp className="size-4" />
                                                </span>
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                className="group inline-flex"
                                                onClick={() => onSortable('academic_year_id')}
                                            >
                                                 Tahun Akademik
                                                <span className="ml-2 flex-none rounded text-muted-foreground">
                                                    <IconArrowsDownUp className="size-4" />
                                                </span>
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                className="group inline-flex"
                                                onClick={() => onSortable('status')}
                                            >
                                                 Status
                                                <span className="ml-2 flex-none rounded text-muted-foreground">
                                                    <IconArrowsDownUp className="size-4" />
                                                </span>
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                className="group inline-flex"
                                                onClick={() => onSortable('notes')}
                                            >
                                                 Catatan
                                                <span className="ml-2 flex-none rounded text-muted-foreground">
                                                    <IconArrowsDownUp className="size-4" />
                                                </span>
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                className="group inline-flex"
                                                onClick={() => onSortable('semester')}
                                            >
                                                 Semester
                                                <span className="ml-2 flex-none rounded text-muted-foreground">
                                                    <IconArrowsDownUp className="size-4" />
                                                </span>
                                            </Button>
                                        </TableCell> 
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                className="group inline-flex"
                                                onClick={() => onSortable('created_at')}
                                            >
                                                Dibuat Pada
                                                <span className="ml-2 flex-none rounded text-muted-foreground">
                                                    <IconArrowsDownUp className="size-4" />
                                                </span>
                                            </Button>
                                        </TableCell>
                                        <TableCell>Aksi</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {studyPlans.map((studyPlan, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1 + meta.current_page * meta.per_page}</TableCell>
                                            <TableCell>
                                            <div className='flex items-center gap-2'>
                                                <Avatar>
                                                    <AvatarImage src={studyPlan.student.avatar} />
                                                    <AvatarFallback>{studyPlan.student.name.substring(0, 1)}</AvatarFallback>
                                                </Avatar>
                                            </div>
                                                <span>{studyPlan.student.name}</span>
                                            </TableCell>
                                            <TableCell>{studyPlan.student.classroom}</TableCell>
                                            <TableCell>{studyPlan.student.student_number}</TableCell>
                                            <TableCell>{studyPlan.academicYear.name}</TableCell>
                                            <TableCell>{studyPlan.status}</TableCell>
                                            <TableCell>{studyPlan.notes}</TableCell>
                                            <TableCell>{studyPlan.semester}</TableCell>
                                            <TableCell>{formatDateIndo(studyPlan.created_at)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-x-1">
                                                    {/* detail */}
                                                    <Detail schedules={studyPlan.schedules} name={studyPlan.student.name} />
                                                    {/* approve */}
                                                    <Approve
                                                        name={studyPlan.student.name}
                                                        statuses={props.statuses}
                                                        action={route('operators.study-plans.approve', [
                                                            props.student,
                                                            studyPlan,
                                                        ])}
                                                        />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                    <CardFooter className="flex w-full flex-col items-center justify-between gap-y-2 border-t py-3 lg:flex-row">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan <span className="font-medium text-blue-600">{meta.from ?? 0}</span> dari{' '}
                            {meta.total} kartu rencana studi
                        </p>
                        <div className="overflow-x-auto">
                            {meta.has_pages && <PaginationTable meta={meta} links={links} />}
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

Index.layout = (page) => <AppLayout title={page.props.page_settings.title} children={page} />;