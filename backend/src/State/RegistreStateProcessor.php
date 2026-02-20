<?php

namespace App\State;

use ApiPlatform\Metadata\DeleteOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\ApiResource\RegistreResource;
use App\Domain\Exception\DomainValidationException;
use App\Entity\Registre;
use App\Repository\KilasyRepositoryInterface;
use App\Repository\RegistreRepositoryInterface;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class RegistreStateProcessor implements ProcessorInterface
{
    private RegistreRepositoryInterface $registreRepository;
    private KilasyRepositoryInterface $kilasyRepository;

    public function __construct(
        RegistreRepositoryInterface $registreRepository,
        KilasyRepositoryInterface $kilasyRepository
    ) {
        $this->registreRepository = $registreRepository;
        $this->kilasyRepository = $kilasyRepository;
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if (!$data instanceof RegistreResource) {
            return $data;
        }

        if ($operation instanceof DeleteOperationInterface) {
            $this->remove($data);
            return null;
        }

        return $this->persist($data);
    }

    private function remove(RegistreResource $resource): void
    {
        if ($resource->id) {
            $entity = $this->registreRepository->findById($resource->id);
            if ($entity) {
                $this->registreRepository->delete($entity);
            }
        }
    }

    private function persist(RegistreResource $resource): RegistreResource
    {
        $entity = null;
        if ($resource->id) {
            $entity = $this->registreRepository->findById($resource->id);
        }

        if (!$entity) {
            $entity = new Registre();
        }

        $kilasy = $this->kilasyRepository->findById($resource->kilasyId);
        if (!$kilasy) {
            throw new UnprocessableEntityHttpException("Classe introuvable avec l'ID: {$resource->kilasyId}");
        }

        $existingSameDate = $this->registreRepository->findByKilasyIdAndDate(
            $resource->kilasyId,
            $resource->createdAt
        );

        if ($existingSameDate && (!$entity->getId() || $existingSameDate->getId() !== $entity->getId())) {
            throw new UnprocessableEntityHttpException(sprintf(
                'Un registre existe déjà pour cette classe à la date %s.',
                $resource->createdAt->format('Y-m-d')
            ));
        }

        try {
            $entity->enregistrerDonnees(
                kilasy: $kilasy,
                mambraTonga: $resource->mambraTonga,
                mpamangy: $resource->mpamangy,
                nianatraImpito: $resource->nianatraImpito,
                asaSoa: $resource->asaSoa,
                fampianaranaBaiboly: $resource->fampianaranaBaiboly,
                bokyTrakta: $resource->bokyTrakta,
                semineraKaoferansa: $resource->semineraKaoferansa,
                alasarona: $resource->alasarona,
                nahavitaFampTaratasy: $resource->nahavitaFampTaratasy,
                batisaTami: $resource->batisaTami,
                fanatitra: $resource->fanatitra,
                createdAt: $resource->createdAt,
                asafi: $resource->asafi,
                nbrMambraKilasy: $kilasy->getNombreMembresEffectif()
            );
        } catch (DomainValidationException $e) {
            throw new UnprocessableEntityHttpException($e->getMessage(), $e);
        }

        $this->registreRepository->save($entity);

        // Update response resource with computed/persisted values
        $resource->id = $entity->getId();
        $resource->tongaRehetra = $entity->getTongaRehetra();
        $resource->nbrMambraKilasy = $entity->getNbrMambraKilasy();

        return $resource;
    }
}
