<?php

namespace App\Repository;

use App\Entity\Registre;
use Doctrine\ORM\EntityManagerInterface;

class RegistreRepository implements RegistreRepositoryInterface
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function findAll(): array
    {
        return $this->entityManager->getRepository(Registre::class)->findAll();
    }

    public function findById(int $id): ?Registre
    {
        return $this->entityManager->find(Registre::class, $id);
    }

    public function findByKilasyId(int $kilasyId): array
    {
        return $this->entityManager->getRepository(Registre::class)
            ->findBy(['kilasy' => $kilasyId]);
    }

    public function findByDate(\DateTimeInterface $date): array
    {
        return $this->entityManager->getRepository(Registre::class)
            ->createQueryBuilder('r')
            ->where('DATE(r.createdAt) = :date')
            ->setParameter('date', $date->format('Y-m-d'))
            ->getQuery()
            ->getResult();
    }

    public function save(Registre $registre): void
    {
        $this->entityManager->persist($registre);
        $this->entityManager->flush();
    }

    public function delete(Registre $registre): void
    {
        $this->entityManager->remove($registre);
        $this->entityManager->flush();
    }
}