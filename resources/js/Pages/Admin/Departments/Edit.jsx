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
import { IconArrowLeft, IconCheck, IconSchool } from "@tabler/icons-react";
import { toast } from "sonner";

export default function Edit(props) {
    const {data, setData, post, processing, errors, reset}= useForm({
        faculty_id: props.department.faculty_id ?? '',
        name: props.department.name ?? '',
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

    const onHandleReset = () => reset();

        return (
            <div className="flex flex-col w-full pb-32">
             <div className="mb-8 flex flex-col items-center justify-between gap-y-4 lg:flex-row lg:items-center">
                                <HeaderTitle
                                    title={props.page_settings.title}
                                    subtitle={props.page_settings.subtitle}
                                    icon={IconSchool}
                                />
                                <Button variant='orange' size='xl' className='w-full lg:w-auto' asChild>
                                    <Link href={route('admin.departments.index')}>
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
                                <Label htmlFor="name">Nama</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={data.name}
                                    onChange={onHandleChange}
                                    placeholder="Masukan Nama Program Studi"
                                />
                                {errors.name && <InputError message={errors.name} />}
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