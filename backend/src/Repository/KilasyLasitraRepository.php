<?php

namespace App\Repository;

use App\Entity\KilasyLasitra;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class KilasyLasitraRepository extends ServiceEntityRepository implements KilasyLasitraRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, KilasyLasitra::class);
    }

    public function findAll(): array
    {
        return parent::findAll();
    }

    public function findById(int $id): ?KilasyLasitra
    {
        return $this->find($id);
    }

    public function save(KilasyLasitra $kilasyLasitra): void
    {
        $this->_em->persist($kilasyLasitra);
        $this->_em->flush();
    }

    public function delete(KilasyLasitra $kilasyLasitra): void
    {
        $this->_em->remove($kilasyLasitra);
        $this->_em->flush();
    }
}
