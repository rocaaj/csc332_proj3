/**
 * Dashboard.jsx
 * ----------------------------------------------
 * Displays previously saved workouts from MongoDB.
 * Users can view and delete their workout templates.
 * 
 * Author: Dario Santiago Lopez
 * Course: CSC 332 - Mobile & Pervasive Computing
 * Partner: Anthony Roca
 * Date: April 11, 2025
 * ----------------------------------------------
 */

import React, { useEffect, useState } from 'react';
import { getWorkouts, deleteWorkout } from '../utils/api';

const Dashboard = () => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    // Fetch all saved workouts on load
    const fetchData = async () => {
      const data = await getWorkouts();
      setWorkouts(data);
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    await deleteWorkout(id);
    setWorkouts((prev) => prev.filter((w) => w._id !== id));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>📋 Saved Workouts</h2>

      {workouts.length === 0 ? (
        <p>No workouts found.</p>
      ) : (
        workouts.map((workout) => (
          <div key={workout._id} style={{ border: '1px solid #ccc', margin: '1rem 0', padding: '1rem', borderRadius: '8px' }}>
            <h3>{workout.name}</h3>
            <ul>
              {workout.exercises.map((ex, i) => (
                <li key={i}>{ex.name} — Work: {ex.work}s / Rest: {ex.rest}s</li>
              ))}
            </ul>
            <button onClick={() => handleDelete(workout._id)}>🗑 Delete</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
