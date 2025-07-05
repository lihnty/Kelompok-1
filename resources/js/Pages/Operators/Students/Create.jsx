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
import { IconArrowLeft, IconCheck, IconUsers } from "@tabler/icons-react";
import { useRef } from "react";
import { toast } from "sonner";

export default function Create(props) {
    const fileInputAvatar = useRef(null);
    const {data, setData, post, processing, errors, reset}= useForm({
        classroom_id: null,
        fee_group_id: null,
        name: '',
        email: '',
        password: '',
        avatar: null,
        student_number: '',
        semester:  1,
        batch: '',
        _method: props.page_settings.method,
    })

    const onHandleChange = (e) => setData(e.target.name, e.target.value);

    const onHandleSubmit = (e) => {
        e.preventDefault();
        post(props.page_settings.action, {
            preserveScoll: true,
            preserveState: true,
            onSuccess: (succes) => {
                const flash = flashMessage(succes);
                if(flash) toast[flash.type](flash.message); 
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
                                    icon={IconUsers}
                                />
                                <Button variant='orange' size='xl' className='w-full lg:w-auto' asChild>
                                    <Link href={route('operators.students.index')}>
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
                                <Label htmlFor="name">Nama</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={data.name}
                                    onChange={onHandleChange}
                                    placeholder="Masukan Nama Mahasiswa"
                                    autoComplete="username"
                                />
                                {errors.name && <InputError message={errors.name} />}
                            </div>
                            <div className="col-span-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={data.email}
                                    onChange={onHandleChange}
                                    placeholder="Masukan Alamat Email"
                                    autoComplete="email"
                                />
                                {errors.email && <InputError message={errors.email} />}
                            </div>
                             <div className="col-span-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={data.password}
                                    onChange={onHandleChange}
                                    placeholder="********"
                                    autoComplete="current-password"
                                />
                                {errors.password && <InputError message={errors.email} />}
                            </div>
                             <div className="col-span-full">
                                <Label htmlFor="classroom_id">Kelas</Label>
                                <Select
                                    defaultValue={data.classroom_id}
                                    onValueChange={(value) => setData('classroom_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Fakultas">
                                            {props.classrooms.find((classroom) => classroom.value == data.classroom_id)?.label ?? 'Pilih Kelas'}
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
                                {errors.faculty_id && <InputError message={errors.faculty_id} />}
                            </div>
                            <div className="col-span-full">
                                <Label htmlFor="fee_group_id">Golongan UKT</Label>
                                <Select
                                    defaultValue={data.fee_group_id}
                                    onValueChange={(value) => setData('fee_group_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Fakultas">
                                            {props.feeGroups.find((feeGroup) => feeGroup.value == data.fee_group_id)?.label ?? 'Pilih Golongan UKT'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.feeGroups.map((feeGroup, index) => (
                                            <SelectItem key={index} value={feeGroup.value}>
                                                {feeGroup.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.faculty_id && <InputError message={errors.faculty_id} />}
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
                            <div className="col-span-2">
                                <Label htmlFor="batch">Angkatan</Label>
                                <Input
                                    type="text"
                                    name="batch"
                                    id="batch"
                                    value={data.batch}
                                    onChange={onHandleChange}
                                    placeholder="Masukan Angkatan"
                                />
                                {errors.batch && <InputError message={errors.batch} />}
                            </div>
                            <div className="col-span-2">
                                <Label htmlFor="avatar">Avatar</Label>
                                <Input
                                    type="file"
                                    name="avatar"
                                    id="avatar"
                                    onChange={(e) =>setData(e.target.name, e.target.files[0])}
                                    ref={fileInputAvatar}
                                />
                                {errors.batch && <InputError message={errors.batch} />}
                            </div>
                             <div className="col-span-2">
                                <Label htmlFor="student_number">Nomor Pokok Mahasiswa</Label>
                                <Input
                                    type="text"
                                    name="student_number"
                                    id="student_number"
                                    value={data.student_number}
                                    onChange={onHandleChange}
                                    placeholder="Masukan Nomor pokok mahasiswa"
                                />
                                {errors.student_number && <InputError message={errors.student_number} />}
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

Create.layout = (page) => <AppLayout children={page} title={page.props.page_settings.title}/>