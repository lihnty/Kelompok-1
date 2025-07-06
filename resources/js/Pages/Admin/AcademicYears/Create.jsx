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
import { IconArrowLeft, IconCalendar, IconCheck } from "@tabler/icons-react";
import { toast } from "sonner";
import { Checkbox } from "@/Components/ui/checkbox";

export default function Create(props) {
    const {data, setData, post, processing, errors, reset}= useForm({
        name: '',
        start_date: '',
        end_date: '',
        semester: null,
        is_active: false,
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
                                    icon={IconCalendar}
                                />
                                <Button variant='orange' size='xl' className='w-full lg:w-auto' asChild>
                                    <Link href={route('admin.academic-years.index')}>
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
                                    placeholder="Masukan Nama Program Studi"
                                />
                                {errors.name && <InputError message={errors.name} />}
                            </div>
                            <div className="col-span-2">
                                <Label htmlFor="start_date">Tanggal Mulai</Label>
                                <Input
                                    type="date"
                                    name="start_date"
                                    id="start_date"
                                    value={data.start_date}
                                    onChange={onHandleChange}
                                />
                                {errors.start_date && <InputError message={errors.start_date} />}
                            </div>
                            <div className="col-span-2">
                                <Label htmlFor="end_date">Tanggal Berakhir</Label>
                                <Input
                                    type="date"
                                    name="end_date"
                                    id="end_date"
                                    value={data.end_date}
                                    onChange={onHandleChange}
                                />
                                {errors.end_date && <InputError message={errors.end_date} />}
                            </div>
                            <div className="col-span-full">
                                <Label htmlFor="semester">Semester</Label>
                                    <Select 
                                        defaultValue={data.semester}
                                        onValueChange={(value) => setData('semester', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue>
                                                {props.academicYearSemester.find(
                                                    (semester) => semester.value === data.semester
                                                )?.label ?? 'Pilih Semester'}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {props.academicYearSemester.map((semester, index) => (
                                                <SelectItem key={index} value={semester.value}>
                                                    {semester.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                {errors.semester && <InputError message={errors.semester} />}
                            </div>
                            <div className="col-span-full">
                                <div className="flex space-x-2 items-top">
                                    <Checkbox
                                        id="is_active"
                                        name="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                    <div className="grid gap-1/5 leading-none">
                                        <Label htmlFor="is_active">Apakah Aktif?</Label>
                                    </div>
                                </div>
                                {errors.is_active && <InputError message={errors.is_active} />}
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