import { IconArrowLeft, IconCheck, IconUser } from '@tabler/icons-react';
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


export default function Edit(props){

    const { data, setData, post, processing, errors, reset } = useForm({
        faculty_id: props.operator.faculty_id ?? null,
        department_id: props.operator.department_id ?? null,
        name: props.operator.user.name ?? '',
        email: props.operator.user.email ?? '',
        password: '',
        avatar: null,
        employee_number: props.operator.employee_number ?? '',
        _method: props.page_settings.method,
    });
    const fileInputAvatar = useRef(null);

    const onHandleReset = () => {
        reset();
    }

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

    return (
        <div className='flex flex-col w-full pb-32'>
            <div className='flex flex-col items-start justify-between mb-8 gap-y-4 lg:flex-row lg:items-center'>
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconUser}
                />
                <Button
                    variant='orange'
                    size='xl'
                    className='w-full lg:w-auto'
                    asChild
                >
                    <Link href={route('admin.operators.index')}>
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
                                <Label htmlFor='name'>Nama</Label>
                                <Input
                                    type='text'
                                    name='name'
                                    id='name'
                                    value={data.name}
                                    onChange={onHandleChange}
                                    placeholder='Masukkan nama mahasiswa'
                                />
                                {errors.name && <InputError message={errors.name}/>}
                            </div>

                            <div className="col-span-2">
                                <Label htmlFor='email'>Email</Label>
                                <Input
                                    type='text'
                                    name='email'
                                    id='email'
                                    value={data.email}
                                    onChange={onHandleChange}
                                    placeholder='Masukkan nama mahasiswa'
                                />
                                {errors.email && <InputError message={errors.email}/>}
                            </div>

                            <div className="col-span-2">
                                <Label htmlFor='password'>Password</Label>
                                <Input
                                    type='password'
                                    name='password'
                                    id='password'
                                    value={data.password}
                                    onChange={onHandleChange}
                                    placeholder='********'
                                />
                                {errors.password && <InputError message={errors.password}/>}
                            </div>

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
                            
                            <div className="col-span-2">
                                <Label htmlFor='avatar'>Avatar</Label>
                                <Input
                                    type='file'
                                    name='avatar'
                                    id='avatar'
                                    value={data.avatar}
                                    onChange={(e) => setData(e.target.name, e.target.files[0])}
                                    ref={fileInputAvatar}
                                />
                                {errors.batch && <InputError message={errors.batch}/>}
                            </div>
                            
                            <div className="col-span-2">
                                <Label htmlFor='employee_number'>Nomor Induk Karyawan</Label>
                                <Input
                                    type='text'
                                    name='employee_number'
                                    id='employee_number'
                                    value={data.employee_number}
                                    onChange={onHandleChange}
                                    placeholder='Masukkan induk karyawan'
                                />
                                {errors.employee_number && <InputError message={errors.employee_number}/>}
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

Edit.layout = (page) => <AppLayout children={page} title={page.props.page_settings.title}/>