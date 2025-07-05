import AppLayout from '@/Layouts/AppLayout';
import { useState } from 'react';
import useFilter from '@/hooks/UseFilter';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { flashMessage } from '@/lib/utils';
import { IconDoor, IconRefresh } from '@tabler/icons-react';
import { Card, CardHeader } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import HeaderTitle from '@/Components/HeaderTitle';
import ShowFilter from '@/Components/ShowFilter';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import EmptyState from '@/Components/EmptyState';
import { IconPencil, IconUsers } from '@tabler/icons-react';
import { CardContent } from '@/Components/ui/card';

export default function Index(props) {
    const students = props.students;
    const [params, setParams] = useState(props.state);

    useFilter({
        route: route('teachers.classrooms.index', [props.course, props.classroom]),
        values: params,
        only: ['students'],
    });

    const {data, setData, post, processing, errors, reset}= useForm({
            attendances: [],
            grades: [],
            _method: props.page_settings.method,
        })

    const onHandleSubmit = (e) => {
        e.preventDefault();
        post(props.page_settings.action, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (success) => {
                const flash = flashMessage(success);
                if (flash) toast[flash.type](flash.message);
                reset();
            },
        });
    };

    const isAttendanceChecked = (attendances, studentId, section) => {
        return attendances.some(
            (attendance) => attendance.student_id === studentId && attendance.section === section && attendance.status,
        );
    }

    const updateAttendance = (attendances, setData, studentId, section, checked) => {
        const updateAttendance = attendances.filter(
            (attendance) => (attendance.student_id === studentId && attendance.section === section),
        );

        if(checked){
            updateAttendance.push({
                student_id: studentId,
                course_id: props.course.id,
                classroom_id: props.classroom.id,
                section: section,
                status: true,
            });
        }

        setData('attendances', updateAttendance);
    };

    const getGradeValue = (grade, studentId, category, section) => {
        return (
            grade.find(
                (grade) => grade.student_id === studentId && grade.category === category && grade.section === section,
            )?.grade || ''
        );
    };

    const updateGrade = (grades, setData, studentId, category, section, gradeValue) => {
        const updateGrade = grades.filter(
            (grade) => (grade.student_id === studentId && grade.category === category && grade.section === section),
        );

        updateGrade.push({
            student_id: studentId,
            course_id: props.course.id,
            classroom_id: props.classroom.id,
            category: category,
            section: section,
            grade: parseInt(gradeValue, 10) || 0,
        });

        setData('grades', updateGrade);
    };

    const getAttendanceStudent = (student_id, attendances, section) => {
        return attendances.find((grade) => grade.student_id === student_id && grade.section === section);
    };

    const getGradeStudent = (student_id, grades, category, section) => {
        return grades.find(
            (grade) => grade.student_id === student_id && grade.category === category && grade.section === section,
        );
    };

    return (
        <div className="flex flex-col w-full pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconDoor}
                />
            </div>
            <Card>
                <CardHeader className="p-0 mb-4">
                    <div className="flex flex-col w-full gap-4 px-6 py-4 lg:flex-row lg:items-center">
                        <Input
                            className="w-full sm:w-1/4"
                            placeholder="Cari nama mahasiswa"
                            value={params?.search}
                            onChange={(e) => setParams((prev)=>({...prev, search: e.target.value }))}
                        />
                        <Button variant='red' size='xl' onClick={(e) => setParams(props.state)}>
                            <IconRefresh className="size-4" />
                            Bersihkan
                        </Button>
                    </div>
                    <div className="space-y-4 px-6">
                        <Alert variant="destructive">
                            <AlertDescription>
                                Harap isi dengan teliti, data yg sudah disimpan tidak diperbarui
                            </AlertDescription>
                        </Alert>
                        {errors && Object.keys(errors).length > 0 && (
                            <Alert variant="red">
                                <AlertDescription>
                                    {typeof errors === 'string' ? ( 
                                        errors
                                    ) : (
                                        <ul>
                                            {Object.entries(errors).map(([key, message]) => (
                                                <li key={key}>{message}</li>
                                            ))}
                                        </ul>
                                    )}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                    <ShowFilter params={params} />
                </CardHeader>
                <CardContent className='p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6'>
                    { students.length !== 0 ? (
                        <EmptyState
                            icon={IconUsers}
                            title="Tidak ada mahasiswa"
                            subtitle="Tidak ada mahasiswa yg bergabung di kelas ini"
                        />
                    ) : (
                        <form onSubmit={onHandleSubmit}>
                            <Table className='w-full border'>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead rowSpan='2'>No</TableHead>
                                        <TableHead rowSpan='2'>Nama</TableHead>
                                        <TableHead rowSpan='2'>Nomor Pokok Mahasiswa</TableHead>
                                        <TableHead colSpan='12' className="border">Absensi</TableHead>
                                        <TableHead colSpan='10' className="border">Tugas</TableHead>
                                        <TableHead colSpan='2' className="border">UTS</TableHead>
                                        <TableHead colSpan='2' className="border">UAS</TableHead>
                                        <TableHead colSpan='4' className="border">Total</TableHead>
                                        <TableHead colSpan='4' className="border">Presentase Nilai</TableHead>
                                        <TableHead colSpan='2' className="border">Nilai Akhir</TableHead>
                                        <TableHead colSpan='2' className="border">Huruf Mutu</TableHead>
                                    </TableRow>
                                </TableHeader>
                            </Table>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

Index.layout = (page) => <AppLayout title={page.props.page_settings.title} children={page} />;
