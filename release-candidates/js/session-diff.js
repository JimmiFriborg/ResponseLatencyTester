(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.LatencySessionDiff = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    const DEFAULT_AXIS_KEYS = ['X+', 'X-', 'Y+', 'Y-', 'Z+', 'Z-'];
    const DEFAULT_AXES = ['X', 'Y', 'Z'];

    const encodeExecutionKey = (testCaseId, executionId) => {
        if (!testCaseId || !executionId) return '';
        return `${testCaseId}::${executionId}`;
    };

    const decodeExecutionKey = (value) => {
        if (!value || typeof value !== 'string') {
            return null;
        }
        const [testCaseId, executionId] = value.split('::');
        if (!testCaseId || !executionId) {
            return null;
        }
        return { testCaseId, executionId };
    };

    const computeSessionDiffData = ({
        baseline,
        candidate,
        axisKeys = DEFAULT_AXIS_KEYS,
        axes = DEFAULT_AXES
    }) => {
        if (!baseline || !candidate) {
            return null;
        }
        const uniqueAxisKeys = Array.from(new Set(axisKeys)).sort((a, b) => a.localeCompare(b));
        const axesRows = uniqueAxisKeys.map(axisKey => {
            const baselineStats = (baseline.axisStats || {})[axisKey] || null;
            const candidateStats = (candidate.axisStats || {})[axisKey] || null;
            const safeMetric = (stats, metric) => {
                if (!stats || stats.total === 0) {
                    return null;
                }
                return stats[metric];
            };
            const delta = {
                min: safeMetric(candidateStats, 'min') != null && safeMetric(baselineStats, 'min') != null
                    ? safeMetric(candidateStats, 'min') - safeMetric(baselineStats, 'min')
                    : null,
                avg: safeMetric(candidateStats, 'avg') != null && safeMetric(baselineStats, 'avg') != null
                    ? safeMetric(candidateStats, 'avg') - safeMetric(baselineStats, 'avg')
                    : null,
                max: safeMetric(candidateStats, 'max') != null && safeMetric(baselineStats, 'max') != null
                    ? safeMetric(candidateStats, 'max') - safeMetric(baselineStats, 'max')
                    : null
            };
            const fpsDelta = baseline.fps != null && candidate.fps != null
                ? candidate.fps - baseline.fps
                : null;
            const hardwareDiffers = baseline.hardwareSummary !== candidate.hardwareSummary;
            return {
                axisKey,
                baselineStats,
                candidateStats,
                delta,
                fpsDelta,
                hardwareDiff: hardwareDiffers ? {
                    baseline: baseline.hardwareSummary,
                    candidate: candidate.hardwareSummary
                } : null
            };
        });
        const axisMap = axesRows.reduce((acc, row) => {
            acc[row.axisKey] = row;
            return acc;
        }, {});
        const axisAggregate = axes.reduce((acc, axis) => {
            const plusKey = `${axis}+`;
            const minusKey = `${axis}-`;
            if (axisMap[plusKey] || axisMap[minusKey]) {
                acc[axis] = {
                    plus: axisMap[plusKey] || null,
                    minus: axisMap[minusKey] || null
                };
            }
            return acc;
        }, {});
        return {
            baseline,
            candidate,
            axes: axesRows,
            axisMap,
            axisAggregate,
            fpsDelta: baseline.fps != null && candidate.fps != null
                ? candidate.fps - baseline.fps
                : null,
            hardwareDiffers: baseline.hardwareSummary !== candidate.hardwareSummary
        };
    };

    const deriveSessionDiffStatus = ({
        selection,
        diffData,
        baselineAvailable,
        candidateAvailable,
        hasExecutions
    }) => {
        if (!selection || !selection.baseline || !selection.candidate) {
            return {
                status: 'idle',
                message: 'Select a baseline and candidate dataset to calculate differences.'
            };
        }
        if (!hasExecutions) {
            return {
                status: 'loading',
                message: 'Loading session data…'
            };
        }
        if (!baselineAvailable && !candidateAvailable) {
            return {
                status: 'error',
                message: 'Selected sessions are no longer available. Choose a new baseline and candidate.'
            };
        }
        if (!baselineAvailable) {
            return {
                status: 'error',
                message: 'The baseline session is no longer available. Pick another dataset.'
            };
        }
        if (!candidateAvailable) {
            return {
                status: 'error',
                message: 'The candidate session is no longer available. Pick another dataset.'
            };
        }
        if (!diffData) {
            return {
                status: 'loading',
                message: 'Calculating session deltas…'
            };
        }
        if (Array.isArray(diffData.axes) && diffData.axes.length === 0) {
            return {
                status: 'error',
                message: 'No comparable axis measurements were detected between the selected sessions.'
            };
        }
        return {
            status: 'ready',
            message: ''
        };
    };

    return {
        DEFAULT_AXIS_KEYS,
        DEFAULT_AXES,
        encodeExecutionKey,
        decodeExecutionKey,
        computeSessionDiffData,
        deriveSessionDiffStatus
    };
}));
