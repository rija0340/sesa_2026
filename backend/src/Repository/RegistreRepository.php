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
        $start = (clone $date)->setTime(0, 0, 0);
        $end = (clone $date)->setTime(23, 59, 59);

        return $this->entityManager->getRepository(Registre::class)
            ->createQueryBuilder('r')
            ->where('r.createdAt BETWEEN :start AND :end')
            ->setParameter('start', $start)
            ->setParameter('end', $end)
            ->getQuery()
            ->getResult();
    }

    public function findByKilasyIdAndDate(int $kilasyId, \DateTimeInterface $date): ?Registre
    {
        $start = (clone $date)->setTime(0, 0, 0);
        $end = (clone $date)->setTime(23, 59, 59);

        return $this->entityManager->getRepository(Registre::class)
            ->createQueryBuilder('r')
            ->where('r.kilasy = :kilasyId')
            ->andWhere('r.createdAt BETWEEN :start AND :end')
            ->setParameter('kilasyId', $kilasyId)
            ->setParameter('start', $start)
            ->setParameter('end', $end)
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
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
