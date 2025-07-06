import StudentLayout from '@/Layouts/StudentLayout';
import HeaderTitle from '@/Components/HeaderTitle';
import { IconPlus, IconPencil, IconTrash, IconBuilding, IconEye, IconMoneybag } from '@tabler/icons-react';
import { Link, router, usePage } from '@inertiajs/react';
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
import { first } from 'lodash';


export default function Index(props) {
    const auth = usePage().props.auth.user;
    const {data: fees, meta, links}  = props.fees;
    const [params, setParams] = useState(props.state);

    const handlePayment = async () => {
        try {
            const response = await axios.post(route('payments.create'), {
                fee_code: feeCodeGenerator(),
                gross_amount: auth.student.feeGroup.amount,
                first_name: auth.name,
                last_name: 'Klp1',
                email: auth.email,
                
            });

            const snapToken = response.data.snapToken;

            window.snap.pay(snapToken, {
                onSuccess: function(result) {
                    toast["success"]("Pembayaran berhasil");
                    router.get(route('payments.create'));
                },
                 
                onPending: function() {
                    toast["info"]("Pembayaran sedang diproses");
                },

                onError: function(result) {
                    toast["error"](`Kesalahan pembayaran: ${error}`);
                },

                onClose: function() {
                    toast["info"]("Pembayaran ditutup");
                },
            });
            
        } catch (error) {
            toast["error"](`Kesalahan pembayaran: ${error}`);
        }
    }

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
                                                <Button variant='orange' onClick={handlePayment}>
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
            </div>
        </div>
    );
}

Index.layout = (page) => <StudentLayout children={page} title={page.props.page_settings.title}/>