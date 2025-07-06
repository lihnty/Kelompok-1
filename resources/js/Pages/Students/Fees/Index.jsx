import StudentLayout from '@/Layouts/StudentLayout';
import HeaderTitle from '@/Components/HeaderTitle';
import { IconPlus, IconPencil, IconTrash, IconBuilding, IconEye, IconMoneybag } from '@tabler/icons-react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/Components/ui/card';
import EmptyState from '@/Components/EmptyState';
import { formatDateIndo, deleteAction, FEESTATUSVARIANT, formatToRupiah } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import AlertAction from '@/Components/AlertAction';
import PaginationTable from '@/Components/PaginationTable';
import {Input} from '@/Components/ui/Input';
import { useState } from 'react';
import { IconArrowsDownUp, IconDoor, IconRefresh } from '@tabler/icons-react';
import useFilter from '@/hooks/UseFilter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import ShowFilter from '@/Components/ShowFilter';
import { Badge } from '@/Components/ui/badge';
import { STUDYPLANSTATUSVARIANT } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { Tab } from '@headlessui/react';


export default function Index(props) {
    const auth = usePage().props.auth.user;
    const {data: fees, meta, links}  = props.fees;
    const [params, setParams] = useState(props.state);

    const onSortable = (field) => {
        setParams({
            ...params,
            field: field,
            direction: params.direction === 'asc' ? 'desc' :'asc',
        });
    };

    useFilter({  //useFilter nya huruf besar seharus nya
        route: route('students.fees.index'),
        values: params,

        only: ['fees'],
    });

    return (
        <div className="flexw-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-center justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconMoneybag}
                />
            </div>

            <div className="flex flex-col gap-y-8">
                {/* Pembayaran */}
                {!props.checkFee && (
                    <div>
                        <Alert variant='orange'>
                            <AlertTitle>Priode Pembayaran UKT Tahun Ajaran {props.academic_year.name}</AlertTitle>
                            <AlertDescription>
                                Silahkan untuk melakukan pembayaran UKT terlebih dahulu agar anda dapat mengajukan kartu rencana studi
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
                {(props.fee && props.fee.status != 'Sukses') || !props.fee && (
                    <Card>
                        <CardContent className='p-6 space-y-20'>
                            <div>
                                <Table className='w-full'>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nama</TableHead>
                                            <TableHead>Nomor Pokok Mahasiswa</TableHead>
                                            <TableHead>Semester</TableHead>
                                            <TableHead>Kelas</TableHead>
                                            <TableHead>Program Studi</TableHead>
                                            <TableHead>Fakultas</TableHead>
                                            <TableHead>Golongan</TableHead>
                                            <TableHead>Total Tagihan</TableHead>
                                            <TableHead>Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{auth.name}</TableCell>
                                            <TableCell>{auth.student.student_number}</TableCell>
                                            <TableCell>{auth.student.semester}</TableCell>
                                            <TableCell>{auth.student.classroom.name}</TableCell>
                                            <TableCell>{auth.student.department.name}</TableCell>
                                            <TableCell>{auth.student.faculty.name}</TableCell>
                                            <TableCell>{auth.student.feeGroup.group}</TableCell>
                                            <TableCell>{formatToRupiah(auth.student.feeGroup.amount)}</TableCell>
                                            <TableCell>
                                                <Button variant='orange'>
                                                    Bayar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}
                    <div className="flex flex-col w-full gap-4 lg:flex-row lg:items-center">
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
                    { fees.length === 0 ? (
                        <EmptyState
                            icon={IconMoneybag}
                            title="Tidak ada Pembayaran"
                            subtitle="Mulai denagn membuat Pembayaran baru"
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
                                        <Button variant='ghost' className='inline-flex group' onClick={() => onSortable('fee_code')}>
                                            Kode Pembayaran
                                            <span className='flex-none ml-2 rounded text-muted-foreground'>
                                                <IconArrowsDownUp className='size-4' />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button variant='ghost' className='inline-flex group' onClick={() => onSortable('fee_group_id')}>
                                            Golongan
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
                                        <Button variant='ghost' className='inline-flex group' onClick={() => onSortable('semester')}>
                                            Semester
                                            <span className='flex-none ml-2 rounded text-muted-foreground'>
                                                <IconArrowsDownUp className='size-4' />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button variant='ghost' className='inline-flex group' onClick={() => onSortable('status')}>
                                            Status
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
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fees.map((fee, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1 + (meta.current_page - 1) * meta.per_page}</TableCell>
                                        <TableCell>{fee.fee_code}</TableCell>
                                        <TableCell>{fee.feeGroup.group}</TableCell>
                                        <TableCell>{fee.academicYear.name}</TableCell>
                                        <TableCell>{fee.semester}</TableCell>
                                            <TableCell>
                                                <Badge variant={FEESTATUSVARIANT[fee.status]}>{fee.status}</Badge>
                                            </TableCell>
                                        <TableCell>{formatDateIndo(fee.created_at)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                
                    <div className='flex flex-col items-center justify-between w-full gap-y-2 lg:flex-row'>
                        <p className='text-sm text-muted-foreground'>
                            Menampilkan <span className='font-medium text-blue-600'>{meta.from ?? 0}</span> dari{''} {meta.total} Pembayaran
                        </p>
                        <div className="overflow-x-auto">  
                            {meta.hasPages && <PaginationTable meta={meta} links={links} />}
                        </div>
                    </div>
            </div>

            <Card>
                <CardHeader className='mb-4 p-0'>

                </CardHeader>
                <CardContent className='p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6'>
                </CardContent>
            </Card>
        </div>
    );
}

Index.layout = (page) => <StudentLayout children={page} title={page.props.page_settings.title}/>