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
            normalizationContext: ['groups' => ['kilasy:read']],
            security: "is_granted('ROLE_USER')"
        ),
        new GetCollection(
            normalizationContext: ['groups' => ['kilasy:read']],
            security: "is_granted('ROLE_USER')"
        ),
        new Post(
            normalizationContext: ['groups' => ['kilasy:read']],
            denormalizationContext: ['groups' => ['kilasy:write']],
            security: "is_granted('ROLE_ADMIN')"
        ),
        new Patch(
            normalizationContext: ['groups' => ['kilasy:read']],
            denormalizationContext: ['groups' => ['kilasy:write']],
            security: "is_granted('ROLE_ADMIN')"
        ),
        new Delete(security: "is_granted('ROLE_ADMIN')")
    ],
    routePrefix: '/sekoly-sabata'
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