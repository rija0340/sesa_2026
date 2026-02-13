import React, { useState, useEffect } from "react";
import {
  Title,
  SimpleGrid,
  Card,
  Text,
  Group,
  RingProgress,
  Box,
  Paper,
  Badge,
  Loader,
  Table,
  ScrollArea,
} from "@mantine/core";
import useApi from "../hooks/useApi";
import { getKilasys } from "../api/kilasy";
import { getRegistres } from "../api/registre";

/* ── Stat Card ─────────────────────────────────────────────────── */
function StatCard({ title, value, subtitle, color }) {
  const numVal = typeof value === "number" ? value : 0;
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text size="xs" tt="uppercase" fw={700} c="dimmed">
        {title}
      </Text>
      <Group justify="space-between" mt="md" align="flex-end">
        <Box>
          <Text size="xl" fw={800} style={{ fontSize: 32, lineHeight: 1 }}>
            {typeof value === "number" ? value.toLocaleString("fr-FR") : value}
          </Text>
          {subtitle && (
            <Text size="sm" c="dimmed" mt={4}>
              {subtitle}
            </Text>
          )}
        </Box>
        <RingProgress
          size={60}
          thickness={5}
          roundCaps
          sections={[{ value: Math.min(numVal, 100), color }]}
        />
      </Group>
    </Card>
  );
}

export default function Dashboard() {
  const { data: kilasys, loading: loadingK } = useApi(getKilasys);
  const { data: registres, loading: loadingR } = useApi(getRegistres);

  const loading = loadingK || loadingR;
  const kilasyList = Array.isArray(kilasys) ? kilasys : [];
  const registreList = Array.isArray(registres) ? registres : [];

  // Compute quick stats
  const totalKilasy = kilasyList.length;
  const totalRegistres = registreList.length;

  // Most recent registres (last 5)
  const recentRegistres = [...registreList]
    .sort((a, b) => {
      const da = a?.createdAt ? new Date(a.createdAt) : new Date(0);
      const db = b?.createdAt ? new Date(b.createdAt) : new Date(0);
      return db - da;
    })
    .slice(0, 5);

  // Average presence and apprentissage from all registres
  let avgPresence = 0;
  let avgApprentissage = 0;
  if (registreList.length > 0) {
    const totalPresents = registreList.reduce((sum, r) => sum + (r.mambraTonga || 0), 0);
    const totalLearners = registreList.reduce((sum, r) => sum + (r.nianatraImpito || 0), 0);
    const totalAll = registreList.reduce((sum, r) => sum + (r.tongaRehetra || 0), 0);
    avgPresence = totalAll > 0
      ? Math.round((totalPresents / totalAll) * 100)
      : 0;
    avgApprentissage = totalAll > 0
      ? Math.round((totalLearners / totalAll) * 100)
      : 0;
  }

  // Total offrande
  const totalOffrande = registreList.reduce(
    (sum, r) => sum + (Number(r?.fanatitra) || 0),
    0
  );

  function getKilasyName(kilasyId) {
    const k = kilasyList.find((x) => String(x?.id) === String(kilasyId));
    return k ? k.nom : `#${kilasyId}`;
  }

  function formatDate(dateStr) {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  }

  return (
    <Box>
      <Title order={2} mb="xs">
        Tableau de bord
      </Title>
      <Text c="dimmed" mb="xl">
        Vue d'ensemble du Sekoly Sabata
      </Text>

      {loading ? (
        <Box py="xl" style={{ display: "flex", justifyContent: "center" }}>
          <Loader />
        </Box>
      ) : (
        <>
          <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="lg" mb="xl">
            <StatCard
              title="Classes"
              value={totalKilasy}
              subtitle="Kilasy enregistrées"
              color="indigo"
            />
            <StatCard
              title="Registres"
              value={totalRegistres}
              subtitle="Entrées totales"
              color="cyan"
            />
            <StatCard
              title="Présence"
              value={avgPresence}
              subtitle="Moyenne %"
              color="teal"
            />
            <StatCard
              title="Offrande totale"
              value={`${totalOffrande.toLocaleString("fr-FR")} Ar`}
              subtitle="Fanatitra"
              color="yellow"
            />
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            {/* Recent registres */}
            <Paper shadow="sm" radius="md" p="xl" withBorder>
              <Text fw={600} mb="md">
                Derniers registres
              </Text>
              {recentRegistres.length === 0 ? (
                <Text c="dimmed" size="sm">
                  Aucun registre enregistré pour le moment.
                </Text>
              ) : (
                <ScrollArea>
                  <Table striped highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Date</Table.Th>
                        <Table.Th>Classe</Table.Th>
                        <Table.Th>Présents</Table.Th>
                        <Table.Th>Offrande</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {recentRegistres.map((r) => (
                        <Table.Tr key={r.id}>
                          <Table.Td>{formatDate(r.createdAt)}</Table.Td>
                          <Table.Td>{getKilasyName(r.kilasyId)}</Table.Td>
                          <Table.Td>
                            <Badge variant="light" color="indigo" size="sm">
                              {r.mambraTonga}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">
                              {Number(r.fanatitra).toLocaleString("fr-FR")} Ar
                            </Text>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              )}
            </Paper>

            {/* Classes overview */}
            <Paper shadow="sm" radius="md" p="xl" withBorder>
              <Text fw={600} mb="md">
                Aperçu des classes
              </Text>
              {kilasyList.length === 0 ? (
                <Text c="dimmed" size="sm">
                  Aucune classe créée pour le moment.
                </Text>
              ) : (
                <Box style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {kilasyList.map((k) => {
                    const count = registreList.filter(
                      (r) => String(r?.kilasyId) === String(k?.id)
                    ).length;
                    return (
                      <Paper key={k.id} p="sm" radius="sm" withBorder>
                        <Group justify="space-between">
                          <Box>
                            <Text size="sm" fw={600}>
                              {k.nom}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {k.description || "Pas de description"}
                            </Text>
                          </Box>
                          <Group gap="xs">
                            <Badge variant="light" color="indigo" size="sm">
                              {k.nbrMambra ?? "—"} membres
                            </Badge>
                            <Badge variant="dot" color="gray" size="sm">
                              {count} registre{count > 1 ? "s" : ""}
                            </Badge>
                          </Group>
                        </Group>
                      </Paper>
                    );
                  })}
                </Box>
              )}
            </Paper>
          </SimpleGrid>
        </>
      )}
    </Box>
  );
}
