/** Shared between the keyboard and the character's hands: which key was hit last, and when. */
export const typing = {
  /** keyboard-local x of the last key pressed, -0.13..0.13 */
  x: 0,
  /** keyboard-local z of the last key pressed */
  z: 0,
  /** clock time of the last press */
  at: -10,
  active: false,
};
