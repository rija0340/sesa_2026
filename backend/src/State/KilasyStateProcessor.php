<?php

namespace App\State;

use ApiPlatform\Metadata\DeleteOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\ApiResource\KilasyResource;
use App\Entity\Kilasy;
use App\Repository\KilasyRepositoryInterface;
use App\Repository\KilasyLasitraRepositoryInterface;

class KilasyStateProcessor implements ProcessorInterface
{
    private KilasyRepositoryInterface $kilasyRepository;
    private KilasyLasitraRepositoryInterface $kilasyLasitraRepository;

    public function __construct(
        KilasyRepositoryInterface $kilasyRepository,
        KilasyLasitraRepositoryInterface $kilasyLasitraRepository
    ) {
        $this->kilasyRepository = $kilasyRepository;
        $this->kilasyLasitraRepository = $kilasyLasitraRepository;
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if (!$data instanceof KilasyResource) {
            return $data;
        }

        if ($operation instanceof DeleteOperationInterface) {
            $this->remove($data);
            return null;
        }

        return $this->persist($data);
    }

    private function remove(KilasyResource $resource): void
    {
        if ($resource->id) {
            $entity = $this->kilasyRepository->findById($resource->id);
            if ($entity) {
                $this->kilasyRepository->delete($entity);
            }
        }
    }

    private function persist(KilasyResource $resource): KilasyResource
    {
        $entity = null;
        if ($resource->id) {
            $entity = $this->kilasyRepository->findById($resource->id);
        }

        if (!$entity) {
            $entity = new Kilasy();
        }

        $entity->setNom($resource->nom);
        if ($resource->description !== null) {
            $entity->setDescription($resource->description);
        }
        if ($resource->nbrMambra !== null) {
            $entity->setNbrMambra($resource->nbrMambra);
        }
        $entity->setNbrMambraUsed($resource->nbrMambraUsed);

        if ($resource->kilasyLasitraId) {
            $kilasyLasitra = $this->kilasyLasitraRepository->findById($resource->kilasyLasitraId);
            if ($kilasyLasitra) {
                $entity->setKilasyLasitra($kilasyLasitra);
            }
        }

        $this->kilasyRepository->save($entity);

        // Update resource with ID
        $resource->id = $entity->getId();

        return $resource;
    }
}
