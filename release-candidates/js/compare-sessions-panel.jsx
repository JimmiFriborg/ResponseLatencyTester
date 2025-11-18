const CompareSessionsSummary = ({
    sessionDiffData,
    sessionDiffState,
    copyDiffStatus,
    onOpenModal,
    onCopyDiff,
    describeDatasetSource,
    diffAnnotations,
    onAnnotateAxis,
    formatStat,
    formatDeltaMs,
    getDeltaBadgeClasses,
    Icon
}) => {
    const showSummary = sessionDiffState?.status === 'ready' && !!sessionDiffData;
    const statusMessage = sessionDiffState?.message || '';
    const statusTone = sessionDiffState?.status === 'error'
        ? 'text-red-600'
        : 'text-gray-600';
    const canCopy = showSummary;

    return (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold">Compare Sessions</h2>
                    <p className="text-sm text-gray-500">Pick baseline vs. candidate datasets (manual imports or automation reports) to calculate per-axis deltas.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={onOpenModal}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                        {Icon ? <Icon name="link" /> : null} Choose Sessions
                    </button>
                    <button
                        onClick={onCopyDiff}
                        disabled={!canCopy}
                        className={`px-3 py-1.5 text-sm rounded ${canCopy ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                    >
                        {Icon ? <Icon name="copy" /> : null} Copy Diff Output
                    </button>
                </div>
            </div>
            {copyDiffStatus && (
                <p className="text-xs text-green-600">{copyDiffStatus}</p>
            )}
            {!showSummary && statusMessage && (
                <p className={`text-sm ${statusTone}`}>{statusMessage}</p>
            )}
            {showSummary ? (
                <>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-3 bg-gray-50">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase">Baseline</h4>
                            <p className="font-medium">{sessionDiffData.baseline.testCaseName} · {sessionDiffData.baseline.executionName}</p>
                            <p className="text-xs text-gray-600">{describeDatasetSource(sessionDiffData.baseline.datasetSource)}</p>
                            <p className="text-xs text-gray-600">FPS: {sessionDiffData.baseline.fps ?? '—'}</p>
                            <p className="text-xs text-gray-600">Hardware: {sessionDiffData.baseline.hardwareSummary}</p>
                        </div>
                        <div className="border rounded-lg p-3 bg-gray-50">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase">Candidate</h4>
                            <p className="font-medium">{sessionDiffData.candidate.testCaseName} · {sessionDiffData.candidate.executionName}</p>
                            <p className="text-xs text-gray-600">{describeDatasetSource(sessionDiffData.candidate.datasetSource)}</p>
                            <p className="text-xs text-gray-600">FPS: {sessionDiffData.candidate.fps ?? '—'}</p>
                            <p className="text-xs text-gray-600">Hardware: {sessionDiffData.candidate.hardwareSummary}</p>
                        </div>
                    </div>
                    {sessionDiffData.fpsDelta != null && (
                        <p className="text-xs text-gray-600">Overall FPS Δ: <span className={`px-2 py-0.5 rounded-full font-semibold ${getDeltaBadgeClasses(sessionDiffData.fpsDelta)}`}>{formatDeltaMs(sessionDiffData.fpsDelta, ' fps')}</span></p>
                    )}
                    {sessionDiffData.hardwareDiffers && (
                        <p className="text-xs text-amber-700">Hardware notes differ between the selected sessions.</p>
                    )}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left">Axis</th>
                                    <th className="px-4 py-2 text-right">Baseline</th>
                                    <th className="px-4 py-2 text-right">Candidate</th>
                                    <th className="px-4 py-2 text-right">Delta</th>
                                    <th className="px-4 py-2 text-left">Annotations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessionDiffData.axes.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-4 text-center text-gray-500">No axis data available for the selected sessions.</td>
                                    </tr>
                                ) : (
                                    sessionDiffData.axes.map(row => (
                                        <tr key={row.axisKey} className="border-b">
                                            <td className="px-4 py-2 font-semibold">{row.axisKey}</td>
                                            <td className="px-4 py-2 text-right">
                                                <div className="text-xs text-gray-600">
                                                    <div>Min: {formatStat(row.baselineStats, 'min')}</div>
                                                    <div>Avg: {formatStat(row.baselineStats, 'avg')}</div>
                                                    <div>Max: {formatStat(row.baselineStats, 'max')}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                <div className="text-xs text-gray-600">
                                                    <div>Min: {formatStat(row.candidateStats, 'min')}</div>
                                                    <div>Avg: {formatStat(row.candidateStats, 'avg')}</div>
                                                    <div>Max: {formatStat(row.candidateStats, 'max')}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                <div className="text-xs text-gray-600">
                                                    <div>Δ Min {formatDeltaMs(row.delta.min)}</div>
                                                    <div>Δ Avg {formatDeltaMs(row.delta.avg)}</div>
                                                    <div>Δ Max {formatDeltaMs(row.delta.max)}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">
                                                <button
                                                    onClick={() => onAnnotateAxis(row.axisKey)}
                                                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                                                >
                                                    {Icon ? <Icon name="pin" /> : null} {diffAnnotations[row.axisKey] ? 'Edit note' : 'Add note'}
                                                </button>
                                                {diffAnnotations[row.axisKey] && (
                                                    <p className="text-amber-700 italic">{diffAnnotations[row.axisKey]}</p>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : null}
        </div>
    );
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CompareSessionsSummary;
}
if (typeof window !== 'undefined') {
    window.CompareSessionsSummary = CompareSessionsSummary;
}
