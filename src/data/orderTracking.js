export const PROJECT_STATUS_LABELS = {
  requirements_received: 'Requirements Received',
  planning: 'Planning Phase',
  in_progress: 'In Progress',
  under_review: 'Under Review',
  completed: 'Completed',
};

export const AWAITING_PAYMENT_LABEL = 'Awaiting payment confirmation';

export const PROJECT_STATUS_ORDER = [
  'requirements_received',
  'planning',
  'in_progress',
  'under_review',
  'completed',
];

export function buildCustomerTrackingSteps({
  paymentGateway,
  paymentStatus,
  projectStatus,
  steps: prebuiltSteps,
}) {
  if (prebuiltSteps?.length) {
    return prebuiltSteps;
  }

  const normalizedStatus = PROJECT_STATUS_ORDER.includes(projectStatus)
    ? projectStatus
    : 'requirements_received';
  const projectIndex = PROJECT_STATUS_ORDER.indexOf(normalizedStatus);
  const isBankTransfer = paymentGateway === 'bank_transfer';
  const isPaid = paymentStatus === 'paid';
  const isBankAwaiting = isBankTransfer && !isPaid;
  const steps = [];

  if (isBankTransfer) {
    steps.push({
      id: 'awaiting_payment_confirmation',
      label: AWAITING_PAYMENT_LABEL,
      complete: isPaid,
      current: isBankAwaiting,
    });
  }

  PROJECT_STATUS_ORDER.forEach((id, index) => {
    steps.push({
      id,
      label: PROJECT_STATUS_LABELS[id],
      complete: !isBankAwaiting && index <= projectIndex,
      current: !isBankAwaiting && id === normalizedStatus,
    });
  });

  return steps;
}

export function buildTrackingSteps(tracking, options = {}) {
  return buildCustomerTrackingSteps({
    paymentGateway: options.paymentGateway || tracking?.paymentGateway,
    paymentStatus: options.paymentStatus ?? tracking?.paymentStatus,
    projectStatus: tracking?.projectStatus,
    steps: tracking?.steps,
  });
}

export function resolveCurrentTrackingLabel(tracking, options = {}) {
  const steps = buildTrackingSteps(tracking, options);
  return steps.find((step) => step.current)?.label || tracking?.projectStatusLabel || null;
}
