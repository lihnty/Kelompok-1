import { IconDroplets, IconPlus, IconArrowLeft, IconCheck } from '@tabler/icons-react';
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

export default function Create(props){

    const { data, setData, post, processing, errors, reset } = useForm({
        group: 1,
        amount: 0,
        _method: props.page_settings.method,
    });

    const onHandleReset = () => {
        reset();
    }

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
                    icon={IconDroplets}
                />
                <Button
                    variant='orange'
                    size='xl'
                    className='w-full lg:w-auto'
                    asChild
                >
                    <Link href={route('admin.fee-groups.index')}>
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
                                <Label htmlFor='group'>Golongan</Label>
                                <Input
                                    type='number'
                                    name='group'
                                    id='group'
                                    placeholder='Masukkan golongan ukt'
                                    value={data.group}
                                    onChange={(e) => setData(e.target.name, e.target.value)}
                                />
                                {errors.group && <InputError message={errors.group}/>}
                            </div>

                            <div className="col-span-full">
                                <Label htmlFor='amount'>Jumlah</Label>
                                <Input
                                    type='number'
                                    name='amount'
                                    id='amount'
                                    placeholder='Masukkan jumlah'
                                    value={data.amount}
                                    onChange={(e) => setData(e.target.name, e.target.value)}
                                />
                                {errors.amount && <InputError message={errors.amount}/>}
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
