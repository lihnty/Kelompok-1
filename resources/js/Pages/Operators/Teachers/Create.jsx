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
import { IconArrowLeft, IconCheck, IconSchool, IconUsers, IconUsersGroup } from "@tabler/icons-react";
import { useRef } from "react";
import { toast } from "sonner";

export default function Create(props) {
    const fileInputAvatar = useRef(null);
    const {data, setData, post, processing, errors, reset}= useForm({
        name: '',
        email: '',
        password: '',
        avatar: null,
        teacher_number: '',
        academic_title: '',
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
                                    icon={IconUsersGroup}
                                />
                                <Button variant='orange' size='xl' className='w-full lg:w-auto' asChild>
                                    <Link href={route('admin.teachers.index')}>
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
                                    placeholder=""
                                    autoComplete="current-password"
                                />
                                {errors.password && <InputError message={errors.email} />}
                            </div>
                            <div className="col-span-2">
                                <Label htmlFor="academic_title">Jabatan Akademik</Label>
                                <Input
                                    type="text"
                                    name="academic_title"
                                    id="academic_title"
                                    value={data.academic_title}
                                    onChange={onHandleChange}
                                    placeholder="Masukan jabatan akademik"
                                />
                                {errors.academic_title && <InputError message={errors.batch} />}
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
                                <Label htmlFor="teacher_number">Nomor Induk Dosen</Label>
                                <Input
                                    type="text"
                                    name="teacher_number"
                                    id="teacher_number"
                                    value={data.teacher_number}
                                    onChange={onHandleChange}
                                    placeholder="Masukan nomor induk dosen"
                                />
                                {errors.teacher_number && <InputError message={errors.teacher_number} />}
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