import React from 'react';
import { RequirementTemplateState } from '../types';
import { describeTemplateRevision } from '../domain/requirements';

interface RequirementsViewProps {
  state: RequirementTemplateState;
  onUpdate: (state: RequirementTemplateState) => void;
}

export const RequirementsView: React.FC<RequirementsViewProps> = ({ state, onUpdate }) => {
  const markReviewed = () => {
    onUpdate({ ...state, unsavedChanges: false, lastReviewedRevision: state.lastReviewedRevision + 1 });
  };

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Requirements</h2>
        <p style={{ color: '#475569' }}>Requirement templates are first-class: navigate here directly from the global navigation.</p>
        {state.unsavedChanges ? (
          <div className="notice">
            Unsaved template edits are staged. “Save & mark reviewed” will capture the current thresholds and acknowledge the
            review, rather than silently discarding changes.
          </div>
        ) : null}
        <ul>
          {state.templates.map((template) => (
            <li key={template.id} style={{ marginBottom: 8 }}>
              <strong>{template.name}</strong> – {template.description} <span className="badge">{describeTemplateRevision(template)}</span>
            </li>
          ))}
        </ul>
        <button onClick={markReviewed} className="active">
          Save &amp; mark reviewed
        </button>
      </div>
    </div>
  );
};

export default RequirementsView;
