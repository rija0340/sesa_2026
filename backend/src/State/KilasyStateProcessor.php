<?php

namespace App\State;

use ApiPlatform\Metadata\DeleteOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\ApiResource\KilasyResource;
use App\Domain\Exception\DomainValidationException;
use App\Entity\Kilasy;
use App\Repository\KilasyRepositoryInterface;
use App\Repository\KilasyLasitraRepositoryInterface;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

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

        $kilasyLasitra = $this->resolveKilasyLasitra($resource->kilasyLasitraId);

        try {
            $entity->appliquerConfiguration(
                nom: $resource->nom,
                description: $resource->description,
                nbrMambra: $resource->nbrMambra,
                nbrMambraUsed: $resource->nbrMambraUsed,
                kilasyLasitra: $kilasyLasitra
            );
        } catch (DomainValidationException $e) {
            throw new UnprocessableEntityHttpException($e->getMessage(), $e);
        }

        $this->kilasyRepository->save($entity);

        // Update resource with ID
        $resource->id = $entity->getId();

        return $resource;
    }

    private function resolveKilasyLasitra(?int $kilasyLasitraId): ?\App\Entity\KilasyLasitra
    {
        if ($kilasyLasitraId === null) {
            return null;
        }

        $kilasyLasitra = $this->kilasyLasitraRepository->findById($kilasyLasitraId);
        if (!$kilasyLasitra) {
            throw new UnprocessableEntityHttpException(
                sprintf('Classe modèle introuvable avec l\'ID: %d', $kilasyLasitraId)
            );
        }

        return $kilasyLasitra;
    }
}
