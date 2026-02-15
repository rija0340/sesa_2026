import React, { useState, useEffect, useMemo } from "react";
import {
  Title,
  Text,
  Box,
  Paper,
  SimpleGrid,
  Group,
  Select,
  RingProgress,
  Badge,
  Loader,
  Alert,
  TextInput,
  Button,
  Table,
  ScrollArea,
  Stack,
  SegmentedControl,
  Divider,
  NumberInput,
} from "@mantine/core";
/* ── Icons ─────────────────────────────────────────────────────── */
function IconCalendar() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconChartBar() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

import useApi from "../hooks/useApi";
import { getKilasys } from "../api/kilasy";
import { getStatsPeriode } from "../api/registre";

/* ── Constants & Translations ──────────────────────────────── */

// Exact labels from v1
const INDICATORS = [
  { key: 'mambraTonga', label: 'Mambra tonga' },
  { key: 'mpamangy', label: 'Mpamangy' },
  { key: 'tongaRehetra', label: 'Tonga rehetra' },
  { key: 'nianatraImpito', label: 'Nianatra impito' },
  { key: 'asafi', label: 'Asafi' }, // V1 uses 'Asafi' in table, 'Asa fitoriana' in headers. user asked for v1 words.
  { key: 'asaSoa', label: 'Asa soa' },
  { key: 'fampianaranaBaiboly', label: 'Fampianarana Baiboly' },
  { key: 'bokyTrakta', label: 'Boky na Trakta nozaraina' },
  { key: 'semineraKaoferansa', label: 'Seminera na kaoferansa' },
  { key: 'alasarona', label: 'Alasarona' },
  { key: 'nahavitaFampTaratasy', label: 'Nahavita fampianarana ara-taratasy' },
  { key: 'batisaTami', label: 'Batisa TAMI' },
  { key: 'fanatitra', label: 'Fanatitra', format: 'money' },
];

const PERIOD_TYPES = [
  { value: 'sabata', label: 'Sabata (Daty iray)' },
  { value: 'month', label: 'Mois' },
  { value: 'quarter', label: 'Trimestre' },
  { value: 'semester', label: 'Semestre' },
  { value: 'year', label: 'Année' },
  { value: 'custom', label: 'Personnalisé' },
];

/* ── Helper Components ─────────────────────────────────────── */

function StatCard({ title, value, suffix, color }) {
  const numValue = typeof value === "number" ? value : 0;
  return (
    <Paper shadow="sm" radius="md" p="md" withBorder>
      <Group justify="space-between" align="flex-start">
        <Box>
          <Text size="xs" tt="uppercase" fw={700} c="dimmed">
            {title}
          </Text>
          <Text size="xl" fw={800} mt="xs">
            {typeof value === "number" ? value.toLocaleString("fr-FR") : "—"}
            {suffix && (
              <Text span size="sm" fw={600} c="dimmed">
                {" "}{suffix}
              </Text>
            )}
          </Text>
        </Box>
        <RingProgress
          size={50}
          thickness={4}
          roundCaps
          sections={[{ value: Math.min(numValue, 100), color }]}
          label={
            <Text c={color} fw={700} ta="center" size="xs">
              {Math.min(numValue, 100).toFixed(0)}%
            </Text>
          }
        />
      </Group>
    </Paper>
  );
}

/* ── Main Component ────────────────────────────────────────── */

export default function StatsPage() {
  // Data State
  const { data: kilasys } = useApi(getKilasys);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statsData, setStatsData] = useState(null); // Contains { periode, statistiques, data[] }

  // Filter State
  const [periodType, setPeriodType] = useState('sabata');
  const [viewMode, setViewMode] = useState('kilasy'); // 'kilasy' (columns=classes) or 'time' (columns=sub-periods)

  // Date Selection State
  const today = new Date().toISOString().split('T')[0];
  const currentYear = new Date().getFullYear();

  const [refDate, setRefDate] = useState(today); // For Sabata
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [quarter, setQuarter] = useState(1);
  const [semester, setSemester] = useState(1);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // Derived effective date range
  const dateRange = useMemo(() => {
    let start, end;

    switch (periodType) {
      case 'sabata':
        start = refDate;
        end = refDate; // Controller handles explicit date end time
        break;
      case 'month':
        // Last day of month
        const lastDay = new Date(year, month, 0).getDate();
        start = `${year}-${String(month).padStart(2, '0')}-01`;
        end = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;
        break;
      case 'quarter':
        const qStartMonth = (quarter - 1) * 3; // 0, 3, 6, 9
        const qEndMonth = qStartMonth + 2;
        const qLastDay = new Date(year, qEndMonth + 1, 0).getDate();
        start = `${year}-${String(qStartMonth + 1).padStart(2, '0')}-01`;
        end = `${year}-${String(qEndMonth + 1).padStart(2, '0')}-${qLastDay}`;
        break;
      case 'semester':
        const sStartMonth = (semester - 1) * 6; // 0, 6
        const sEndMonth = sStartMonth + 5;
        const sLastDay = new Date(year, sEndMonth + 1, 0).getDate();
        start = `${year}-${String(sStartMonth + 1).padStart(2, '0')}-01`;
        end = `${year}-${String(sEndMonth + 1).padStart(2, '0')}-${sLastDay}`;
        break;
      case 'year':
        start = `${year}-01-01`;
        end = `${year}-12-31`;
        break;
      case 'custom':
        start = customStart;
        end = customEnd;
        break;
      default:
        start = ''; end = '';
    }
    return { start, end };
  }, [periodType, refDate, year, month, quarter, semester, customStart, customEnd]);

  // Load Data
  const loadStats = async () => {
    if (!dateRange.start || !dateRange.end) return;

    setLoading(true);
    setError(null);
    try {
      const res = await getStatsPeriode(dateRange.start, dateRange.end);
      setStatsData(res);
    } catch (err) {
      setError("Erreur lors du chargement des statistiques : " + err.message);
      setStatsData(null);
    } finally {
      setLoading(false);
    }
  };

  // Trigger load when hitting "Rechercher" or specific types? 
  // User prefers explicit actions, but for UX 'Search' button is best.

  /* ── Aggregation Logic ───────────────────────────────────── */

  const matrix = useMemo(() => {
    if (!statsData?.data) return null;

    const raw = statsData.data;
    const kilasyList = Array.isArray(kilasys) ? kilasys : [];

    // 1. Determine Columns (Series)
    let columns = [];
    let getColKey = (row) => ''; // function to get column key from data row

    if (periodType === 'sabata' || viewMode === 'kilasy') {
      // Columns are Classes
      columns = kilasyList.map(k => ({ key: k.nom, label: k.nom, id: k.id }));
      getColKey = (r) => r.kilasy; // r.kilasy is Name
    } else {
      // Columns are Time Periods (Months, Days)
      // Logic to generate time columns based on range? 
      // Simplified: Find all unique dates/months in data and sort them
      const uniqueDates = [...new Set(raw.map(r => r.date))].sort();
      columns = uniqueDates.map(d => ({ key: d, label: d }));
      getColKey = (r) => r.date;
    }

    // 2. Aggregate Data
    // Structure: { [indicatorKey]: { [colKey]: sum, total: sum } }
    const rows = {};

    // Initialize rows
    INDICATORS.forEach(ind => {
      rows[ind.key] = { label: ind.label, total: 0, byCol: {} };
      columns.forEach(col => {
        rows[ind.key].byCol[col.key] = 0;
      });
    });

    // Sum values
    raw.forEach(record => {
      const colKey = getColKey(record);
      // Skip if column key not in our definitions (e.g. class deleted)
      // But for 'Time', we built columns from data, so it matches.
      // For 'Kilasy', it depends if kilasys list matches record names.

      INDICATORS.forEach(ind => {
        const val = Number(record[ind.key]) || 0;
        if (rows[ind.key]) {
          rows[ind.key].total += val;
          if (rows[ind.key].byCol[colKey] !== undefined) {
            rows[ind.key].byCol[colKey] += val;
          } else if (viewMode === 'time') {
            // If dynamic time columns, ensure it exists (though we pre-filled)
            rows[ind.key].byCol[colKey] = (rows[ind.key].byCol[colKey] || 0) + val;
          }
        }
      });
    });

    return { columns, rows };
  }, [statsData, kilasys, viewMode, periodType]);


  /* ── Render ──────────────────────────────────────────────── */

  return (
    <Box>
      <Group justify="space-between" mb="xl">
        <Box>
          <Title order={2} mb={4}>Statistiques</Title>
          <Text c="dimmed">Tatitra Sabata & Rétrospectives</Text>
        </Box>
      </Group>

      {/* ── Filters ────────────────────────────────────────── */}
      <Paper shadow="sm" radius="md" p="lg" withBorder mb="lg">
        <Stack gap="md">
          <Group align="flex-end">
            <Select
              label="Type de période"
              data={PERIOD_TYPES}
              value={periodType}
              onChange={(v) => { setPeriodType(v); setStatsData(null); }}
              allowDeselect={false}
              style={{ width: 200 }}
            />

            {/* Dynamic Date Selectors based on Type */}
            {periodType === 'sabata' && (
              <TextInput
                label="Date du Sabbat" type="date"
                value={refDate} onChange={(e) => setRefDate(e.target.value)}
              />
            )}

            {periodType === 'month' && (
              <>
                <NumberInput
                  label="Année" value={year} onChange={setYear} min={2000} max={2100}
                  allowDecimal={false}
                />
                <Select
                  label="Mois"
                  data={[
                    { value: '1', label: 'Janoary' }, { value: '2', label: 'Febroary' }, { value: '3', label: 'Martsa' },
                    { value: '4', label: 'Aprily' }, { value: '5', label: 'May' }, { value: '6', label: 'Jona' },
                    { value: '7', label: 'Jolay' }, { value: '8', label: 'Aogositra' }, { value: '9', label: 'Septambra' },
                    { value: '10', label: 'Oktobra' }, { value: '11', label: 'Novambra' }, { value: '12', label: 'Desambra' }
                  ]}
                  value={String(month)} onChange={(v) => setMonth(Number(v))}
                />
              </>
            )}

            {periodType === 'quarter' && (
              <>
                <NumberInput label="Année" value={year} onChange={setYear} min={2000} max={2100} allowDecimal={false} />
                <Select
                  label="Trimestre"
                  data={[
                    { value: '1', label: 'T1 (Jan-Mar)' },
                    { value: '2', label: 'T2 (Avr-Jun)' },
                    { value: '3', label: 'T3 (Jul-Sep)' },
                    { value: '4', label: 'T4 (Oct-Dec)' }
                  ]}
                  value={String(quarter)} onChange={(v) => setQuarter(Number(v))}
                />
              </>
            )}

            {periodType === 'semester' && (
              <>
                <NumberInput label="Année" value={year} onChange={setYear} min={2000} max={2100} allowDecimal={false} />
                <Select
                  label="Semestre"
                  data={[{ value: '1', label: 'S1 (Jan-Jun)' }, { value: '2', label: 'S2 (Jul-Dec)' }]}
                  value={String(semester)} onChange={(v) => setSemester(Number(v))}
                />
              </>
            )}

            {periodType === 'year' && (
              <NumberInput label="Année" value={year} onChange={setYear} min={2000} max={2100} allowDecimal={false} />
            )}

            {periodType === 'custom' && (
              <>
                <TextInput label="Du" type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} />
                <TextInput label="Au" type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} />
              </>
            )}

            <Button onClick={loadStats} leftSection={<IconChartBar size={16} />}>
              Générer Rapport
            </Button>
          </Group>

          {/* View Mode Switcher (only relevant for Periods, not single date) */}
          {periodType !== 'sabata' && (
            <Group>
              <Text size="sm" fw={500}>Affichage :</Text>
              <SegmentedControl
                value={viewMode}
                onChange={setViewMode}
                data={[
                  { label: 'Par Classe (Global)', value: 'kilasy' },
                  { label: 'Chronologique (Par date)', value: 'time' },
                ]}
              />
            </Group>
          )}
        </Stack>
      </Paper>

      {/* ── Output ─────────────────────────────────────────── */}

      {error && <Alert color="red" title="Erreur" icon={<IconCalendar />}>{error}</Alert>}

      {loading && (
        <Box py="xl" style={{ display: 'flex', justifyContent: 'center' }}>
          <Loader size="lg" />
        </Box>
      )}

      {statsData && !loading && matrix && (
        <Stack gap="xl">

          {/* 1. Global Cards */}
          <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="lg">
            <StatCard
              title="Membres Présents"
              value={statsData.statistiques.totalMembresTonga}
              color="indigo"
              suffix="/ Total" // Ideally show total members here
            />
            <StatCard
              title="Présence Moyenne"
              value={statsData.statistiques.moyennePresence}
              color="teal"
              suffix="%"
            />
            <StatCard
              title="Apprentissage"
              value={statsData.statistiques.moyenneApprentissage}
              color="cyan"
              suffix="%"
            />
            <StatCard
              title="Total Offrandes"
              value={matrix.rows['fanatitra'].total}
              color="yellow"
              suffix="Ar"
            />
          </SimpleGrid>

          {/* 2. Main Matrix Table */}
          <Paper shadow="sm" radius="md" p="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={4}>
                Tableau de bord : {periodType === 'sabata' ? 'Tatitra Sabata' : 'Récapitulatif Périodique'}
              </Title>
              <Badge variant="light" size="lg">
                {statsData.periode.du} au {statsData.periode.au}
              </Badge>
            </Group>

            <ScrollArea>
              <Table striped withTableBorder withColumnBorders highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th style={{ minWidth: 200, backgroundColor: 'var(--mantine-color-gray-0)' }}>
                      Rubrique
                    </Table.Th>
                    {matrix.columns.map(col => (
                      <Table.Th key={col.key} ta="center" style={{ minWidth: 100 }}>
                        {col.label}
                      </Table.Th>
                    ))}
                    <Table.Th ta="center" style={{ width: 100, backgroundColor: 'var(--mantine-color-red-0)', color: 'var(--mantine-color-red-9)' }}>
                      TOTAL
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {INDICATORS.map(ind => {
                    const rowData = matrix.rows[ind.key];
                    return (
                      <Table.Tr key={ind.key}>
                        <Table.Td fw={600}>{ind.label}</Table.Td>
                        {matrix.columns.map(col => (
                          <Table.Td key={col.key} ta="center">
                            {ind.format === 'money'
                              ? rowData.byCol[col.key]?.toLocaleString('fr-FR')
                              : rowData.byCol[col.key] || '-'}
                          </Table.Td>
                        ))}
                        <Table.Td ta="center" fw={700} c="red.9">
                          {ind.format === 'money'
                            ? rowData.total.toLocaleString('fr-FR')
                            : rowData.total}
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Paper>

          {statsData.data.length === 0 && (
            <Alert color="blue" title="Aucune donnée">
              Aucun registre trouvé pour la période sélectionnée.
            </Alert>
          )}
        </Stack>
      )}
    </Box>
  );
}
