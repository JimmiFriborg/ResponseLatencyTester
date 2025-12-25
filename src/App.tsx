import React, { useEffect, useMemo, useState } from 'react';
import Navigation from './components/Navigation';
import ExecutionView from './views/ExecutionView';
import DeviceView from './views/DeviceView';
import ComparisonView from './views/ComparisonView';
import TraceabilityView from './views/TraceabilityView';
import RequirementsView from './views/RequirementsView';
import ReportView from './views/ReportView';
import DefectsView from './views/DefectsView';
import { useHashRoute } from './routing/useHashRoute';
import { createVersionedStorage } from './domain/storage';
import { deriveModuleLatencies } from './domain/latencyCalculations';
import { ExecutionSession, RequirementTemplateState, ComparisonState } from './types';
import { DeviceProfile } from './domain/deviceNormalization';
import { RequirementTemplate } from './domain/requirements';

const seedMarkers = [
  { name: 'Metadata', color: 'Yellow', comment: 'Primary module', timestampMs: 0 },
  { name: 'TagOff', timestampMs: 10 },
  { name: 'MotionStart', timestampMs: 42 },
  { name: 'Metadata', color: 'Yellow', comment: 'Secondary module', timestampMs: 50 },
  { name: 'TagOff', timestampMs: 60 },
  { name: 'MotionStart', timestampMs: 95 }
];

const buildSeedSession = (
  id: string,
  name: string,
  source: ExecutionSession['datasetSource'],
  deviceProfileId: string
): ExecutionSession => ({
  testCaseId: id,
  executionId: `${id}-run`,
  name,
  deviceProfileId,
  latencies: deriveModuleLatencies(seedMarkers),
  datasetSource: source,
  fps: 60
});

const initialSessions: ExecutionSession[] = [
  buildSeedSession('case-1', 'Baseline Execution', 'manual-entry', 'rig-a'),
  buildSeedSession('case-2', 'Candidate Execution', 'manual-import', 'rig-b')
];

const deviceLibrary: DeviceProfile[] = [
  { id: 'rig-a', name: 'Rig A', tagType: 'Tag V2', firmware: '1.4.0', accessories: ['Grip'], notes: 'Primary capture rig' },
  { id: 'rig-b', name: 'Rig B', tagType: 'Tag V1', firmware: '1.2.1', accessories: ['Strap'], notes: 'Secondary validation rig' }
];

const templates: RequirementTemplate[] = [
  {
    id: 'template-1',
    name: 'Standard Latency Thresholds',
    description: 'Baseline latency templates for common modules under test.',
    thresholds: [
      { axis: 'Primary module', maxMs: 45, label: 'Primary path' },
      { axis: 'Secondary module', maxMs: 50, label: 'Fallback path' }
    ],
    revision: 3
  }
];

const comparisonStore = createVersionedStorage<ComparisonState>({
  key: 'latencyTesterComparisonQueue',
  version: 3,
  migrations: {
    2: (data: any) => {
      if (Array.isArray(data)) {
        return { queue: data, mode: 'full', diffData: null } as ComparisonState;
      }
      return data;
    },
    3: (data: any) => {
      const migrateSessionSummary = (summary?: any) =>
        summary
          ? {
              ...summary,
              deviceSummary: summary.deviceSummary ?? summary.hardwareSummary ?? null
            }
          : summary;

      const migrateModule = (row: any) =>
        row
          ? {
              ...row,
              deviceDiff: row.deviceDiff ?? row.hardwareDiff ?? null
            }
          : row;

      const migratedDiff = data?.diffData
        ? {
            ...data.diffData,
            baseline: migrateSessionSummary(data.diffData.baseline),
            candidate: migrateSessionSummary(data.diffData.candidate),
            modules: Array.isArray(data.diffData.modules) ? data.diffData.modules.map(migrateModule) : [],
            deviceDiffers: data.diffData.deviceDiffers ?? data.diffData.hardwareDiffers ?? false
          }
        : null;

      const moduleMap = (migratedDiff?.modules || []).reduce<Record<string, any>>((acc, row: any) => {
        acc[row.moduleKey] = row;
        return acc;
      }, {});

      return {
        ...data,
        diffData: migratedDiff ? { ...migratedDiff, moduleMap } : migratedDiff
      } as ComparisonState;
    }
  }
});

const DEFECT_REGISTER_PATH = 'release-candidates/v3.9-rc5-defects.json';

export const App: React.FC = () => {
  const [view, setView] = useHashRoute();
  const [sessions, setSessions] = useState<ExecutionSession[]>(initialSessions);
  const [requirements, setRequirements] = useState<RequirementTemplateState>({
    templates,
    unsavedChanges: true,
    lastReviewedRevision: 0
  });
  const [comparison, setComparison] = useState<ComparisonState>(() =>
    comparisonStore.read({ queue: initialSessions.map((session) => `${session.testCaseId}::${session.executionId}`), mode: 'full', diffData: null })
  );

  useEffect(() => {
    comparisonStore.write(comparison);
  }, [comparison]);

  const addSession = (session: ExecutionSession) => setSessions((prev) => [...prev, session]);
  const replaceSessions = (payload: ExecutionSession[]) => setSessions(payload);

  const renderView = useMemo(() => {
    switch (view) {
      case 'execution':
        return <ExecutionView sessions={sessions} onAddSession={addSession} onReplaceSessions={replaceSessions} />;
      case 'devices':
        return <DeviceView profiles={deviceLibrary} />;
      case 'comparison':
        return (
          <ComparisonView
            sessions={sessions}
            queue={comparison.queue}
            mode={comparison.mode}
            onUpdateQueue={(queue) => setComparison({ ...comparison, queue })}
            onUpdateMode={(mode) => setComparison({ ...comparison, mode })}
          />
        );
      case 'traceability':
        return <TraceabilityView sessions={sessions} profiles={deviceLibrary} />;
      case 'requirements':
        return <RequirementsView state={requirements} onUpdate={setRequirements} />;
      case 'report':
        return <ReportView sessions={sessions} />;
      case 'defects':
        return <DefectsView canonicalPath={DEFECT_REGISTER_PATH} />;
      default:
        return null;
    }
  }, [view, sessions, comparison, requirements]);

  return (
    <div className="app-shell">
      <header style={{ marginBottom: 12 }}>
        <h1 style={{ marginBottom: 4 }}>Device Latency Tester v4.0</h1>
        <p style={{ margin: 0, color: '#475569' }}>
          Source lives in React + TypeScript, bundled into a single portable latency-tester.html. Hash-based navigation keeps
          views addressable (#execution, #devices for the device library, #report, etc.). Legacy #hardware hashes automatically
          redirect to #devices for compatibility.
        </p>
      </header>
      <Navigation active={view} onNavigate={setView} comparisonMode={comparison.mode} />
      {renderView}
    </div>
  );
};

export default App;
