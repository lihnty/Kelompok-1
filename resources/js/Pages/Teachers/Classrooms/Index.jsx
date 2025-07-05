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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/Components/ui/table';
import EmptyState from '@/Components/EmptyState';
import { IconUsers } from '@tabler/icons-react';
import { CardContent } from '@/Components/ui/card';
import { IconCheck } from '@tabler/icons-react';
import { Checkbox } from '@/Components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';

export default function Index(props) {
  const students = props.students;
  const [params, setParams] = useState(props.state);

  useFilter({
    route: route('teachers.classrooms.index', [props.course, props.classroom]),
    values: params,
    only: ['students'],
  });

  const { data, setData, post, processing, errors, reset } = useForm({
    attendances: [],
    grades: [],
    _method: props.page_settings.method,
  });

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
      (attendance) => attendance.student_id === studentId && attendance.section === section && attendance.status
    );
  };

  const updateAttendance = (attendances, setData, studentId, section, checked) => {
    const updateAttendance = attendances.filter(
      (attendance) => !(attendance.student_id === studentId && attendance.section === section)
    );

    if (checked) {
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

  const getGradeValue = (grades, studentId, category, section) => {
    return (
      grades.find(
        (grade) => grade.student_id === studentId && grade.category === category && grade.section === section
      )?.grade || ''
    );
  };

  const updateGrade = (grades, setData, studentId, category, section, gradeValue) => {
    const updatedGrades = grades.filter(
        (grade) => !(grade.student_id === studentId && grade.category === category && grade.section === section)
    );

    updatedGrades.push({
        student_id: studentId,
        course_id: props.course.id,
        classroom_id: props.classroom.id,
        category: category,
        section: section,
        grade: parseInt(gradeValue, 10) || 0,
    });

    setData('grades', updatedGrades);
};

  const getAttendanceStudent = (student_id, attendances, section) => {
    return attendances.find((grade) => grade.student_id === student_id && grade.section === section);
  };

  const getGradeStudent = (student_id, grades, category, section) => {
    return grades.find(
      (grade) => grade.student_id === student_id && grade.category === category && grade.section === section
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
              onChange={(e) => setParams((prev) => ({ ...prev, search: e.target.value }))}
            />
            <Button variant="red" size="xl" onClick={(e) => setParams(props.state)}>
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
        <CardContent className="p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:px-6">
          {students.length === 0 ? (
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
                                        <TableHead rowSpan='2' className="border">UTS</TableHead>
                                        <TableHead rowSpan='2' className="border">UAS</TableHead>
                                        <TableHead colSpan='4' className="border">Total</TableHead>
                                        <TableHead colSpan='4' className="border">Presentase Nilai</TableHead>
                                        <TableHead rowSpan='2' className="border">Nilai Akhir</TableHead>
                                        <TableHead rowSpan='2' className="border">Huruf Mutu</TableHead>
                                    </TableRow>
                                    <TableRow className="border">
                                        {Array.from({ length: 12 }).map((_, index) => (
                                            <TableHead key={index} className="border">
                                                {index + 1}
                                            </TableHead>
                                        ))}
                                        {Array.from({ length: 10 }).map((_, index) => (
                                            <TableHead key={index} className="border">
                                                {index + 1}
                                            </TableHead>
                                        ))}
                                        <TableHead className="border">Absen</TableHead>
                                        <TableHead className="border">Tugas</TableHead>
                                        <TableHead className="border">UTS</TableHead>
                                        <TableHead className="border">UAS</TableHead>
                                        <TableHead className="border">Absen (10%)</TableHead>
                                        <TableHead className="border">Tugas (20%)</TableHead>
                                        <TableHead className="border">UTS (30%)</TableHead>
                                        <TableHead className="border">UAS (40%)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.map((student, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar>
                                                        <AvatarImage src={student.user.avatar} />
                                                        <AvatarFallback>{student.user.name.substring(0, 1)}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{student.user.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{student.student_number}</TableCell>
                                            {Array.from({ length: 12 }).map((_, section) => {
                                                const attendance = getAttendanceStudent(
                                                    student.id,
                                                    student.attendances,
                                                    section + 1,
                                                );
                                                return (
                                                    <TableCell key={section}>
                                                        {attendance ? (
                                                            <IconCheck className="size-4 text-green-500" />
                                                        ) : (
                                                            <Checkbox 
                                                                id={`attendances_${student.id}_section_${section + 1}`}
                                                                name='attendances'
                                                                checked={
                                                                    isAttendanceChecked(
                                                                        data.attendances,
                                                                        student.id,
                                                                        section + 1,
                                                                    )
                                                                }
                                                                onCheckedChange={(checked) => 
                                                                    updateAttendance(
                                                                        data.attendances,
                                                                        setData,
                                                                        student.id, 
                                                                        section + 1,
                                                                        checked
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    </TableCell>
                                                )
                                            })}

                                            {Array.from({ length: 10 }).map((_, task) => {
                                                const grade = getGradeStudent(
                                                    student.id,
                                                    student.grades,
                                                    'tugas',
                                                    task + 1,
                                                );
                                                return (
                                                    <TableCell key={task}>
                                                        {grade ? (
                                                            grade.grade
                                                        ) : (
                                                            <>
                                                                <Input
                                                                    className="w-[70px]"
                                                                    value={getGradeValue(
                                                                        data.grades,
                                                                        student.id,
                                                                        'tugas',
                                                                        task + 1,
                                                                    )}
                                                                    onChange={(e) => {
                                                                        updateGrade(
                                                                            data.grades,
                                                                            setData,
                                                                            student.id,
                                                                            'tugas',
                                                                            task + 1,
                                                                            e.target.value,
                                                                        )
                                                                    }}
                                                                />
                                                            </>
                                                        )}
                                                    </TableCell>
                                                )
                                            })}
                                            <TableCell>
                                                {getGradeStudent(student.id, student.grades, 'uts', null) ? (
                                                    getGradeStudent(student.id, student.grades, 'uts', null).grade
                                                ) : (
                                                    <Input
                                                        className="w-[60px]"
                                                        value={getGradeValue(
                                                            data.grades,
                                                            student.id,
                                                            'uts',
                                                            null,
                                                        )}
                                                        onChange={(e) => 
                                                            updateGrade(
                                                                data.grades,
                                                                setData,
                                                                student.id,
                                                                'uts',
                                                                null,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {getGradeStudent(student.id, student.grades, 'uas', null) ? (
                                                    getGradeStudent(student.id, student.grades, 'uas', null).grade
                                                ) : (
                                                    <Input
                                                        className="w-[60px]"
                                                        value={getGradeValue(
                                                            data.grades,
                                                            student.id,
                                                            'uas',
                                                            null,
                                                        )}
                                                        onChange={(e) => 
                                                            updateGrade(    
                                                                data.grades,
                                                                setData,
                                                                student.id,
                                                                'uas',
                                                                null,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>{student.total.attendances_count}</TableCell>
                                            <TableCell>{student.total.tasks_count}</TableCell>
                                            <TableCell>{student.total.uts_count}</TableCell>
                                            <TableCell>{student.total.uas_count}</TableCell>
                                            <TableCell>{student.percentage.attendances_percentage}</TableCell>
                                            <TableCell>{student.percentage.tasks_percentage}</TableCell>
                                            <TableCell>{student.percentage.uts_percentage}</TableCell>
                                            <TableCell>{student.percentage.uas_percentage}</TableCell>
                                            <TableCell>{student.final_score}</TableCell>
                                            <TableCell>{student.letter}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan='37'>
                                            <Button variant="orange" type="submit" size="lg" disabled={processing}>
                                                <IconCheck />
                                                Simpan
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

Index.layout = (page) => <AppLayout title={page.props.page_settings.title} children={page} />;
