import StudentLayout from '@/Layouts/StudentLayout';
import HeaderTitle from '@/Components/HeaderTitle';
import { Button } from '@/Components/ui/button';
import { IconBuilding, IconArrowLeft, IconCheck } from '@tabler/icons-react';
import { Link, useForm } from '@inertiajs/react';
import { TableHeader, Table, TableRow, TableHead, TableBody, TableCell } from '@/Components/ui/table';
import { Checkbox } from '@/Components/ui/checkbox';
import { cn } from '@/lib/utils';

export default function Create(props) {
    const { data, setData, post, errors, processing } = useForm({
        schedule_id: [],
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
                },
            });
        };

    const onHandleReset = () => {
        reset();
    };
    

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-center justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconBuilding}
                />
                <Button variant='orange' size='xl' className='w-full lg:w-auto' asChild>
                    <Link href={route('students.study-plans.index')}>
                        <IconArrowLeft className="size-4"/>
                        Kembali
                    </Link>
                </Button>
            </div>
            <form onSubmit={onHandleSubmit}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Mata Kuliah</TableHead>
                            <TableHead>Kelas</TableHead>
                            <TableHead>Hari</TableHead>
                            <TableHead>Jam</TableHead>
                            <TableHead>Kuota</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {props.schedules.map((schedule, index) => (
                            <TableRow key={index} className={cn(
                                schedule.taken_qouta === schedule.qouta && 'text-red-500'
                            )}>
                                <TableCell>
                                    <Checkbox 
                                        id={`schedule_id_${schedule.id}`}
                                        name="schedule_id"
                                        checked={data.schedule_id.includes(schedule.id)}
                                        disabled={schedule.taken_qouta === schedule.qouta}
                                        onChange={(checked) => {
                                            if(checked) {
                                                setData('schedule_id', [...data.schedule_id, schedule.id]);
                                            } else {
                                                setData('schedule_id', data.schedule_id.filter((id) => id !== schedule.id));
                                            }
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{schedule.course.name}</TableCell>
                                <TableCell>{schedule.classroom.name}</TableCell>
                                <TableCell>{schedule.day_of_week}</TableCell>
                                <TableCell>{schedule.start_time} - {schedule.end_time}</TableCell>
                                <TableCell className={cn(
                                    schedule.taken_qouta === schedule.qouta ? 'text-red-500' : 'text-green-500'
                                )}>
                                    {schedule.taken_qouta} / {schedule.qouta}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="mt-8 flex flex-col gap-2 lg:flex-row lg:justify-end">
                    <Button type="button" variant="ghost" size="xl" onClick={onHandleReset}>
                        Reset
                    </Button>
                    <Button type="submit" variant="blue" size="xl" disabled={processing}>
                        <IconCheck />
                        Save
                    </Button>
                </div>
            </form>
        </div>
    );
}

Create.layout = (page) => <StudentLayout children={page} title={page.props.page_settings.title} />
