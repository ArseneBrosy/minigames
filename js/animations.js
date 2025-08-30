/**
 * Animate a value linearly
 * @param start start value
 * @param end end value
 * @param duration duration of the animation
 * @param onUpdate called to update the value
 * @param onComplete called at the end
 */
function animateValue(start, end, duration, onUpdate, onComplete) {
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // linear interpolation
    const value = start + (end - start) * progress;
    onUpdate(value);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      onUpdate(end);
      if (onComplete) {
        onComplete();
      }
    }
  }

  requestAnimationFrame(step);
}

/**
 * Animate a value linearly from A to B to A
 * @param start start and end value
 * @param middle middle value
 * @param durationForward duration of the animation from A to B
 * @param durationBackward duration of the animation from B to A
 * @param onUpdate called to update the value
 * @param onComplete called at the end
 */
function animateValueBackAndForth(start, middle, durationForward, durationBackward, onUpdate, onComplete) {
  animateValue(start, middle, durationForward, onUpdate, () => {
    animateValue(middle, start, durationBackward, onUpdate, onComplete);
  });
}

export { animateValue, animateValueBackAndForth };