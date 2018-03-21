export const statusCodes = new Map([
  [0, null],
  [1, { status: 'engaged', label: 'contact', progressValue: 75}],
  [2, { status: 'invited', label: 'resend', progressValue: 25}],
  [3, { status: 'new', label: 'invite', progressValue: 0}]
]);
