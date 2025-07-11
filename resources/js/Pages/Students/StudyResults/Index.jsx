import StudentLayout from '@/Layouts/StudentLayout';
import HeaderTitle from '@/Components/HeaderTitle';
import { IconArrowLeft, IconSchool } from '@tabler/icons-react';
import EmptyState from '@/Components/EmptyState';
import { formatDateIndo, } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import PaginationTable from '@/Components/PaginationTable';
import { useState } from 'react';
import ShowFilter from '@/Components/ShowFilter';
import Grades from '@/Components/Grades';
import { Button } from '@/Components/ui/button';
import Link from 'next/link';
import { Card, CardHeader, CardContent, CardFooter } from '@/Components/ui/card';




export default function Index(props) {
    const {data: studyResults, meta, links}  = props.studyResults;
    const [params, setParams] = useState(props.state);

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-center justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconSchool}
                />

                <Button variant='orange' size='xl' className='w-full lg:w-auto' asChild>
                    <Link href={route('operators.students.index')}>
                    <IconArrowLeft className="size-4"/>
                        Kembali
                    </Link>
                </Button>

            </div>

            <Card>

                 <CardHeader className='p-0 mb-4'>
                        
                    <ShowFilter params={params} />

                     </CardHeader>

                     <CardContent className='p-0 [&-td]:whitespace-nowrap [&-td]:text-sm [&-td]px-6 [&-th]:px-6'>

                    { studyResults.length === 0 ? (
                        <EmptyState
                            icon={IconSchool}
                            title="Tidak ada kartu hasil studi"
                            subtitle="Mulai dengan membuat kartu hasil studi baru"
                        />
                    ) : (
                        <Table className='w-full'> 
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Nomor Pokok Mahasiswa</TableHead>
                                    <TableHead>Tahun Ajaran</TableHead>
                                    <TableHead>Semester</TableHead>
                                    <TableHead>GPA</TableHead>
                                    <TableHead>Dibuat Pada</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {studyResults.map((studyResult, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1 + (meta.current_page - 1) * meta.per_page}</TableCell>
                                        <TableCell>{studyResult.academicYear.name}</TableCell>
                                        <TableCell>{studyResult.semester}</TableCell>
                                        <TableCell>{studyResult.gpa}</TableCell>
                                        <TableCell>{formatDateIndo(studyResult.created_at)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-x-1">
                                                  <Grades
                                                    studyResult={studyResult}
                                                    grades={studyResult.grades}
                                                  />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    </CardContent>
                
                    <CardFooter className='flex flex-col items-center justify-between w-full gap-y-2 lg:flex-row'>
                        <p className='text-sm text-muted-foreground'>
                            Menampilkan <span className='font-medium text-blue-600'>{meta.from ?? 0}</span> dari{''} {meta.total} Kartu hasil Studi
                        </p>
                        <div className="overflow-x-auto">  
                            {meta.hasPages && <PaginationTable meta={meta} links={links} />}
                        </div>
                    </CardFooter>
               </Card>      
             </div>
        
    );
}

Index.layout = (page) => <StudentLayout children={page} title={page.props.page_settings.title}/>