<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new Get(
            normalizationContext: ['groups' => ['kilasy:read']]
        ),
        new GetCollection(
            normalizationContext: ['groups' => ['kilasy:read']]
        ),
        new Post(
            normalizationContext: ['groups' => ['kilasy:read']],
            denormalizationContext: ['groups' => ['kilasy:write']]
        ),
        new Patch(
            normalizationContext: ['groups' => ['kilasy:read']],
            denormalizationContext: ['groups' => ['kilasy:write']]
        ),
        new Delete()
    ],
    routePrefix: '/sekoly-sabata',
    provider: \App\State\KilasyStateProvider::class,
    processor: \App\State\KilasyStateProcessor::class
)]
class KilasyResource
{
    #[Groups(['kilasy:read'])]
    public ?int $id = null;

    #[Groups(['kilasy:read', 'kilasy:write'])]
    public string $nom = '';

    #[Groups(['kilasy:read', 'kilasy:write'])]
    public ?string $description = null;

    #[Groups(['kilasy:read', 'kilasy:write'])]
    public ?int $nbrMambra = null;

    #[Groups(['kilasy:read', 'kilasy:write'])]
    public string $nbrMambraUsed = 'registre';

    #[Groups(['kilasy:read', 'kilasy:write'])]
    public ?int $kilasyLasitraId = null;
}