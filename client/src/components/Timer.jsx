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
 * Date: April 11, 2025
 * ----------------------------------------------
 */

import React, { useEffect, useState, useRef } from 'react';
import ShakeHandler from '../components/ShakeHandler';
import WorkoutForm from '../components/WorkoutForm'; 

const Timer = () => {
  // State variables
  const [workout, setWorkout] = useState(null);             // Holds the workout data 
  const [currentIndex, setCurrentIndex] = useState(0);      // Tracks current exercise index
  const [isWorking, setIsWorking] = useState(true);         // Whether user is working or resting
  const [timeLeft, setTimeLeft] = useState(0);              // Time left for current interval
  const [isRunning, setIsRunning] = useState(false);        // Timer is running or paused
  const [hasStarted, setHasStarted] = useState(false);      // Tracks if user has started workout

  const timerRef = useRef(null); // Used to store interval reference

  const currentExercise = workout?.[currentIndex];
  const nextExercise = workout?.[currentIndex + 1];

  // Starts countdown on actice timer 
  useEffect(() => {
    if (!isRunning || !workout || currentIndex >= workout.length) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isRunning, currentIndex, isWorking, workout]);

 // Transition logic for work → rest → next exercise
 useEffect(() => {
    if (timeLeft > 0 || !isRunning || !workout) return;

    clearInterval(timerRef.current);

    if (isWorking) {
      setIsWorking(false);
      setTimeLeft(currentExercise.rest);
    } else {
      const nextIdx = currentIndex + 1;
      if (nextIdx < workout.length) {
        setCurrentIndex(nextIdx);
        setIsWorking(true);
        setTimeLeft(workout[nextIdx].work);
      } else {
        setIsRunning(false);
        alert('Workout Complete!');
      }
    }
  }, [timeLeft]);

  // Handle workout submission from WorkoutForm
  const handleWorkoutSubmit = (exercises) => {
    setWorkout(exercises);
    setCurrentIndex(0);
    setIsWorking(true);
    setTimeLeft(exercises[0].work);
    setHasStarted(false);
  };

  // Start the workout
  const handleStart = () => {
    setHasStarted(true);
    setIsRunning(true);
  };

  // Toggle pause/resume
  const handlePauseResume = () => {
    setIsRunning((prev) => !prev);
  };

  // Reset workout to beginning
  const handleReset = () => {
    clearInterval(timerRef.current);
    if (workout?.length) {
      setCurrentIndex(0);
      setIsWorking(true);
      setTimeLeft(workout[0].work);
    }
    setIsRunning(false);
    setHasStarted(false);
  };

  // Skip current section using shake gesture
  const handleShake = () => {
    if (!isRunning) return;
    console.log('Shake detected — skipping!');
    clearInterval(timerRef.current);
    setTimeLeft(0); // Triggers transition logic
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'monospace' }}>
      <h1>Workout Timer</h1>

      {!workout ? (
        <WorkoutForm onSubmit={handleWorkoutSubmit} />
      ) : !hasStarted ? (
        <>
          <h2>Ready to go!</h2>
          <button onClick={handleStart} style={{ fontSize: '1.5rem' }}>
            ▶️ Start Workout
          </button>
        </>
      ) : currentIndex < workout.length ? (
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

      <ShakeHandler onShake={handleShake} />
    </div>
  );
};

export default Timer;
