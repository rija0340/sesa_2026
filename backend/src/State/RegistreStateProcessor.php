<?php

namespace App\State;

use ApiPlatform\Metadata\DeleteOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\ApiResource\RegistreResource;
use App\Entity\Registre;
use App\Repository\KilasyRepositoryInterface;
use App\Repository\RegistreRepositoryInterface;

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
            throw new \Exception("Classe introuvable avec l'ID: {$resource->kilasyId}");
        }

        $entity->setMambraTonga($resource->mambraTonga)
               ->setMpamangy($resource->mpamangy)
               ->setNianatraImpito($resource->nianatraImpito)
               ->setAsaSoa($resource->asaSoa)
               ->setFampianaranaBaiboly($resource->fampianaranaBaiboly)
               ->setBokyTrakta($resource->bokyTrakta);

        // Convert DateTimeImmutable to DateTime if necessary for Doctrine 'date' type compatibility
        if ($resource->createdAt instanceof \DateTimeImmutable) {
            $mutableDate = new \DateTime();
            $mutableDate->setTimestamp($resource->createdAt->getTimestamp());
            $entity->setCreatedAt($mutableDate);
        } else {
            $entity->setCreatedAt($resource->createdAt);
        }
               
        $entity->setKilasy($kilasy)
               ->setSemineraKaoferansa($resource->semineraKaoferansa)
               ->setAlasarona($resource->alasarona)
               ->setNahavitaFampTaratasy($resource->nahavitaFampTaratasy)
               ->setBatisaTami($resource->batisaTami)
               ->setFanatitra($resource->fanatitra)
               ->setTongaRehetra($resource->tongaRehetra)
               ->setAsafi($resource->asafi)
               ->setNbrMambraKilasy($resource->nbrMambraKilasy);

        $this->registreRepository->save($entity);

        // Update resource with ID
        $resource->id = $entity->getId();

        return $resource;
    }
}
