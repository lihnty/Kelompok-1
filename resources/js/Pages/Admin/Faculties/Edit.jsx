import {AppLayout} from '@/Layouts/AppLayout';
import { Link, Head, useForm } from '@inertiajs/react'; 
import { IconBuildingSkyscraper, IconPlus, IconArrowLeft, IconCheck } from '@tabler/icons-react';
import HeaderTitle from '@/Components/HeaderTitle';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card'; 
import { Label } from '@/Components/ui/label';
import InputError from '@/Components/InputError'; 
import { useRef } from 'react';
import { toast } from 'sonner';
import { flashMessage } from '@/lib/utils';
import { Input } from '@/Components/ui/input';

export default function Edit(props){

    const fileInputLogo = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: props.faculty.name,
        logo: null,
        _method: props.page_settings.method,
    });


    const onHandleReset = () => {
        reset();
        fileInputLogo.current.value = null;
    }

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

    
    return (
         <div className='flex flex-col w-full pb-32'>
            <div className='flex flex-col items-start justify-between mb-8 gap-y-4 lg:flex-row lg:items-center'>
                <HeaderTitle 
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconBuildingSkyscraper}
                />
                <Button
                    variant='orange'
                    size='xl'
                    className='w-full lg:w-auto'
                    asChild
                >
                    <Link href={route('admin.faculties.index')}>
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
                                <Label htmlFor='name'>Logo</Label>
                                <Input
                                    type='file'
                                    id='logo'
                                    name='logo'
                                    onChange={(e) => setData(e.target.name, e.target.files[0])}
                                />

                                {errors.logo && <InputError message={errors.logo}/>}
                            </div>
                            <div className="col-span-full">
                                <Label htmlFor='name'>Nama</Label>
                                <Input
                                    type='text'
                                    id='name'
                                    name='name'
                                    placeholder='Masukkan nama fakultas'
                                    value={data.name}
                                    onChange={(e) => setData(e.target.name, e.target.value)}
                                    ref={fileInputLogo}
                                />

                                {errors.name && <InputError message={errors.name}/>}
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