/**
 * One-shot generator for system template variation redesign SQL.
 * Run: node scripts/generate-template-variation-redesign.mjs
 *
 * Exercise names must match cloud catalog exactly (case-sensitive resolve).
 * Counts intentionally vary by program — no fixed 6-exercise rule.
 */

import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @typedef {{ name: string, sets: number, reps: number|null, rest: number, notes?: string|null }} Ex */
/** @typedef {{ description: string, exercises: Ex[] }} LevelProgram */

/** @type {Record<string, { beginner: LevelProgram, intermediate: LevelProgram, advanced: LevelProgram }>} */
const PROGRAMS = {
  'Push Day': {
    beginner: {
      description: 'Machine and bodyweight pressing to learn the push pattern.',
      exercises: [
        { name: 'Chest Press Machine', sets: 3, reps: 12, rest: 90, notes: 'Control the path' },
        { name: 'Incline Push Up', sets: 3, reps: 10, rest: 75, notes: 'Hands elevated OK' },
        { name: 'Machine Shoulder Press', sets: 2, reps: 10, rest: 75 },
        { name: 'Triceps Pushdown', sets: 2, reps: 12, rest: 60 },
      ],
    },
    intermediate: {
      description: 'Classic push: chest, shoulders, triceps with free weights.',
      exercises: [
        { name: 'Barbell Bench Press', sets: 4, reps: 8, rest: 120 },
        { name: 'Incline Dumbbell Bench Press', sets: 3, reps: 10, rest: 90 },
        { name: 'Seated Dumbbell Shoulder Press', sets: 3, reps: 10, rest: 90 },
        { name: 'Lateral Raise', sets: 3, reps: 12, rest: 60 },
        { name: 'Triceps Pushdown', sets: 3, reps: 12, rest: 60 },
      ],
    },
    advanced: {
      description: 'Heavy press focus plus dips and cable isolation finishers.',
      exercises: [
        { name: 'Barbell Bench Press', sets: 5, reps: 5, rest: 150, notes: 'Top sets heavy' },
        { name: 'Incline Barbell Bench Press', sets: 3, reps: 8, rest: 120 },
        { name: 'Chest Dip', sets: 3, reps: 8, rest: 90, notes: 'Add load if able' },
        { name: 'Overhead Press', sets: 3, reps: 8, rest: 90 },
        { name: 'Cable Lateral Raise', sets: 3, reps: 15, rest: 45 },
        { name: 'Pec Deck Fly', sets: 3, reps: 12, rest: 45, notes: 'Superset with next' },
        { name: 'Rope Pushdown', sets: 3, reps: 12, rest: 45 },
      ],
    },
  },
  'Push Hypertrophy': {
    beginner: {
      description: 'Simple chest-led pump with stable machines.',
      exercises: [
        { name: 'Chest Press Machine', sets: 3, reps: 12, rest: 90 },
        { name: 'Incline Dumbbell Bench Press', sets: 3, reps: 10, rest: 75 },
        { name: 'Pec Deck Fly', sets: 2, reps: 12, rest: 60 },
        { name: 'Triceps Pushdown', sets: 2, reps: 12, rest: 60 },
      ],
    },
    intermediate: {
      description: 'Incline-biased pressing with shoulder and triceps volume.',
      exercises: [
        { name: 'Incline Dumbbell Bench Press', sets: 4, reps: 8, rest: 120 },
        { name: 'Barbell Bench Press', sets: 3, reps: 8, rest: 120 },
        { name: 'Overhead Press', sets: 3, reps: 8, rest: 90 },
        { name: 'Cable Chest Fly', sets: 3, reps: 12, rest: 60 },
        { name: 'Lateral Raise', sets: 3, reps: 12, rest: 60 },
        { name: 'Rope Pushdown', sets: 3, reps: 12, rest: 60 },
      ],
    },
    advanced: {
      description: 'High-stimulus push with multiple angles and isolation.',
      exercises: [
        { name: 'Incline Barbell Bench Press', sets: 4, reps: 6, rest: 150 },
        { name: 'Dumbbell Bench Press', sets: 3, reps: 8, rest: 120 },
        { name: 'Chest Dip', sets: 3, reps: 8, rest: 90 },
        { name: 'Seated Dumbbell Shoulder Press', sets: 3, reps: 8, rest: 90 },
        { name: 'Cable Lateral Raise', sets: 4, reps: 12, rest: 45 },
        { name: 'High to Low Cable Fly', sets: 3, reps: 12, rest: 45 },
        { name: 'Overhead Triceps Extension', sets: 3, reps: 12, rest: 45 },
        { name: 'Rope Pushdown', sets: 2, reps: 15, rest: 30, notes: 'Drop-set friendly' },
      ],
    },
  },
  'Pull Day': {
    beginner: {
      description: 'Vertical and horizontal pulls on machines.',
      exercises: [
        { name: 'Lat Pulldown', sets: 3, reps: 12, rest: 90 },
        { name: 'Machine Row', sets: 3, reps: 12, rest: 75 },
        { name: 'Face Pull', sets: 2, reps: 15, rest: 60 },
        { name: 'Dumbbell Bicep Curl', sets: 2, reps: 12, rest: 60 },
      ],
    },
    intermediate: {
      description: 'Pull-up progressions plus rows and arm flexors.',
      exercises: [
        { name: 'Pull Up', sets: 4, reps: 6, rest: 120, notes: 'Band OK' },
        { name: 'Seated Cable Row', sets: 3, reps: 10, rest: 90 },
        { name: 'Lat Pulldown', sets: 3, reps: 10, rest: 90 },
        { name: 'Face Pull', sets: 3, reps: 12, rest: 60 },
        { name: 'Barbell Curl', sets: 3, reps: 10, rest: 60 },
      ],
    },
    advanced: {
      description: 'Heavy vertical/horizontal pulls with dense arm finishers.',
      exercises: [
        { name: 'Pull Up', sets: 4, reps: 6, rest: 120, notes: 'Weighted if able' },
        { name: 'Bent Over Barbell Row', sets: 4, reps: 6, rest: 120 },
        { name: 'Chest Supported Row', sets: 3, reps: 10, rest: 90 },
        { name: 'Straight Arm Pulldown', sets: 3, reps: 12, rest: 60 },
        { name: 'Face Pull', sets: 3, reps: 15, rest: 45 },
        { name: 'Incline Dumbbell Curl', sets: 3, reps: 10, rest: 45, notes: 'Superset with hammer' },
        { name: 'Hammer Curl', sets: 3, reps: 12, rest: 45 },
      ],
    },
  },
  'Pull Hypertrophy': {
    beginner: {
      description: 'Lat and mid-back pump with cables.',
      exercises: [
        { name: 'Wide Grip Lat Pulldown', sets: 3, reps: 12, rest: 90 },
        { name: 'Seated Cable Row', sets: 3, reps: 12, rest: 75 },
        { name: 'Face Pull', sets: 2, reps: 15, rest: 60 },
        { name: 'Cable Curl', sets: 2, reps: 12, rest: 60 },
      ],
    },
    intermediate: {
      description: 'Thickness focus: pull-ups, supported rows, arms.',
      exercises: [
        { name: 'Pull Up', sets: 4, reps: 6, rest: 120 },
        { name: 'Chest Supported Row', sets: 4, reps: 10, rest: 90 },
        { name: 'Wide Grip Lat Pulldown', sets: 3, reps: 10, rest: 90 },
        { name: 'Face Pull', sets: 3, reps: 12, rest: 60 },
        { name: 'Incline Dumbbell Curl', sets: 3, reps: 10, rest: 60 },
        { name: 'Hammer Curl', sets: 2, reps: 12, rest: 45 },
      ],
    },
    advanced: {
      description: 'Specialized back angles with high-quality arm work.',
      exercises: [
        { name: 'Pull Up', sets: 4, reps: 5, rest: 120 },
        { name: 'T-Bar Row', sets: 4, reps: 8, rest: 90 },
        { name: 'Single Arm Cable Row', sets: 3, reps: 10, rest: 75, notes: 'Each arm' },
        { name: 'Close Grip Lat Pull Down', sets: 3, reps: 10, rest: 75 },
        { name: 'Straight Arm Pulldown', sets: 3, reps: 12, rest: 60 },
        { name: 'Face Pull', sets: 3, reps: 15, rest: 45 },
        { name: 'Bayesian Cable Curl', sets: 3, reps: 12, rest: 45 },
        { name: 'Hammer Curl', sets: 2, reps: 12, rest: 45 },
      ],
    },
  },
  'Full Body': {
    beginner: {
      description: 'Four fundamentals: squat, push, hinge, brace.',
      exercises: [
        { name: 'Goblet Squat', sets: 3, reps: 10, rest: 90 },
        { name: 'Push-Up', sets: 3, reps: 8, rest: 75, notes: 'Kneeling OK' },
        { name: 'One Arm Dumbbell Row', sets: 3, reps: 10, rest: 75, notes: 'Each arm' },
        { name: 'Romanian Deadlift', sets: 2, reps: 10, rest: 90, notes: 'Light–moderate' },
        { name: 'Plank', sets: 2, reps: null, rest: 45, notes: '20–40s' },
      ],
    },
    intermediate: {
      description: 'Barbell compounds covering squat, press, pull, hinge.',
      exercises: [
        { name: 'Back Squat', sets: 4, reps: 8, rest: 120 },
        { name: 'Barbell Bench Press', sets: 3, reps: 8, rest: 120 },
        { name: 'One Arm Dumbbell Row', sets: 3, reps: 10, rest: 90 },
        { name: 'Romanian Deadlift', sets: 3, reps: 8, rest: 120 },
        { name: 'Face Pull', sets: 2, reps: 12, rest: 60 },
        { name: 'Plank', sets: 2, reps: null, rest: 45, notes: '40s' },
      ],
    },
    advanced: {
      description: 'Dense full-body strength — quality compounds, short accessories.',
      exercises: [
        { name: 'Back Squat', sets: 5, reps: 5, rest: 150 },
        { name: 'Barbell Bench Press', sets: 4, reps: 5, rest: 120 },
        { name: 'Conventional Deadlift', sets: 3, reps: 5, rest: 180 },
        { name: 'Pull Up', sets: 3, reps: 6, rest: 90 },
        { name: 'Overhead Press', sets: 3, reps: 6, rest: 90 },
      ],
    },
  },
  'Upper Body': {
    beginner: {
      description: 'Machine upper-body circuit for press and pull balance.',
      exercises: [
        { name: 'Chest Press Machine', sets: 3, reps: 12, rest: 90 },
        { name: 'Lat Pulldown', sets: 3, reps: 12, rest: 90 },
        { name: 'Machine Shoulder Press', sets: 2, reps: 10, rest: 75 },
        { name: 'Machine Row', sets: 2, reps: 12, rest: 75 },
      ],
    },
    intermediate: {
      description: 'Barbell/cable upper day with delt and arm accessories.',
      exercises: [
        { name: 'Barbell Bench Press', sets: 4, reps: 8, rest: 120 },
        { name: 'Lat Pulldown', sets: 3, reps: 10, rest: 90 },
        { name: 'Seated Dumbbell Shoulder Press', sets: 3, reps: 10, rest: 90 },
        { name: 'Seated Cable Row', sets: 3, reps: 10, rest: 90 },
        { name: 'Lateral Raise', sets: 3, reps: 12, rest: 60 },
        { name: 'Triceps Pushdown', sets: 2, reps: 12, rest: 60 },
      ],
    },
    advanced: {
      description: 'Strength-biased upper with curl/press finishers.',
      exercises: [
        { name: 'Barbell Bench Press', sets: 4, reps: 5, rest: 150 },
        { name: 'Pull Up', sets: 4, reps: 6, rest: 120 },
        { name: 'Overhead Press', sets: 3, reps: 6, rest: 120 },
        { name: 'Chest Supported Row', sets: 3, reps: 8, rest: 90 },
        { name: 'Cable Lateral Raise', sets: 3, reps: 15, rest: 45 },
        { name: 'Close Grip Bench Press', sets: 3, reps: 8, rest: 75 },
        { name: 'Incline Dumbbell Curl', sets: 2, reps: 10, rest: 60 },
      ],
    },
  },
  'Lower Body': {
    beginner: {
      description: 'Squat, hinge, and single-leg basics with light loading.',
      exercises: [
        { name: 'Goblet Squat', sets: 3, reps: 12, rest: 90 },
        { name: 'Romanian Deadlift', sets: 3, reps: 10, rest: 90 },
        { name: 'Reverse Lunge', sets: 2, reps: 10, rest: 75, notes: 'Each leg' },
        { name: 'Glute Bridge', sets: 2, reps: 12, rest: 60 },
      ],
    },
    intermediate: {
      description: 'Squat + hinge + split squat with calves.',
      exercises: [
        { name: 'Back Squat', sets: 4, reps: 8, rest: 150 },
        { name: 'Romanian Deadlift', sets: 3, reps: 8, rest: 120 },
        { name: 'Bulgarian Split Squat', sets: 3, reps: 10, rest: 90, notes: 'Each leg' },
        { name: 'Leg Press', sets: 3, reps: 12, rest: 90 },
        { name: 'Standing Calf Raise', sets: 3, reps: 12, rest: 45 },
      ],
    },
    advanced: {
      description: 'Heavy squat/hinge with unilateral and posterior accessories.',
      exercises: [
        { name: 'Back Squat', sets: 5, reps: 5, rest: 180 },
        { name: 'Romanian Deadlift', sets: 4, reps: 6, rest: 150 },
        { name: 'Bulgarian Split Squat', sets: 3, reps: 8, rest: 90 },
        { name: 'Lying Leg Curl', sets: 3, reps: 10, rest: 60 },
        { name: 'Dumbbell Walking Lunge', sets: 2, reps: 12, rest: 75 },
        { name: 'Standing Calf Raise', sets: 4, reps: 10, rest: 45 },
      ],
    },
  },
  'Leg Day': {
    beginner: {
      description: 'Machine-friendly quads and hinges.',
      exercises: [
        { name: 'Goblet Squat', sets: 3, reps: 12, rest: 90 },
        { name: 'Leg Press', sets: 3, reps: 12, rest: 90 },
        { name: 'Seated Leg Curl', sets: 2, reps: 12, rest: 60 },
        { name: 'Standing Calf Raise', sets: 2, reps: 15, rest: 45 },
      ],
    },
    intermediate: {
      description: 'Classic leg day: squat, press, hinge, accessories.',
      exercises: [
        { name: 'Back Squat', sets: 4, reps: 8, rest: 150 },
        { name: 'Leg Press', sets: 3, reps: 12, rest: 90 },
        { name: 'Romanian Deadlift', sets: 3, reps: 8, rest: 120 },
        { name: 'Dumbbell Walking Lunge', sets: 3, reps: 10, rest: 90 },
        { name: 'Leg Extension', sets: 3, reps: 12, rest: 60 },
        { name: 'Standing Calf Raise', sets: 3, reps: 15, rest: 45 },
      ],
    },
    advanced: {
      description: 'High-volume quads/posterior with front squat variation.',
      exercises: [
        { name: 'Back Squat', sets: 4, reps: 5, rest: 180 },
        { name: 'Barbell Front Squat', sets: 3, reps: 6, rest: 150 },
        { name: 'Romanian Deadlift', sets: 3, reps: 8, rest: 120 },
        { name: 'Hack Squat', sets: 3, reps: 10, rest: 90 },
        { name: 'Lying Leg Curl', sets: 3, reps: 12, rest: 60 },
        { name: 'Leg Extension', sets: 3, reps: 15, rest: 45 },
        { name: 'Dumbbell Walking Lunge', sets: 2, reps: 12, rest: 60 },
        { name: 'Standing Calf Raise', sets: 4, reps: 12, rest: 45 },
      ],
    },
  },
  'Beginner Strength': {
    beginner: {
      description: 'Entry strength session with simple patterns.',
      exercises: [
        { name: 'Goblet Squat', sets: 3, reps: 10, rest: 90 },
        { name: 'Push-Up', sets: 3, reps: 8, rest: 75, notes: 'Kneeling OK' },
        { name: 'One Arm Dumbbell Row', sets: 3, reps: 10, rest: 75 },
        { name: 'Glute Bridge', sets: 2, reps: 12, rest: 60 },
        { name: 'Plank', sets: 2, reps: null, rest: 45, notes: '20–40s' },
      ],
    },
    intermediate: {
      description: 'Progressed full-body with dumbbell presses and RDLs.',
      exercises: [
        { name: 'Goblet Squat', sets: 4, reps: 10, rest: 90 },
        { name: 'Dumbbell Bench Press', sets: 3, reps: 8, rest: 90 },
        { name: 'One Arm Dumbbell Row', sets: 3, reps: 10, rest: 75 },
        { name: 'Romanian Deadlift', sets: 3, reps: 10, rest: 90 },
        { name: 'Dumbbell Shoulder Press', sets: 2, reps: 10, rest: 75 },
        { name: 'Plank', sets: 2, reps: null, rest: 45 },
      ],
    },
    advanced: {
      description: 'Barbell strength progression while keeping session focused.',
      exercises: [
        { name: 'Back Squat', sets: 4, reps: 6, rest: 150 },
        { name: 'Barbell Bench Press', sets: 4, reps: 6, rest: 120 },
        { name: 'Bent Over Barbell Row', sets: 3, reps: 8, rest: 90 },
        { name: 'Romanian Deadlift', sets: 3, reps: 8, rest: 120 },
        { name: 'Overhead Press', sets: 3, reps: 8, rest: 90 },
      ],
    },
  },
  'Chest Builder': {
    beginner: {
      description: 'Stable pressing and fly pattern practice.',
      exercises: [
        { name: 'Chest Press Machine', sets: 3, reps: 12, rest: 90 },
        { name: 'Pec Deck Fly', sets: 3, reps: 12, rest: 60 },
        { name: 'Incline Push Up', sets: 2, reps: 10, rest: 75 },
      ],
    },
    intermediate: {
      description: 'Multi-angle free-weight chest volume.',
      exercises: [
        { name: 'Barbell Bench Press', sets: 4, reps: 8, rest: 120 },
        { name: 'Incline Dumbbell Bench Press', sets: 3, reps: 10, rest: 90 },
        { name: 'Dumbbell Bench Press', sets: 3, reps: 10, rest: 90 },
        { name: 'Cable Chest Fly', sets: 3, reps: 12, rest: 60 },
      ],
    },
    advanced: {
      description: 'Heavy flat/incline work with dips and fly finishers.',
      exercises: [
        { name: 'Barbell Bench Press', sets: 5, reps: 5, rest: 150 },
        { name: 'Incline Barbell Bench Press', sets: 4, reps: 8, rest: 120 },
        { name: 'Chest Dip', sets: 3, reps: 8, rest: 90 },
        { name: 'Cable Chest Fly', sets: 3, reps: 12, rest: 60 },
        { name: 'Pec Deck Fly', sets: 2, reps: 15, rest: 45 },
      ],
    },
  },
  'Back Builder': {
    beginner: {
      description: 'Machine rows and pulldowns for back thickness basics.',
      exercises: [
        { name: 'Lat Pulldown', sets: 3, reps: 12, rest: 90 },
        { name: 'Machine Row', sets: 3, reps: 12, rest: 75 },
        { name: 'Face Pull', sets: 2, reps: 15, rest: 60 },
      ],
    },
    intermediate: {
      description: 'Pull-ups plus multi-angle rows.',
      exercises: [
        { name: 'Pull Up', sets: 4, reps: 6, rest: 120 },
        { name: 'Seated Cable Row', sets: 3, reps: 10, rest: 90 },
        { name: 'Lat Pulldown', sets: 3, reps: 10, rest: 90 },
        { name: 'Chest Supported Row', sets: 3, reps: 10, rest: 90 },
        { name: 'Face Pull', sets: 3, reps: 12, rest: 60 },
      ],
    },
    advanced: {
      description: 'Heavy vertical and horizontal pulls with lat finishers.',
      exercises: [
        { name: 'Pull Up', sets: 5, reps: 5, rest: 120 },
        { name: 'Bent Over Barbell Row', sets: 4, reps: 6, rest: 120 },
        { name: 'Chest Supported Row', sets: 3, reps: 10, rest: 90 },
        { name: 'Wide Grip Lat Pulldown', sets: 3, reps: 10, rest: 75 },
        { name: 'Straight Arm Pulldown', sets: 3, reps: 12, rest: 60 },
        { name: 'Face Pull', sets: 3, reps: 15, rest: 45 },
      ],
    },
  },
  'Shoulder Pump': {
    beginner: {
      description: 'Machine press and light raises for shoulder intro.',
      exercises: [
        { name: 'Machine Shoulder Press', sets: 3, reps: 12, rest: 75 },
        { name: 'Lateral Raise', sets: 3, reps: 12, rest: 60 },
        { name: 'Face Pull', sets: 2, reps: 15, rest: 60 },
      ],
    },
    intermediate: {
      description: 'Press plus multi-plane delt isolation.',
      exercises: [
        { name: 'Seated Dumbbell Shoulder Press', sets: 4, reps: 8, rest: 90 },
        { name: 'Arnold Press', sets: 3, reps: 10, rest: 90 },
        { name: 'Lateral Raise', sets: 3, reps: 12, rest: 60 },
        { name: 'Rear Delt Fly', sets: 3, reps: 12, rest: 60 },
        { name: 'Face Pull', sets: 2, reps: 12, rest: 60 },
      ],
    },
    advanced: {
      description: 'Overhead strength with high lateral/rear volume.',
      exercises: [
        { name: 'Overhead Press', sets: 4, reps: 6, rest: 120 },
        { name: 'Arnold Press', sets: 3, reps: 8, rest: 90 },
        { name: 'Cable Lateral Raise', sets: 4, reps: 15, rest: 45 },
        { name: 'Rear Delt Fly', sets: 3, reps: 12, rest: 45 },
        { name: 'Face Pull', sets: 3, reps: 15, rest: 45 },
        { name: 'Front Raise', sets: 2, reps: 12, rest: 45 },
      ],
    },
  },
  'Glute Focus': {
    beginner: {
      description: 'Bridges and simple hinges to feel the glutes.',
      exercises: [
        { name: 'Glute Bridge', sets: 3, reps: 15, rest: 60 },
        { name: 'Goblet Squat', sets: 3, reps: 12, rest: 75 },
        { name: 'Cable Pull Through', sets: 2, reps: 12, rest: 60 },
        { name: 'Reverse Lunge', sets: 2, reps: 10, rest: 75, notes: 'Each leg' },
      ],
    },
    intermediate: {
      description: 'Hip thrusts and RDLs with single-leg work.',
      exercises: [
        { name: 'Hip Thrust', sets: 4, reps: 10, rest: 90 },
        { name: 'Romanian Deadlift', sets: 3, reps: 8, rest: 120 },
        { name: 'Bulgarian Split Squat', sets: 3, reps: 10, rest: 90 },
        { name: 'Dumbbell Walking Lunge', sets: 3, reps: 10, rest: 75 },
        { name: 'Glute Bridge', sets: 2, reps: 12, rest: 60 },
      ],
    },
    advanced: {
      description: 'Heavy thrusts/hinges with unilateral posterior work.',
      exercises: [
        { name: 'Hip Thrust', sets: 5, reps: 8, rest: 90, notes: 'Pause at top' },
        { name: 'Romanian Deadlift', sets: 4, reps: 6, rest: 120 },
        { name: 'Bulgarian Split Squat', sets: 3, reps: 8, rest: 90 },
        { name: 'Single Leg Romanian Deadlift', sets: 3, reps: 10, rest: 75 },
        { name: 'Cable Pull Through', sets: 3, reps: 12, rest: 60 },
        { name: 'Single Leg Glute Bridge', sets: 2, reps: 12, rest: 45 },
      ],
    },
  },
  'Arm Pump': {
    beginner: {
      description: 'Simple curl/pushdown pairing — keep form crisp.',
      exercises: [
        { name: 'Dumbbell Bicep Curl', sets: 3, reps: 12, rest: 60 },
        { name: 'Triceps Pushdown', sets: 3, reps: 12, rest: 60 },
        { name: 'Hammer Curl', sets: 2, reps: 12, rest: 60 },
      ],
    },
    intermediate: {
      description: 'Balanced flexor/extensor volume with mix of tools.',
      exercises: [
        { name: 'Barbell Curl', sets: 3, reps: 10, rest: 60 },
        { name: 'Triceps Pushdown', sets: 3, reps: 12, rest: 60 },
        { name: 'Hammer Curl', sets: 3, reps: 10, rest: 60 },
        { name: 'Overhead Triceps Extension', sets: 3, reps: 12, rest: 60 },
        { name: 'Incline Dumbbell Curl', sets: 2, reps: 12, rest: 45 },
      ],
    },
    advanced: {
      description: 'Compound arm work plus specialized curl/extension finishers.',
      exercises: [
        { name: 'Close Grip Bench Press', sets: 4, reps: 8, rest: 90 },
        { name: 'Ez Bar Curl', sets: 3, reps: 8, rest: 75 },
        { name: 'Skull Crusher', sets: 3, reps: 10, rest: 60 },
        { name: 'Incline Dumbbell Curl', sets: 3, reps: 10, rest: 60 },
        { name: 'Rope Pushdown', sets: 3, reps: 12, rest: 45 },
        { name: 'Bayesian Cable Curl', sets: 2, reps: 12, rest: 45 },
      ],
    },
  },
  'Power Circuit': {
    beginner: {
      description: 'Athletic circuit with easy power and bracing.',
      exercises: [
        { name: 'Goblet Squat', sets: 3, reps: 8, rest: 75 },
        { name: 'Push-Up', sets: 3, reps: 8, rest: 60 },
        { name: 'Box Jump', sets: 3, reps: 4, rest: 75, notes: 'Low box' },
        { name: 'Plank', sets: 2, reps: null, rest: 45 },
      ],
    },
    intermediate: {
      description: 'Compound lifts cycled with jumps.',
      exercises: [
        { name: 'Back Squat', sets: 4, reps: 6, rest: 90 },
        { name: 'Barbell Bench Press', sets: 3, reps: 6, rest: 90 },
        { name: 'Kettlebell Swings', sets: 3, reps: 12, rest: 60 },
        { name: 'Box Jump', sets: 3, reps: 5, rest: 75 },
      ],
    },
    advanced: {
      description: 'Crisp strength-power pairing — short, high quality.',
      exercises: [
        { name: 'Back Squat', sets: 4, reps: 3, rest: 120, notes: 'Explosive intent' },
        { name: 'Push Press', sets: 4, reps: 3, rest: 90 },
        { name: 'Pull Up', sets: 3, reps: 5, rest: 90 },
        { name: 'Box Jump', sets: 4, reps: 3, rest: 75 },
        { name: 'Kettlebell Swings', sets: 3, reps: 10, rest: 60 },
      ],
    },
  },
  'Posterior Chain': {
    beginner: {
      description: 'Gentle hinge and posterior activation.',
      exercises: [
        { name: 'Romanian Deadlift', sets: 3, reps: 10, rest: 90, notes: 'Light' },
        { name: 'Glute Bridge', sets: 3, reps: 12, rest: 60 },
        { name: 'Back Extension', sets: 2, reps: 12, rest: 60 },
        { name: 'Seated Leg Curl', sets: 2, reps: 12, rest: 60 },
      ],
    },
    intermediate: {
      description: 'Deadlift + RDL + hip thrust posterior session.',
      exercises: [
        { name: 'Conventional Deadlift', sets: 4, reps: 5, rest: 180 },
        { name: 'Romanian Deadlift', sets: 3, reps: 8, rest: 120 },
        { name: 'Hip Thrust', sets: 3, reps: 10, rest: 90 },
        { name: 'Good Morning', sets: 3, reps: 10, rest: 90 },
        { name: 'Face Pull', sets: 2, reps: 12, rest: 60 },
      ],
    },
    advanced: {
      description: 'Heavy hinge day with Nordic and hip thrust volume.',
      exercises: [
        { name: 'Conventional Deadlift', sets: 5, reps: 3, rest: 180 },
        { name: 'Romanian Deadlift', sets: 3, reps: 6, rest: 120 },
        { name: 'Hip Thrust', sets: 3, reps: 8, rest: 90 },
        { name: 'Nordic Hamstring Curl', sets: 3, reps: 5, rest: 90, notes: 'Assisted OK' },
        { name: 'Back Extension', sets: 3, reps: 12, rest: 60 },
      ],
    },
  },
  'Quads Builder': {
    beginner: {
      description: 'Machine and goblet work for knee-friendly quads.',
      exercises: [
        { name: 'Goblet Squat', sets: 3, reps: 12, rest: 90 },
        { name: 'Leg Press', sets: 3, reps: 12, rest: 90 },
        { name: 'Leg Extension', sets: 2, reps: 12, rest: 60 },
      ],
    },
    intermediate: {
      description: 'Squat pattern with split squat and extensions.',
      exercises: [
        { name: 'Back Squat', sets: 4, reps: 8, rest: 150 },
        { name: 'Leg Press', sets: 3, reps: 12, rest: 90 },
        { name: 'Bulgarian Split Squat', sets: 3, reps: 10, rest: 90 },
        { name: 'Leg Extension', sets: 3, reps: 12, rest: 60 },
        { name: 'Reverse Lunge', sets: 2, reps: 10, rest: 75 },
      ],
    },
    advanced: {
      description: 'Front squat + hack focus — dense quad stimulus without fluff.',
      exercises: [
        { name: 'Barbell Front Squat', sets: 4, reps: 5, rest: 180 },
        { name: 'Hack Squat', sets: 4, reps: 8, rest: 120 },
        { name: 'Bulgarian Split Squat', sets: 3, reps: 8, rest: 90 },
        { name: 'Heels Elevated Squat', sets: 3, reps: 10, rest: 90 },
        { name: 'Leg Extension', sets: 3, reps: 15, rest: 45 },
      ],
    },
  },
  'Home Dumbbell': {
    beginner: {
      description: 'Minimal-equipment full body with dumbbells.',
      exercises: [
        { name: 'Goblet Squat', sets: 3, reps: 12, rest: 75 },
        { name: 'Dumbbell Bench Press', sets: 3, reps: 10, rest: 75 },
        { name: 'One Arm Dumbbell Row', sets: 2, reps: 10, rest: 75 },
        { name: 'Plank', sets: 2, reps: null, rest: 45 },
      ],
    },
    intermediate: {
      description: 'Full-body dumbbell strength without machines.',
      exercises: [
        { name: 'Goblet Squat', sets: 3, reps: 10, rest: 75 },
        { name: 'Dumbbell Bench Press', sets: 3, reps: 8, rest: 75 },
        { name: 'One Arm Dumbbell Row', sets: 3, reps: 10, rest: 75 },
        { name: 'Standing Dumbbell Shoulder Press', sets: 3, reps: 10, rest: 75 },
        { name: 'Romanian Deadlift', sets: 3, reps: 10, rest: 90 },
        { name: 'Plank', sets: 2, reps: null, rest: 45 },
      ],
    },
    advanced: {
      description: 'Unilateral-heavy dumbbell session for denser stimulus.',
      exercises: [
        { name: 'Bulgarian Split Squat', sets: 4, reps: 8, rest: 90 },
        { name: 'Dumbbell Bench Press', sets: 4, reps: 8, rest: 75 },
        { name: 'One Arm Dumbbell Row', sets: 3, reps: 8, rest: 75 },
        { name: 'Arnold Press', sets: 3, reps: 8, rest: 75 },
        { name: 'Single Leg Romanian Deadlift', sets: 3, reps: 10, rest: 75 },
        { name: 'Side Plank', sets: 2, reps: null, rest: 45, notes: 'Each side' },
      ],
    },
  },
  HIIT: {
    beginner: {
      description: 'Low-skill intervals — keep effort honest, form clean.',
      exercises: [
        { name: 'Jumping Jacks', sets: 4, reps: null, rest: 40, notes: '30s work' },
        { name: 'High Knee', sets: 3, reps: null, rest: 40, notes: '20–30s' },
        { name: 'Mountain Climber', sets: 3, reps: null, rest: 40, notes: '20–30s' },
        { name: 'Plank', sets: 2, reps: null, rest: 40, notes: '20s' },
      ],
    },
    intermediate: {
      description: 'Classic HIIT mix of rope, burpees, and lunges.',
      exercises: [
        { name: 'Jump Rope', sets: 5, reps: null, rest: 45, notes: '40s work' },
        { name: 'Burpees', sets: 4, reps: 10, rest: 45 },
        { name: 'Mountain Climber', sets: 4, reps: null, rest: 45, notes: '40s' },
        { name: 'Dumbbell Walking Lunge', sets: 3, reps: 12, rest: 45 },
        { name: 'Jumping Jacks', sets: 3, reps: null, rest: 45, notes: '40s' },
      ],
    },
    advanced: {
      description: 'Short, hard rounds — fewer moves, higher density.',
      exercises: [
        { name: 'Burpees', sets: 6, reps: 12, rest: 30 },
        { name: 'Box Jump', sets: 5, reps: 6, rest: 40 },
        { name: 'Jump Rope', sets: 5, reps: null, rest: 30, notes: '40s hard' },
        { name: 'Kettlebell Swings', sets: 4, reps: 15, rest: 40 },
      ],
    },
  },
  'Fat-Loss Circuit': {
    beginner: {
      description: 'Gentle full-body rounds to build work capacity.',
      exercises: [
        { name: 'Jumping Jacks', sets: 3, reps: null, rest: 40, notes: '30s' },
        { name: 'Push-Up', sets: 3, reps: 8, rest: 40, notes: 'Kneeling OK' },
        { name: 'Reverse Lunge', sets: 3, reps: 10, rest: 40 },
        { name: 'Plank', sets: 2, reps: null, rest: 40 },
      ],
    },
    intermediate: {
      description: 'Conditioning circuit with swings and crawls.',
      exercises: [
        { name: 'Jump Rope', sets: 4, reps: null, rest: 40, notes: '40s' },
        { name: 'Burpees', sets: 4, reps: 10, rest: 40 },
        { name: 'Kettlebell Swings', sets: 4, reps: 15, rest: 40 },
        { name: 'Mountain Climber', sets: 3, reps: null, rest: 40 },
        { name: 'Bear Crawl', sets: 3, reps: null, rest: 45, notes: '20–30s' },
      ],
    },
    advanced: {
      description: 'Dense conditioning — power + metabolic finishers.',
      exercises: [
        { name: 'Burpees', sets: 5, reps: 12, rest: 30 },
        { name: 'Kettlebell Swings', sets: 4, reps: 15, rest: 30 },
        { name: 'Box Jump', sets: 4, reps: 6, rest: 40 },
        { name: 'Battle Ropes', sets: 4, reps: null, rest: 30, notes: '30–40s' },
        { name: 'Bear Crawl', sets: 3, reps: null, rest: 40, notes: '30s' },
      ],
    },
  },
  'Engine Builder': {
    beginner: {
      description: 'Easy aerobic blocks to build an engine.',
      exercises: [
        { name: 'Running', sets: 1, reps: null, rest: 0, notes: '10–12 min easy' },
        { name: 'Cycling', sets: 1, reps: null, rest: 0, notes: '8–10 min steady' },
        { name: 'Rowing Machine', sets: 1, reps: null, rest: 0, notes: '6–8 min easy' },
      ],
    },
    intermediate: {
      description: 'Mixed steady-state cardio with light rope finish.',
      exercises: [
        { name: 'Running', sets: 1, reps: null, rest: 0, notes: '15–18 min steady' },
        { name: 'Rowing Machine', sets: 1, reps: null, rest: 0, notes: '10–12 min' },
        { name: 'Cycling', sets: 1, reps: null, rest: 0, notes: '10 min' },
        { name: 'Jump Rope', sets: 3, reps: null, rest: 45, notes: '60s easy' },
      ],
    },
    advanced: {
      description: 'Tempo run plus row intervals — quality, not junk miles.',
      exercises: [
        { name: 'Tempo Run', sets: 1, reps: null, rest: 0, notes: '20–25 min' },
        { name: 'Row Intervals', sets: 6, reps: null, rest: 60, notes: '60s hard / 60s easy' },
        { name: 'Jump Rope', sets: 3, reps: null, rest: 30, notes: '45s hard' },
      ],
    },
  },
  'Jump Conditioner': {
    beginner: {
      description: 'Learn soft landings and basic bounce patterns.',
      exercises: [
        { name: 'Jumping Jacks', sets: 3, reps: null, rest: 45, notes: '30s' },
        { name: 'Box Jump', sets: 3, reps: 4, rest: 75, notes: 'Low box' },
        { name: 'High Knee', sets: 2, reps: null, rest: 45, notes: '20s' },
        { name: 'Plank', sets: 2, reps: null, rest: 45 },
      ],
    },
    intermediate: {
      description: 'Jump + burpee conditioner.',
      exercises: [
        { name: 'Box Jump', sets: 4, reps: 6, rest: 75 },
        { name: 'Burpees', sets: 4, reps: 10, rest: 60 },
        { name: 'High Knee', sets: 3, reps: null, rest: 45, notes: '30–40s' },
        { name: 'Skater Jump', sets: 3, reps: 12, rest: 60 },
        { name: 'Mountain Climber', sets: 3, reps: null, rest: 45 },
      ],
    },
    advanced: {
      description: 'Explosive jumps with short rests — quality contacts.',
      exercises: [
        { name: 'Box Jump', sets: 5, reps: 5, rest: 60 },
        { name: 'Depth Jump', sets: 4, reps: 4, rest: 75, notes: 'Soft landings' },
        { name: 'Skater Jump', sets: 4, reps: 10, rest: 45 },
        { name: 'Tuck Jump', sets: 3, reps: 8, rest: 60 },
        { name: 'Burpees', sets: 3, reps: 10, rest: 45 },
      ],
    },
  },
  'Athletic Conditioning': {
    beginner: {
      description: 'Intro athletic moves with low coordination demand.',
      exercises: [
        { name: 'Box Jump', sets: 3, reps: 4, rest: 75 },
        { name: 'Reverse Lunge', sets: 3, reps: 10, rest: 60 },
        { name: 'Push-Up', sets: 2, reps: 8, rest: 60 },
        { name: 'Bear Crawl', sets: 2, reps: null, rest: 45, notes: '20s' },
      ],
    },
    intermediate: {
      description: 'Power, ropes, and change-of-direction work.',
      exercises: [
        { name: 'Box Jump', sets: 4, reps: 5, rest: 75 },
        { name: 'Kettlebell Swings', sets: 3, reps: 12, rest: 60 },
        { name: 'Skater Jump', sets: 3, reps: 12, rest: 60 },
        { name: 'Battle Ropes', sets: 3, reps: null, rest: 45, notes: '30–40s' },
        { name: 'Push Press', sets: 3, reps: 6, rest: 75 },
      ],
    },
    advanced: {
      description: 'High-output athletic circuit — explosive + metabolic.',
      exercises: [
        { name: 'Box Jump', sets: 4, reps: 4, rest: 60 },
        { name: 'Push Press', sets: 4, reps: 4, rest: 75 },
        { name: 'Kettlebell Swings', sets: 4, reps: 10, rest: 45 },
        { name: 'Skater Jump', sets: 3, reps: 12, rest: 45 },
        { name: 'Battle Ropes', sets: 3, reps: null, rest: 30, notes: '40s' },
        { name: 'Bear Crawl', sets: 3, reps: null, rest: 40, notes: '30s' },
      ],
    },
  },
  'Calisthenics Starter': {
    beginner: {
      description: 'Accessible bodyweight push, pull, and core.',
      exercises: [
        { name: 'Incline Push Up', sets: 3, reps: 10, rest: 75 },
        { name: 'Australian Pull-Up', sets: 3, reps: 8, rest: 75 },
        { name: 'Bench Dip', sets: 2, reps: 10, rest: 75 },
        { name: 'Reverse Lunge', sets: 2, reps: 10, rest: 60 },
        { name: 'Plank', sets: 2, reps: null, rest: 45 },
      ],
    },
    intermediate: {
      description: 'Standard calisthenics strength with split squats.',
      exercises: [
        { name: 'Push-Up', sets: 4, reps: 12, rest: 60 },
        { name: 'Australian Pull-Up', sets: 3, reps: 10, rest: 75 },
        { name: 'Dip', sets: 3, reps: 8, rest: 75 },
        { name: 'Bulgarian Split Squat', sets: 3, reps: 10, rest: 75 },
        { name: 'Hollow Body Hold', sets: 3, reps: null, rest: 45, notes: '20–30s' },
      ],
    },
    advanced: {
      description: 'Harder progressions — pull-ups, pistols, pike press.',
      exercises: [
        { name: 'Diamond Push Up', sets: 4, reps: 10, rest: 60 },
        { name: 'Pull Up', sets: 4, reps: 6, rest: 90 },
        { name: 'Dip', sets: 3, reps: 10, rest: 75 },
        { name: 'Pistol Squat', sets: 3, reps: 5, rest: 90, notes: 'Assisted OK' },
        { name: 'Pike Push Up', sets: 3, reps: 8, rest: 75 },
        { name: 'Hanging Leg Raise', sets: 3, reps: 8, rest: 60 },
      ],
    },
  },
  'Advanced Calisthenics': {
    beginner: {
      description: 'Prep progressions toward harder skills.',
      exercises: [
        { name: 'Incline Push Up', sets: 3, reps: 10, rest: 75 },
        { name: 'Australian Pull-Up', sets: 3, reps: 8, rest: 75 },
        { name: 'Bench Dip', sets: 3, reps: 8, rest: 75 },
        { name: 'Reverse Lunge', sets: 2, reps: 10, rest: 60 },
        { name: 'Hollow Body Hold', sets: 2, reps: null, rest: 45 },
      ],
    },
    intermediate: {
      description: 'Strict pull/dip focus with hanging knee raises.',
      exercises: [
        { name: 'Push-Up', sets: 4, reps: 12, rest: 60 },
        { name: 'Pull Up', sets: 4, reps: 6, rest: 90, notes: 'Band OK' },
        { name: 'Dip', sets: 3, reps: 8, rest: 75 },
        { name: 'Bulgarian Split Squat', sets: 3, reps: 8, rest: 75 },
        { name: 'Hanging Knee Raise', sets: 3, reps: 10, rest: 60 },
        { name: 'Pike Push Up', sets: 2, reps: 8, rest: 75 },
      ],
    },
    advanced: {
      description: 'Skill-biased session — quality reps over junk volume.',
      exercises: [
        { name: 'Pull Up', sets: 5, reps: 5, rest: 120, notes: 'Strict' },
        { name: 'Dip', sets: 4, reps: 6, rest: 90 },
        { name: 'Pistol Squat', sets: 3, reps: 5, rest: 90 },
        { name: 'Handstand Hold', sets: 4, reps: null, rest: 60, notes: 'Wall OK' },
        { name: 'Hanging Leg Raise', sets: 3, reps: 8, rest: 60 },
      ],
    },
  },
  'Core Workout': {
    beginner: {
      description: 'Bracing and anti-extension fundamentals.',
      exercises: [
        { name: 'Plank', sets: 3, reps: null, rest: 45, notes: '20–40s' },
        { name: 'Dead Bug', sets: 3, reps: 10, rest: 45 },
        { name: 'Bird Dog', sets: 2, reps: 10, rest: 45 },
        { name: 'Glute Bridge', sets: 2, reps: 12, rest: 45 },
      ],
    },
    intermediate: {
      description: 'Anti-rotation and dynamic abs with bracing.',
      exercises: [
        { name: 'Plank', sets: 3, reps: null, rest: 45, notes: '40–60s' },
        { name: 'Hanging Knee Raise', sets: 3, reps: 12, rest: 45 },
        { name: 'Pallof Press', sets: 3, reps: 10, rest: 60 },
        { name: 'Bicycle Crunch', sets: 3, reps: 16, rest: 45 },
        { name: 'Dead Bug', sets: 2, reps: 12, rest: 45 },
      ],
    },
    advanced: {
      description: 'Higher-demand core — hanging raises and rollouts.',
      exercises: [
        { name: 'Hanging Leg Raise', sets: 4, reps: 10, rest: 60 },
        { name: 'Ab Wheel Rollout', sets: 3, reps: 8, rest: 75 },
        { name: 'Pallof Press', sets: 3, reps: 12, rest: 45 },
        { name: 'Side Plank', sets: 3, reps: null, rest: 45, notes: 'Each side' },
        { name: 'Cable Crunch', sets: 3, reps: 12, rest: 45 },
      ],
    },
  },
  'Core Crusher': {
    beginner: {
      description: 'Gentle core circuit before hanging work.',
      exercises: [
        { name: 'Plank', sets: 3, reps: null, rest: 45 },
        { name: 'Dead Bug', sets: 3, reps: 10, rest: 45 },
        { name: 'Bicycle Crunch', sets: 2, reps: 16, rest: 45 },
        { name: 'Bird Dog', sets: 2, reps: 10, rest: 45 },
      ],
    },
    intermediate: {
      description: 'Hanging raises, rollouts, and rotation.',
      exercises: [
        { name: 'Plank', sets: 3, reps: null, rest: 45, notes: '40–60s' },
        { name: 'Hanging Leg Raise', sets: 3, reps: 10, rest: 60 },
        { name: 'Ab Wheel Rollout', sets: 3, reps: 8, rest: 75 },
        { name: 'Russian Twist', sets: 3, reps: 16, rest: 45 },
        { name: 'Cable Crunch', sets: 2, reps: 12, rest: 60 },
      ],
    },
    advanced: {
      description: 'High-demand core — denser hanging and anti-rotation.',
      exercises: [
        { name: 'Hanging Leg Raise', sets: 4, reps: 10, rest: 60 },
        { name: 'Ab Wheel Rollout', sets: 4, reps: 8, rest: 75 },
        { name: "Captain's Chair Leg Raise", sets: 3, reps: 12, rest: 45 },
        { name: 'Pallof Press', sets: 3, reps: 12, rest: 45 },
        { name: 'Side Plank', sets: 3, reps: null, rest: 45 },
        { name: 'Cable Crunch', sets: 3, reps: 12, rest: 45 },
      ],
    },
  },
  'Mobility Flow': {
    beginner: {
      description: 'Gentle openers for hips, spine, and T-spine.',
      exercises: [
        { name: 'Cat-Cow', sets: 2, reps: null, rest: 0, notes: '8–10 breaths' },
        { name: "World's Greatest Stretch", sets: 2, reps: null, rest: 0, notes: 'Each side' },
        { name: 'Hip Flexor Lunge Stretch', sets: 2, reps: null, rest: 0 },
        { name: 'Bird Dog', sets: 2, reps: 8, rest: 0 },
      ],
    },
    intermediate: {
      description: 'Longer holds and deeper hip/T-spine work.',
      exercises: [
        { name: 'Cat Cow Flow', sets: 2, reps: null, rest: 0 },
        { name: "World's Greatest Stretch", sets: 2, reps: null, rest: 0 },
        { name: 'Hip Flexor Lunge Stretch', sets: 2, reps: null, rest: 0 },
        { name: 'Thoracic Opener', sets: 2, reps: null, rest: 0 },
        { name: 'Deep Squat Hold', sets: 2, reps: null, rest: 0, notes: '45–60s' },
      ],
    },
    advanced: {
      description: 'Extended holds and unilateral mobility.',
      exercises: [
        { name: "World's Greatest Stretch", sets: 3, reps: null, rest: 0 },
        { name: 'Deep Squat Hold', sets: 3, reps: null, rest: 0, notes: '60–90s' },
        { name: '90/90 Hip Stretch', sets: 2, reps: null, rest: 0 },
        { name: 'Pigeon Pose', sets: 2, reps: null, rest: 0 },
        { name: 'Thoracic Opener', sets: 2, reps: null, rest: 0 },
        { name: 'Couch Stretch', sets: 2, reps: null, rest: 0 },
      ],
    },
  },
  'Yoga Essentials': {
    beginner: {
      description: 'Foundational yoga shapes and breathing.',
      exercises: [
        { name: 'Downward Facing Dog', sets: 2, reps: null, rest: 0 },
        { name: "Child's Pose to Down Dog", sets: 2, reps: null, rest: 0 },
        { name: 'Warrior II', sets: 2, reps: null, rest: 0, notes: 'Each side' },
        { name: "Child's Pose", sets: 1, reps: null, rest: 0 },
      ],
    },
    intermediate: {
      description: 'Standing + bridge flow with chest opener.',
      exercises: [
        { name: 'Downward Facing Dog', sets: 2, reps: null, rest: 0 },
        { name: "Child's Pose to Down Dog", sets: 2, reps: null, rest: 0 },
        { name: 'Warrior II', sets: 2, reps: null, rest: 0 },
        { name: 'Low Lunge Yoga', sets: 2, reps: null, rest: 0 },
        { name: 'Bridge Pose Yoga', sets: 2, reps: null, rest: 0 },
      ],
    },
    advanced: {
      description: 'Longer holds with hip openers — not more poses for volume.',
      exercises: [
        { name: 'Downward Facing Dog', sets: 3, reps: null, rest: 0, notes: 'Longer holds' },
        { name: 'Warrior II', sets: 3, reps: null, rest: 0 },
        { name: 'Low Lunge Yoga', sets: 2, reps: null, rest: 0 },
        { name: 'Pigeon Pose', sets: 2, reps: null, rest: 0 },
        { name: 'Bridge Pose Yoga', sets: 3, reps: null, rest: 0 },
      ],
    },
  },
  'Desk Reset': {
    beginner: {
      description: 'Quick desk relief — neck, chest, hips.',
      exercises: [
        { name: 'Doorway Chest Stretch', sets: 2, reps: null, rest: 0, notes: '30–45s' },
        { name: 'Cat-Cow', sets: 2, reps: null, rest: 0 },
        { name: 'Neck Side Stretch', sets: 2, reps: null, rest: 0 },
        { name: 'Seated Spinal Twist', sets: 2, reps: null, rest: 0 },
      ],
    },
    intermediate: {
      description: 'Desk reset with hip flexors and T-spine.',
      exercises: [
        { name: 'Doorway Chest Stretch', sets: 2, reps: null, rest: 0 },
        { name: 'Cat-Cow', sets: 2, reps: null, rest: 0 },
        { name: 'Seated Spinal Twist', sets: 2, reps: null, rest: 0 },
        { name: 'Hip Flexor Lunge Stretch', sets: 2, reps: null, rest: 0 },
        { name: 'Thoracic Opener', sets: 2, reps: null, rest: 0 },
      ],
    },
    advanced: {
      description: 'Deeper reset with world’s greatest stretch and squat hold.',
      exercises: [
        { name: 'Doorway Chest Stretch', sets: 2, reps: null, rest: 0, notes: '60s' },
        { name: "World's Greatest Stretch", sets: 2, reps: null, rest: 0 },
        { name: 'Hip Flexor Lunge Stretch', sets: 2, reps: null, rest: 0 },
        { name: 'Thoracic Opener', sets: 2, reps: null, rest: 0 },
        { name: 'Deep Squat Hold', sets: 2, reps: null, rest: 0, notes: '45s' },
      ],
    },
  },
};

function sqlStr(value) {
  if (value == null) return 'null';
  return `'${String(value).replace(/'/g, "''")}'`;
}

function estimateMinutes(exercises) {
  if (!exercises.length) return null;
  const transition = 45;
  const total = exercises.reduce((sum, ex) => {
    const sets = Math.max(1, ex.sets || 3);
    const rest = Math.max(0, ex.rest ?? 60);
    const work = ex.reps == null && rest <= 15 ? 75 : 40;
    // Cardio blocks with rest 0 and 1 set: parse minutes from notes when present.
    if (ex.reps == null && rest === 0 && sets === 1 && ex.notes) {
      const match = ex.notes.match(/(\d+)\s*[–-]\s*(\d+)\s*min|(\d+)\s*min/i);
      if (match) {
        const a = Number(match[1] || match[3]);
        const b = Number(match[2] || match[3]);
        return sum + ((a + b) / 2) * 60 + transition;
      }
    }
    // Mobility holds: ~45s per set when rest is 0
    if (ex.reps == null && rest === 0) {
      return sum + sets * 50 + transition;
    }
    return sum + sets * (work + rest) + transition;
  }, 0);
  return Math.max(10, Math.round(total / 60));
}

const rows = [];
const meta = [];

for (const [templateName, levels] of Object.entries(PROGRAMS)) {
  for (const level of ['beginner', 'intermediate', 'advanced']) {
    const program = levels[level];
    const minutes = estimateMinutes(program.exercises);
    meta.push({
      templateName,
      level,
      description: program.description,
      minutes,
      count: program.exercises.length,
    });
    program.exercises.forEach((ex, pos) => {
      rows.push(
        `(${sqlStr(templateName)}, ${sqlStr(level)}, ${sqlStr(ex.name)}, ${pos}, ${ex.sets}, ${
          ex.reps == null ? 'null' : ex.reps
        }, ${ex.rest}, ${sqlStr(ex.notes ?? null)})`,
      );
    });
  }
}

const metaValues = meta
  .map(
    (m) =>
      `(${sqlStr(m.templateName)}, ${sqlStr(m.level)}, ${sqlStr(m.description)}, ${m.minutes})`,
  )
  .join(',\n  ');

const sql = `-- Redesign system template variations for genuine B/I/A programming.
-- No fixed exercise count. Durations derived from sets, rest, and structure.

-- Clear existing system template exercises (variations retained).
delete from public.workout_template_exercises te
using public.workout_templates t
where te.template_id = t.id
  and t.is_system = true;

-- Ensure all three levels exist for every system template.
insert into public.workout_template_variations (
  template_id, training_level, description, estimated_minutes
)
select
  t.id,
  lvl.training_level,
  null,
  null
from public.workout_templates t
cross join (
  values ('beginner'::text), ('intermediate'), ('advanced')
) as lvl(training_level)
where t.is_system = true
  and not exists (
    select 1 from public.workout_template_variations v
    where v.template_id = t.id and v.training_level = lvl.training_level
  );

insert into public.workout_template_exercises (
  template_id, variation_id, exercise_id, position, exercise_name, exercise_type,
  planned_sets, planned_reps, planned_rest_sec, notes
)
select
  t.id,
  v.id,
  e.id,
  x.pos,
  e.name,
  e.exercise_type,
  x.sets,
  x.reps,
  x.rest_sec,
  x.notes
from public.workout_templates t
join public.workout_template_variations v
  on v.template_id = t.id
join (
  values
  ${rows.join(',\n  ')}
) as x(template_name, training_level, exercise_name, pos, sets, reps, rest_sec, notes)
  on x.template_name = t.name
 and x.training_level = v.training_level
join lateral (
  select ex.*
  from public.exercises ex
  where ex.is_system = true
    and (
      lower(ex.name) = lower(x.exercise_name)
      -- lower() BEFORE strip so "Hack Squat" ≠ "Back Squat"
      or regexp_replace(lower(ex.name), '[^a-z0-9]+', '', 'g')
        = regexp_replace(lower(x.exercise_name), '[^a-z0-9]+', '', 'g')
      or (
        x.exercise_name = 'Back Squat'
        and lower(ex.name) in ('back squat', 'barbell back squat')
      )
      or (
        x.exercise_name = 'Barbell Front Squat'
        and lower(ex.name) in ('barbell front squat', 'front squat')
      )
      or (
        x.exercise_name = 'Dumbbell Bicep Curl'
        and lower(ex.name) in ('dumbbell bicep curl', 'dumbbell curl')
      )
      or (
        x.exercise_name = 'Walking Lunge'
        and lower(ex.name) in ('walking lunge', 'dumbbell walking lunge')
      )
      or (
        x.exercise_name = 'Cable Pull Through'
        and lower(ex.name) in ('cable pull through', 'cable pull-through')
      )
      or (
        x.exercise_name = 'Ez Bar Curl'
        and lower(ex.name) in ('ez bar curl', 'ez-bar curl')
      )
      or (
        x.exercise_name = 'Bridge Pose Yoga'
        and lower(ex.name) like 'bridge pose%'
      )
    )
  order by
    case
      when lower(ex.name) = lower(x.exercise_name) then 0
      when regexp_replace(lower(ex.name), '[^a-z0-9]+', '', 'g')
        = regexp_replace(lower(x.exercise_name), '[^a-z0-9]+', '', 'g') then 1
      else 2
    end
  limit 1
) e on true
where t.is_system = true;

-- Apply level descriptions + structure-based durations.
update public.workout_template_variations v
set
  description = m.description,
  estimated_minutes = m.estimated_minutes
from public.workout_templates t,
(
  values
  ${metaValues}
) as m(template_name, training_level, description, estimated_minutes)
where v.template_id = t.id
  and t.is_system = true
  and t.name = m.template_name
  and v.training_level = m.training_level;

-- Keep parent template duration aligned to intermediate (card display).
update public.workout_templates t
set estimated_minutes = v.estimated_minutes
from public.workout_template_variations v
where t.is_system = true
  and v.template_id = t.id
  and v.training_level = 'intermediate'
  and v.estimated_minutes is not null;
`;

const out = join(
  __dirname,
  '..',
  'supabase',
  'migrations',
  '20261102190000_workout_template_variation_redesign_fix.sql',
);
writeFileSync(out, sql, 'utf8');

const summary = meta.map(
  (m) => `${m.templateName.padEnd(24)} ${m.level.padEnd(12)} ${String(m.count).padStart(2)} ex  ~${m.minutes}m`,
);
console.log(summary.join('\n'));
console.log(`\nWrote ${out}`);
console.log(`Rows: ${rows.length}, variations: ${meta.length}`);
