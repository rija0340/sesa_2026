import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  AppShell,
  Burger,
  Group,
  Text,
  NavLink as MantineNavLink,
  ScrollArea,
  Box,
  ActionIcon,
  useMantineColorScheme,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const ICON_SIZE = 20;

/* ── Inline SVG icons (no extra deps) ──────────────────────────── */
function IconDashboard() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function IconSchool() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 10l10-7 10 7" />
      <path d="M6 12v5a2 2 0 002 2h8a2 2 0 002-2v-5" />
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <line x1="12" y1="11" x2="12" y2="17" />
      <line x1="9" y1="14" x2="15" y2="14" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

/* ── Nav items definition ──────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Tableau de bord", icon: IconDashboard, path: "/" },
  { label: "Kilasy", icon: IconSchool, path: "/kilasy" },
  { label: "Registre", icon: IconClipboard, path: "/registre" },
  { label: "Statistiques", icon: IconChart, path: "/stats" },
];

/* ── Layout Component ──────────────────────────────────────────── */
export default function AdminLayout({ children }) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopCollapsed, { toggle: toggleDesktop }] = useDisclosure();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const location = useLocation();
  const navigate = useNavigate();

  const navbarWidth = desktopCollapsed ? 80 : 260;

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: navbarWidth,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened },
      }}
      padding="md"
      transitionDuration={300}
      transitionTimingFunction="ease"
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <AppShell.Header
        style={{
          borderBottom: "1px solid var(--mantine-color-default-border)",
          backdropFilter: "blur(12px)",
          backgroundColor:
            colorScheme === "dark"
              ? "rgba(26, 27, 30, 0.85)"
              : "rgba(255, 255, 255, 0.85)",
        }}
      >
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <Text
              size="xl"
              fw={800}
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan", deg: 45 }}
              style={{ cursor: "pointer", letterSpacing: "-0.5px" }}
              onClick={() => navigate("/")}
            >
              SESA
            </Text>
            <Text size="xs" c="dimmed" visibleFrom="sm">
              Sekoly Sabata
            </Text>
          </Group>

          <Group>
            <Tooltip label={colorScheme === "dark" ? "Mode clair" : "Mode sombre"}>
              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={toggleColorScheme}
                aria-label="Changer le thème"
              >
                {colorScheme === "dark" ? <IconSun /> : <IconMoon />}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </AppShell.Header>

      {/* ── Navbar / Sidebar ────────────────────────────────── */}
      <AppShell.Navbar
        p="md"
        style={{
          borderRight: "1px solid var(--mantine-color-default-border)",
          transition: "width 300ms ease",
        }}
      >
        <AppShell.Section grow component={ScrollArea} scrollbarSize={4}>
          <Box style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV_ITEMS.map((item) => (
              <MantineNavLink
                key={item.path}
                component={NavLink}
                to={item.path}
                label={desktopCollapsed ? undefined : item.label}
                leftSection={<item.icon />}
                active={location.pathname === item.path}
                style={{
                  borderRadius: "var(--mantine-radius-md)",
                  justifyContent: desktopCollapsed ? "center" : undefined,
                }}
                styles={{
                  root: {
                    padding: desktopCollapsed ? "12px" : undefined,
                  },
                  section: {
                    marginRight: desktopCollapsed ? 0 : undefined,
                  },
                }}
              />
            ))}
          </Box>
        </AppShell.Section>

        {/* Collapse toggle — desktop only */}
        <AppShell.Section visibleFrom="sm">
          <Box
            style={{
              borderTop: "1px solid var(--mantine-color-default-border)",
              paddingTop: 12,
              display: "flex",
              justifyContent: desktopCollapsed ? "center" : "flex-end",
            }}
          >
            <Tooltip
              label={desktopCollapsed ? "Ouvrir le menu" : "Réduire le menu"}
              position="right"
            >
              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={toggleDesktop}
                aria-label="Toggle sidebar"
              >
                {desktopCollapsed ? <IconChevronRight /> : <IconChevronLeft />}
              </ActionIcon>
            </Tooltip>
          </Box>
        </AppShell.Section>
      </AppShell.Navbar>

      {/* ── Main content ────────────────────────────────────── */}
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
