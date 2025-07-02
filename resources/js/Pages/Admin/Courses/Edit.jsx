import HeaderTitle from "@/Components/HeaderTitle";
import InputError from "@/Components/InputError";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { AppLayout } from '@/Layouts/AppLayout';
import { flashMessage } from "@/lib/utils";
import { Link, useForm } from "@inertiajs/react";
import { IconArrowLeft, IconCheck, IconBooks } from "@tabler/icons-react";
import { useRef } from "react";
import { toast } from "sonner";

export default function Edit(props) {
    const fileInputAvatar = useRef(null);
    const {data, setData, post, processing, errors, reset}= useForm({
        faculty_id: props.course.faculty_id ?? null,
        department_id: props.course.department_id ?? null,
        teacher_id: props.course.teacher_id ?? null,
        name: props.course.name ?? '',
        credit: props.course.credit ?? 1,
        semester: props.course.semester ?? 1,
        _method: props.page_settings.method,
    })

    const onHandleChange = (e) => setData(e.target.name, e.target.value);

    const onHandleSubmit = (e) => {
        e.preventDefault();
        post(props.page_settings.action, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (success) => {
                const flash = flashMessage(success);
                if(flash) {
                    toast[flash.type](flash.message);
                }
            },
            onError: (errors) => {
                console.error('Form submission error:', errors);
                Object.values(errors).forEach(error => {
                    toast.error(error);
                });
            }
        });
    }

    const onHandleReset = () => {
        reset();
        fileInputAvatar.current.value = null;
    };

        return (
            <div className="flex flex-col w-full pb-32">
             <div className="mb-8 flex flex-col items-center justify-between gap-y-4 lg:flex-row lg:items-center">
                                <HeaderTitle
                                    title={props.page_settings.title}
                                    subtitle={props.page_settings.subtitle}
                                    icon={IconBooks}
                                />
                                <Button variant='orange' size='xl' className='w-full lg:w-auto' asChild>
                                    <Link href={route('admin.courses.index')}>
                                        <IconArrowLeft className="size-4"/>
                                        Kembali
                                    </Link>
                                </Button>
             </div>
             <Card>
                <CardContent className="p-6">
                    <form onSubmit={onHandleSubmit}>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                            <div className="col-span-full">
                                <Label htmlFor="faculty_id">Fakultas</Label>
                                <Select
                                    defaultValue={data.faculty_id}
                                    onValueChange={(value) => setData('faculty_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Fakultas">
                                            {props.faculties.find((faculty) => faculty.value == data.faculty_id)?.label ?? 'Pilih Fakultas'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.faculties.map((faculty, index) => (
                                            <SelectItem key={index} value={faculty.value}>
                                                {faculty.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.faculty_id && <InputError message={errors.faculty_id} />}
                            </div>
                            <div className="col-span-full">
                                <Label htmlFor="department_id">Program Studi</Label>
                                <Select
                                    defaultValue={data.department_id}
                                    onValueChange={(value) => setData('department_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Fakultas">
                                            {props.departments.find((department) => department.value == data.department_id)?.label ?? 'Pilih Program Studi'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.departments.map((department, index) => (
                                            <SelectItem key={index} value={department.value}>
                                                {department.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.faculty_id && <InputError message={errors.faculty_id} />}
                            </div>
                            <div className="col-span-full">
                                <Label htmlFor="teacher_id">Dosen</Label>
                                <Select
                                    defaultValue={data.teacher_id}
                                    onValueChange={(value) => setData('teacher_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Dosen">
                                            {props.teachers.find((teacher) => teacher.value == data.teacher_id)?.label ?? 'Pilih Dosen'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.teachers.map((teacher, index) => (
                                            <SelectItem key={index} value={teacher.value}>
                                                {teacher.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.teacher_id && <InputError message={errors.teacher_id} />}
                            </div>
                            <div className="col-span-full">
                                <Label htmlFor="name">Nama</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={data.name}
                                    onChange={onHandleChange}
                                    placeholder="Masukan Nama Mata Kuliah"
                                />
                                {errors.name && <InputError message={errors.name} />}
                            </div>
                            <div className="col-span-2">
                                <Label htmlFor="credit">Satuan Kredit Semester(SKS)</Label>
                                <Input
                                    type="number"
                                    name="credit"
                                    id="credit"
                                    value={data.credit}
                                    onChange={onHandleChange}
                                    placeholder="Masukan kredit"
                                />
                                {errors.credit && <InputError message={errors.credit} />}
                            </div>
                             <div className="col-span-2">
                                <Label htmlFor="semester">Semester</Label>
                                <Input
                                    type="number"
                                    name="semester"
                                    id="semester"
                                    value={data.semester}
                                    onChange={onHandleChange}
                                    placeholder="Masukan semester"
                                />
                                {errors.semester && <InputError message={errors.semester} />}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-8 lg:flex-row lg:justify-end">
                            <Button type='button' variant='ghost' size='xl' onClick={onHandleReset}>
                                Reset
                            </Button>
                            <Button type='submit' variant='blue' size='xl' disabled={processing}>
                                <IconCheck/>
                                Save
                            </Button>
                        </div>
                    </form>
                    </CardContent>
             </Card>
            </div>
        )
}

Edit.layout = (page) => <AppLayout children={page} title={page.props.page_settings.title}/>   