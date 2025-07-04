import { IconArrowLeft, IconCalendar, IconCheck, IconUser } from '@tabler/icons-react';
import HeaderTitle from '@/Components/HeaderTitle';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card'; 
import { Label } from '@/Components/ui/label';
import InputError from '@/Components/InputError'; 
import { toast } from 'sonner';
import { Input } from '@/Components/ui/input';
import { useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { AppLayout } from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { useRef } from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/Components/ui/select';


export default function Create(props){

    const { data, setData, post, processing, errors, reset } = useForm({
        course_id: null,
        classroom_id: null,
        start_time: '',
        end_time: '',
        day_of_week: null,
        quota: 0,
        _method: props.page_settings.method,
    });
    const onHandleChange = (e) => {
    const { name, type, value, files } = e.target;
    setData(name, type === 'file' ? files[0] : value);
};
const onHandleSubmit = (e) => {
    e.preventDefault();
    post(props.page_settings.action, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: (success) => {
            const flash = flashMessage(success);
            if(flash) toast[flash.type](flash.message); 
        }
    });
}

const onHandleReset = () => {
        reset();
    }


    return (
        <div className='flex flex-col w-full pb-32'>
            <div className='flex flex-col items-start justify-between mb-8 gap-y-4 lg:flex-row lg:items-center'>
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconCalendar}
                />
                <Button
                    variant='orange'
                    size='xl'
                    className='w-full lg:w-auto'
                    asChild
                >
                    <Link href={route('operators.schedules.index')}>
                        <IconArrowLeft className='size-4' />
                        Kembali
                    </Link>
                </Button>
            </div>
            <Card>
                <CardContent className='p-6'>
                    <form onSubmit={onHandleSubmit}>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">

                            <div className="col-span-full">
                                <Label htmlFor="course_id">Mata Kuliah</Label>
                                <Select
                                    defaultValue={data.course_id}
                                    onValueChange={(value) => setData('course_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Fakultas">
                                            {props.courses.find((course) => course.value == data.course_id)?.label ?? 'Pilih Mata Kuliah'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.courses.map((course, index) => (
                                            <SelectItem key={index} value={course.value}>
                                                {course.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.course_id && <InputError message={errors.course_id} />}
                            </div>

                            <div className="col-span-full">
                                <Label htmlFor="classroom_id">Kelas</Label>
                                <Select
                                    defaultValue={data.classroom_id}
                                    onValueChange={(value) => setData('classroom_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Fakultas">
                                            {props.classrooms.find((classroom) => classroom.value == data.classroom_id)?.label ?? 'Pilih kelas'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.classrooms.map((classroom, index) => (
                                            <SelectItem key={index} value={classroom.value}>
                                                {classroom.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.classroom_id && <InputError message={errors.classroom_id} />}
                            </div>
                            
                            <div className="col-span-2">
                                <Label htmlFor='start_time'>Waktu Mulai</Label>
                                <Input
                                    type='time'
                                    name='start_time'
                                    id='start_time'
                                    value={data.start_time}
                                    onChange={onHandleChange}
                                    placeholder='Masukkan mulai'
                                />
                                {errors.start_time && <InputError message={errors.start_time}/>}
                            </div>
                            
                            <div className="col-span-2">
                                <Label htmlFor='end_time'>Waktu Berakhir</Label>
                                <Input
                                    type='time'
                                    name='end_time'
                                    id='end_time'
                                    value={data.end_time}
                                    onChange={onHandleChange}
                                    placeholder='Masukkan berakhir'
                                />
                                {errors.end_time && <InputError message={errors.end_time}/>}
                            </div>
                            
                            <div className="col-span-full">
                                <Label htmlFor="day_of_week">Hari</Label>
                                <Select
                                    defaultValue={data.day_of_week}
                                    onValueChange={(value) => setData('day_of_week', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Fakultas">
                                            {props.days.find((day) => day.value == data.day_of_week)?.label ?? 'Pilih hari'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.days.map((day, index) => (
                                            <SelectItem key={index} value={day.value}>
                                                {day.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.day_of_week && <InputError message={errors.day_of_week} />}
                            </div>
                            
                            <div className="col-span-full">
                                <Label htmlFor='quota'>Quota</Label>
                                <Input
                                    type='number'
                                    name='quota'
                                    id='quota'
                                    value={data.quota}
                                    onChange={onHandleChange}
                                    placeholder='Masukkan kuota'
                                />
                                {errors.quota && <InputError message={errors.quota}/>}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-8 lg:flex-row lg:justify-end">
                            <Button type='button' variant='ghost' size='xl' onClick={onHandleReset}>
                                Reset
                            </Button>
                            <Button type='submit' variant='blue' size='xl' disabled={processing}>
                                <IconCheck />
                                Save
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

Create.layout = (page) => <AppLayout children={page} title={page.props.page_settings.title}/>