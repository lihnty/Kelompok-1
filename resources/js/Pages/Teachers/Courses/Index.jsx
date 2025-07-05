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
    IconCircleKey,
    IconPencil,
    IconPlus,
    IconRefresh,
    IconTrash,
    IconUsers,
    IconBooks,
    IconUsersGroup,
} from '@tabler/icons-react';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu';
import { IconDotsVertical } from '@tabler/icons-react';

export default function Index(props) {
    const { data: courses, meta, links } = props.courses;
    const [params, setParams] = useState(props.state);

    const onSortable = (field) => {
        setParams({
            ...params,
            field: field,
            direction: params.direction === 'asc' ? 'desc' : 'asc',
        });
    };

    useFilter({
        route: route('teachers.courses.index'),
        params: params,
        only: ['courses'],
    });

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconBooks}
                />
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
                    <CardContent>
                        {courses.length === 0 ? (
                            <EmptyState
                                icon={IconBooks}
                                title="Tidak ada mata kuliah"
                                subtitle="Mulailah dengan membuat mata kuliah baru"
                            />
                        ) : (
                            <ul role="list" className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3">
                                {courses.map((course, index) => (
                                    <li key={index} className="overflow-hidden border rounded-xl border-secondary">
                                        <div className="flex items-center justify-between p-6 border-b border-secondary-900/5 gap-x-4 bg-gray-50">
                                            <Link
                                                href={route('teachers.courses.show', [course])}
                                                className="font-semibold text-sm leading-relaxed text-foreground"
                                            >
                                                {course.name}
                                            </Link>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost">
                                                        <IconDotsVertical className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-56">
                                                    <DropdownMenuGroup>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('teachers.courses.show', [course])}>
                                                                Detail
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuGroup>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                            <dl className="px-6 py-4 -my-3 text-sm leading-6 divide-y divide-gray-100">
                                                <div className="flex justify-between py-3 gap-x-4">
                                                    <dt className="font-foreground">Fakultas</dt>
                                                    <dd className="font-medium text-foreground">{course.faculty.name}</dd>  
                                                </div>
                                                <div className="flex justify-between py-3 gap-x-4">
                                                    <dt className="font-foreground">Program Studi</dt>
                                                    <dd className="font-medium text-foreground">{course.department.name}</dd>
                                                </div>
                                                <div className="flex justify-between py-3 gap-x-4">
                                                    <dt className="font-foreground">Satuan Kredit Semester (SKS)</dt>
                                                    <dd className="font-medium text-foreground">{course.credit}</dd>
                                                </div>
                                                <div className="flex justify-between py-3 gap-x-4">
                                                    <dt className="font-foreground">Semester</dt>
                                                    <dd className="font-medium text-foreground">{course.semester}</dd>
                                                </div>
                                            </dl>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                    <CardFooter className="flex w-full flex-col items-center justify-between gap-y-2 border-t py-3 lg:flex-row">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan <span className="font-medium text-blue-600">{meta.from ?? 0}</span> dari{' '}
                            {meta.total} mata kuliah
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

Index.layout = (page) => <AppLayout title={page.props.page_settings.title} children={page} />;