export const PROJECT_STATUS_LABELS = {
  requirements_received: 'Requirements Received',
  planning: 'Planning Phase',
  in_progress: 'In Progress',
  under_review: 'Under Review',
  completed: 'Completed',
};

export const PROJECT_STATUS_ORDER = [
  'requirements_received',
  'planning',
  'in_progress',
  'under_review',
  'completed',
];

export function buildTrackingSteps(tracking) {
  if (tracking?.steps?.length) {
    return tracking.steps;
  }
  const current = tracking?.projectStatus || 'requirements_received';
  const currentIndex = PROJECT_STATUS_ORDER.indexOf(current);
  return PROJECT_STATUS_ORDER.map((id, index) => ({
    id,
    label: PROJECT_STATUS_LABELS[id],
    complete: index <= currentIndex,
    current: id === current,
  }));
}
