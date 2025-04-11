/**
 * Timer.jsx
 * ----------------------------------------------
 * Component for managing and displaying a workout timer.
 * Includes:
 *  - Exercise/rest countdown logic
 *  - Start/Pause/Reset controls
 *  - Shake-to-skip using device motion
 * 
 * Author: Dario Santiago Lopez and ChatGPT 
 * Course: CSC 332 - Mobile & Pervasive Computing
 * Partner: Anthony Roca
 * ----------------------------------------------
 */

import React, { useEffect, useState, useRef } from 'react';
import ShakeHandler from '../components/ShakeHandler';

// 🔁 Temporary mock workout data — will be replaced by dynamic input later
const mockWorkout = [
  { name: 'Jumping Jacks', work: 30, rest: 15 },
  { name: 'Push-Ups', work: 30, rest: 15 },
  { name: 'Squats', work: 30, rest: 15 },
];

const Timer = () => {
  // 🧠 State variables
  const [currentIndex, setCurrentIndex] = useState(0);      // Tracks current exercise index
  const [isWorking, setIsWorking] = useState(true);         // Whether user is working or resting
  const [timeLeft, setTimeLeft] = useState(mockWorkout[0].work); // Time left for current interval
  const [isRunning, setIsRunning] = useState(false);        // Timer is running or paused
  const [hasStarted, setHasStarted] = useState(false);      // Tracks if user has started workout

  const timerRef = useRef(null); // Used to store interval reference

  const currentExercise = mockWorkout[currentIndex];
  const nextExercise = mockWorkout[currentIndex + 1];

  // ⏳ Handle countdown logic — runs every second if timer is active
  useEffect(() => {
    if (!isRunning || currentIndex >= mockWorkout.length) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isRunning, currentIndex, isWorking]);

  // 🔁 Handle switching between work/rest and progressing to next exercise
  useEffect(() => {
    if (timeLeft > 0 || !isRunning) return;

    clearInterval(timerRef.current);

    if (isWorking) {
      // Transition from work → rest
      setIsWorking(false);
      setTimeLeft(currentExercise.rest);
    } else {
      // Move to next exercise or end workout
      const nextIdx = currentIndex + 1;
      if (nextIdx < mockWorkout.length) {
        setCurrentIndex(nextIdx);
        setIsWorking(true);
        setTimeLeft(mockWorkout[nextIdx].work);
      } else {
        setIsRunning(false);
        alert('Workout Complete!');
      }
    }
  }, [timeLeft, isRunning]);

  // ▶️ Start the workout
  const handleStart = () => {
    setHasStarted(true);
    setIsRunning(true);
  };

  // ⏸ Toggle pause/resume
  const handlePauseResume = () => {
    setIsRunning((prev) => !prev);
  };

  // 🔁 Reset workout to beginning
  const handleReset = () => {
    clearInterval(timerRef.current);
    setCurrentIndex(0);
    setIsWorking(true);
    setTimeLeft(mockWorkout[0].work);
    setIsRunning(false);
    setHasStarted(false);
  };

  // 🤳 Skip current section using shake gesture
  const handleShake = () => {
    if (!isRunning) return;
    console.log('Shake detected — skipping!');
    clearInterval(timerRef.current);
    setTimeLeft(0); // Triggers transition in next useEffect
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'monospace' }}>
      <h1>Workout Timer</h1>

      {hasStarted ? (
        <>
          {currentIndex < mockWorkout.length ? (
            <>
              <h2>{isWorking ? '🏋️ Work' : '😌 Rest'}</h2>
              <h3>{currentExercise.name}</h3>

              <div style={{ fontSize: '4rem', margin: '1rem 0' }}>{timeLeft}s</div>

              {nextExercise && (
                <p>🔜 Next: {nextExercise.name}</p>
              )}

              <button onClick={handlePauseResume} style={{ margin: '0.5rem' }}>
                {isRunning ? '⏸ Pause' : '▶️ Resume'}
              </button>
              <button onClick={handleReset} style={{ margin: '0.5rem' }}>
                🔁 Reset
              </button>
            </>
          ) : (
            <h2>🎉 Done! Great job!</h2>
          )}
        </>
      ) : (
        <button onClick={handleStart} style={{ fontSize: '1.5rem' }}>Start Workout</button>
      )}

      {/* Shake detector component */}
      <ShakeHandler onShake={handleShake} />
    </div>
  );
};

export default Timer;
