<?php


namespace App\Enums;



enum MessageType: string

{


    case CREATED = 'Berhasil menambahkan';

    case UPDATED = 'Berhasil memperbarui';

    case DELETED = 'Berhasil menghapus';

    case ERROR = 'Terjadi kesalahan. Silahkan coba lagi nanti';


    public function message(string $entity = '', ?string $error = null): string

    {


        if($this === MessageType::ERROR && $error){

            return "{$this->value} {$error}";
      
        }


        return "{$this->value} {$entity}";

    }

    
}

// 
// <?php

// namespace App\Enums;

// enum MessageType: string
// {
//     case CREATED = 'Berhasil menambahkan';
//     case UPDATED = 'Berhasil memperbarui';
//     case DELETED = 'Berhasil menghapus';
//     case ERROR = 'Terjadi kesalahan. Silahkan coba lagi nanti';

//     public function message(string $entity = '', ?string $error = null): string
//     {
//         return match($this) {
//             self::CREATED => $this->formatMessage($entity),
//             self::UPDATED => $this->formatMessage($entity),
//             self::DELETED => $this->formatMessage($entity),
//             self::ERROR => $error ?? $this->value,
//         };
//     }

//     private function formatMessage(string $entity): string
//     {
//         if ($entity === '') {
//             return $this->value;
//         }
//         return "{$this->value} {$entity}";
//     }
// }

// // 
