import {AppLayout} from '@/Layouts/AppLayout';
import HeaderTitle from '@/Components/HeaderTitle';
import { IconPlus, IconPencil, IconTrash, IconUsersGroup } from '@tabler/icons-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/Components/ui/card';
import EmptyState from '@/Components/EmptyState';
import { formatDateIndo, deleteAction } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import AlertAction from '@/Components/AlertAction';
import PaginationTable from '@/Components/PaginationTable';
import {Input} from '@/Components/ui/Input';
import { useState } from 'react';
import { IconArrowsDownUp, IconDoor, IconRefresh } from '@tabler/icons-react';
import useFilter from '@/hooks/UseFilter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import ShowFilter from '@/Components/ShowFilter';


export default function Index(props) {
    const {data: classrooms, meta, links}  = props.classrooms;
    const [params, setParams] = useState(props.state);

    const onSortable = (field) => {
        setParams({
            ...params,
            field: field,
            direction: params.direction === 'asc' ? 'desc' :'asc',
        });
    };

    useFilter({  //useFilter nya huruf besar seharus nya
        route: route('operators.classrooms.index'),
        values: params,
        only: ['classrooms'],
    });

    return (
        <div className="flexw-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-center justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconDoor}
                />
                <Button variant='orange' size='xl' className='w-full lg:w-auto' asChild>
                    <Link href={route('operators.classrooms.create')}>
                        <IconPlus className="size-4"/>
                        Tambah
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader className='mb-4 p-0'>

                    <div className="flex flex-col w-full gap-4 px-6 py-4 lg:flex-row lg:items-center">
                        <Input
                            className="w-full sm:w-1/4" 
                            value={params?.search}
                            placeholder="Search..."
                            onChange={(e) => setParams((prev) => ({...prev, search: e.target.value}))}
                        />
                        <Select value={params?.load} onValueChange={(e) => setParams({...params, load: e})}>
                            <SelectTrigger className="w-full sm:w-24">
                                <SelectValue placeholder="Load" />
                            </SelectTrigger>
                            <SelectContent>
                                {[10,25,50, 75, 100].map((number, index) => (
                                <SelectItem key={index} value={number}>
                                    {number}
                                </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button variant='red' onClick={() => setParams(props.state)} size='xl'>
                            <IconRefresh className="size-4" />
                            Bersihkan
                        </Button>
                    </div>

                    <ShowFilter params={params} />
                </CardHeader>
                <CardContent className='p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6'>
                    { classrooms.length === 0 ? (
                        <EmptyState
                            icon={IconDoor}
                            title="Tidak ada kelas "
                            subtitle="Mulai denagn membuat kelas baru"
                        />
                    ) : (
                        <Table className='w-full'> 
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Button variant='ghost' className='inline-flex group' onClick={() => onSortable('id')}>
                                            #
                                            <span className='flex-none ml-2 rounded text-muted-foreground'>
                                                <IconArrowsDownUp className='size-4' />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button variant='ghost' className='inline-flex group' onClick={() => onSortable('academic_year_id')}>
                                            Tahun Ajaran
                                            <span className='flex-none ml-2 rounded text-muted-foreground'>
                                                <IconArrowsDownUp className='size-4' />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button variant='ghost' className='inline-flex group' onClick={() => onSortable('name')}>
                                            Nama
                                            <span className='flex-none ml-2 rounded text-muted-foreground'>
                                                <IconArrowsDownUp className='size-4' />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button variant='ghost' className='inline-flex group' onClick={() => onSortable('created_at')}>
                                            Dibuat Pada
                                            <span className='flex-none ml-2 rounded text-muted-foreground'>
                                                <IconArrowsDownUp className='size-4' />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {classrooms.map((classroom, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1 + (meta.current_page - 1) * meta.per_page}</TableCell>
                                        <TableCell>{classroom.academicYear.name}</TableCell>
                                        <TableCell>{classroom.name}</TableCell>
                                        <TableCell>{formatDateIndo(classroom.created_at)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-x-1">
                                                <Button variant='blue' size='sm' asChild>
                                                    <Link href={route('operators.classrooms.edit', [classroom])}>
                                                        <IconPencil className='size-4' />
                                                    </Link>
                                                </Button>
                                                <AlertAction 
                                                    trigger={
                                                        <Button variant='red' size='sm'>
                                                            <IconTrash className='size-4' />
                                                        </Button>
                                                    }
                                                    action={() => deleteAction(route('operators.classrooms.destroy', [classroom]))}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
                <CardFooter className='flex flex-col items-center justify-between w-full py-3 border-t gap-y-2 lg:flex-row'>
                    <p className='text-sm text-muted-foreground'>
                        Menampilkan <span className='font-medium text-blue-600'>{meta.from ?? 0}</span> dari{''} {meta.total} Kelas
                    </p>
                    <div className="overflow-x-auto">  
                        {meta.hasPages && <PaginationTable meta={meta} links={links} />}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

Index.layout = (page) => <AppLayout children={page} title={page.props.page_settings.title}/>