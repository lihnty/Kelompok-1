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
import { formatDateIndo, formatToRupiah, deleteAction } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import {
    IconArrowsDownUp,
    IconCircleKey,
    IconPencil,
    IconPlus,
    IconRefresh,
    IconTrash,
    IconDroplets,
} from '@tabler/icons-react';
import { useState } from 'react';

export default function Index(props) {
    const { data: feeGroups, meta, links } = props.feeGroups;
    const [params, setParams] = useState(props.state);

    const onSortable = (field) => {
        setParams({
            ...params,
            field: field,
            direction: params.direction === 'asc' ? 'desc' : 'asc',
        });
    };

    useFilter({
        route: route('admin.fee-groups.index'),
        params: params,
        only: ['feeGroup'],
    });

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconDroplets}
                />
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('admin.fee-groups.create')}>
                        <IconPlus className="size-4" />
                        Tambah
                    </Link>
                </Button>
            </div>

            <div>
                <Card>
                    <CardHeader className="mb-4 p-0">
                        <div className="flex w-full flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center">
                            {/* Filters */}
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
                        {feeGroups.length === 0 ? (
                            <EmptyState
                            icon={IconCircleKey}
                            title="Tidak ada golongan ukt"
                            subtitle="Mulailah dengan membuat golongan ukt baru"
                            />
                        ) : (
                            <Table className='w-full'>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
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
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                className="group inline-flex"
                                                onClick={() => onSortable('group')}
                                            >
                                                Golongan
                                                <span className="ml-2 flex-none rounded text-muted-foreground">
                                                    <IconArrowsDownUp className="size-4" />
                                                </span>
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                className="group inline-flex"
                                                onClick={() => onSortable('amount')}
                                            >
                                                Jumlah
                                                <span className="ml-2 flex-none rounded text-muted-foreground">
                                                    <IconArrowsDownUp className="size-4" />
                                                </span>
                                            </Button>
                                        </TableHead>
                                        <TableHead>
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
                                        </TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {feeGroups.map((feeGroup, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1 + meta.current_page * meta.per_page}</TableCell>
                                            <TableCell>{feeGroup.group}</TableCell>
                                            <TableCell>{formatToRupiah(feeGroup.amount)}</TableCell>
                                            <TableCell>{formatDateIndo(feeGroup.created_at)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-x-1">
                                                    <Button variant="blue" size="sm" asChild>
                                                        <Link href={route('admin.fee-groups.edit', [feeGroup])}>
                                                            <IconPencil className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <AlertAction
                                                        trigger={
                                                            <Button variant="red" size="sm">
                                                                <IconTrash className="size-4" />
                                                            </Button>
                                                        }
                                                        action={() =>
                                                            deleteAction(route('admin.fee-groups.destroy', [feeGroup]))
                                                        }
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
                            {meta.total} golongan UKT
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
