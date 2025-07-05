import { Button } from "@/Components/ui/button";
import { Sheet, SheetTrigger, SheetHeader, SheetContent, SheetTitle, SheetDescription } from "@/Components/ui/sheet";
import { TableBody, TableCell, TableHeader } from "@/Components/ui/table";
import { IconEye } from "@tabler/icons-react";


export default function Detail({schedules, name}){
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant='purple'
                    size='sm'
                >
                    <IconEye className="size-4 text-white" />
                </Button>
            </SheetTrigger>
            <SheetContent side="top">
              <SheetHeader>
                <SheetTitle>Detail KRS Mahasiswa {name}</SheetTitle>
                <SheetDescription>Detail kartu rencana studi mahasiswa yang di ajukan</SheetDescription>
              </SheetHeader>
              <Table className='w-full'>
                <TableHeader>
                <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Mata Kuliah</TableCell>
                    <TableCell>SKS</TableCell>
                    <TableCell>Kelas</TableCell>
                    <TableCell>Tahun Ajaran</TableCell>
                    <TableCell>Waktu</TableCell>
                </TableRow>
                </TableHeader>
                <TableBody>
                    {schedules.map((schedule, index) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{schedule.course.name}</TableCell>
                            <TableCell>{schedule.course.edit}</TableCell>
                            <TableCell>{schedule.classroom.edit}</TableCell>
                            <TableCell>{schedule.academicYear.edit}</TableCell>
                            <TableCell>{schedule.day_of_week}, {schedule.start_time} : {schedule.end_time}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
              </Table>
            </SheetContent>
        </Sheet>
    )
}