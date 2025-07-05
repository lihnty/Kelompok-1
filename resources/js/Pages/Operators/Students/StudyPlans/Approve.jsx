import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/Components/ui/sheet";
import { Textarea } from "@/Components/ui/textarea";
import { flashMessage } from "@/lib/utils";
import { useForm } from "@inertiajs/react";
import { IconChecklist } from "@tabler/icons-react";
import { Sheet } from "lucide-react";
import { toast } from "sonner";

export default function Approve({ name, statuses, action }) {
    const { data, setData, put, errors, processing } = useForm({
        status: 'Pending',
        notes: '',
        _method: 'PUT',
    });

    const onHandleSumbit  = (e) => {
        e.preventDefault();
        put(action, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (success) => {
                const flash = flashMessage(success);
                if(flash) toast[flash.type](flash.message);
            }
        })
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='green' size='sm'>
                    <IconChecklist className="size-4 text-white" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Setujui KRS Mshsiswa {name}</SheetTitle>
                    <SheetDescription>
                        Periksa kartu rencana studi mahasiswa yang diajukan oleh mahasiswa tersebut
                    </SheetDescription>
                </SheetHeader>
                <form className="mt-6 space-y-4 onSubmit={onHandleSumbit}">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="status">Status</Label>
                        <Select defaultValue={data.status} onValueChange={(value) => setData('status', value)}>
                            <SelectTrigger>
                                <SelectValue>
                                    {statuses.find((status) => status.value === data.status)?.label ?? 'Pilih status'}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((status, index) => (
                                    <SelectItem key={index} value={status.value}>
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {data.status === 'Reject' && (  
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor='notes'>Keterangan</Label>
                        <Textarea
                            name = "notes"
                            id = "notes"
                            onChange={(e) => setData(e.target.name, e.target.value)}
                            placeholder="Masukkan catatan..."
                            value = {data.notes}
                        ></Textarea>
                    </div>
                    )}
                    <Button type='submit' variant='orange' disabled={processing}>
                        Save
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    )
}