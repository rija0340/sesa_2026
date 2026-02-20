import React, { useState, useMemo } from "react";
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
  Divider,
  SegmentedControl,
} from "@mantine/core";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
dayjs.extend(quarterOfYear);
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
  const [period, setPeriod] = useState("quarter"); // 'quarter', 'year', 'all'

  const loading = loadingK || loadingR;
  const kilasyList = Array.isArray(kilasys) ? kilasys : [];
  const allRegistres = Array.isArray(registres) ? registres : [];

  const filteredRegistres = useMemo(() => {
    if (period === "all") return allRegistres;
    
    const now = dayjs();
    let start;
    if (period === "quarter") {
      start = now.startOf("quarter");
    } else {
      start = now.startOf("year");
    }

    return allRegistres.filter(r => {
      const d = dayjs(r.createdAt);
      return d.isAfter(start) || d.isSame(start);
    });
  }, [allRegistres, period]);

  // Compute quick stats based on filtered data
  const totalKilasy = kilasyList.length;
  const totalRegistres = filteredRegistres.length;

  // Most recent registres (last 5 from all - to see latest activity regardless of filter?) 
  // actually usually dashboard stats follow filter, but recent list might be global. 
  // Let's keep recent global for activity, or filtered for consistency. Filtered is better for "dashboard" logic.
  const recentRegistres = [...filteredRegistres]
    .sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix())
    .slice(0, 5);

  const stats = useMemo(() => {
    if (filteredRegistres.length === 0) {
      return { avgPresence: 0, avgApprentissage: 0, totalOffrande: 0 };
    }

    const totalPresents = filteredRegistres.reduce((sum, r) => sum + (Number(r.mambraTonga) || 0), 0);
    const totalLearners = filteredRegistres.reduce((sum, r) => sum + (Number(r.nianatraImpito) || 0), 0);
    const totalAll = filteredRegistres.reduce((sum, r) => sum + (Number(r.tongaRehetra) || 0), 0);
    const totalOffrande = filteredRegistres.reduce((sum, r) => sum + (Number(r.fanatitra) || 0), 0);

    return {
      avgPresence: totalAll > 0 ? Math.round((totalPresents / totalAll) * 100) : 0,
      avgApprentissage: totalAll > 0 ? Math.round((totalLearners / totalAll) * 100) : 0,
      totalOffrande
    };
  }, [filteredRegistres]);

  function getKilasyName(kilasyId) {
    const k = kilasyList.find((x) => String(x?.id) === String(kilasyId));
    return k ? k.nom : `#${kilasyId}`;
  }

  function formatDate(dateStr) {
    if (!dateStr) return "—";
    return dayjs(dateStr).locale("fr").format("DD MMM YYYY");
  }

  return (
    <Box>
      <Group justify="space-between" align="center" mb="xl">
        <Box>
          <Title order={2} mb="xs">
            Tableau de bord
          </Title>
          <Text c="dimmed">
            Vue d'ensemble du Sekoly Sabata
          </Text>
        </Box>

        <Box>
          <Text size="xs" fw={700} c="dimmed" mb={5} tt="uppercase" ta="right">Période d'affichage</Text>
          <SegmentedControl
            value={period}
            onChange={setPeriod}
            data={[
              { label: 'Trimestre', value: 'quarter' },
              { label: 'Année', value: 'year' },
              { label: 'Tout', value: 'all' },
            ]}
          />
        </Box>
      </Group>

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
              value={stats.avgPresence}
              subtitle="Moyenne %"
              color="teal"
            />
            <StatCard
              title="Offrande"
              value={`${stats.totalOffrande.toLocaleString("fr-FR")} Ar`}
              subtitle="Total sur la période"
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
                    const count = allRegistres.filter(
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
