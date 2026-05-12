/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function cn(...inputs: any[]) {
  // Simple cn implementation if tailwind-merge/clsx not working as expected
  return inputs.filter(Boolean).join(' ');
}
