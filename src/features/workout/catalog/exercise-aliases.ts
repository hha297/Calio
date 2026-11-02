/**
 * Local catalog / misspelled asset stem → canonical display name.
 * Used when merging remote + local seeds so near-duplicates collapse.
 */
export const LOCAL_EXERCISE_NAME_ALIASES: Record<string, string> = {
  '90 Hip Stretch': "90/90 Hip Stretch",
  'Ankle Circle': 'Ankle Circles',
  'Archer Pushup': 'Archer Push-Up',
  'Australia Pull-Up': 'Australian Pull-Up',
  'Barbel Bench Press': 'Barbell Bench Press',
  'Barbell Good Mornings': 'Good Morning',
  'Bicycles Crunches': 'Bicycle Crunch',
  'Bodyweight Chest Chest Dip': 'Chest Dip',
  'Breast Stroke': 'Breaststroke',
  'Captain Chair Leg Raise': "Captain's Chair Leg Raise",
  'Child Pose to Down Dog': "Child's Pose to Down Dog",
  'Clapping Pushup': 'Clapping Push-Up',
  'Climb Mill': 'ClimbMill',
  'Decline Barbel Bench Press': 'Decline Barbell Bench Press',
  'Diamond Pushup': 'Diamond Push-Up',
  Dips: 'Dip',
  'Downard Dog Hamstring Focus': 'Downward Dog Hamstring Focus',
  'Dynamic Warmup': 'Dynamic Warm-Up',
  'Face Pul': 'Face Pull',
  'Farlek Run': 'Fartlek Run',
  'Freestle Swim': 'Freestyle Swim',
  'Incline Barbel Bench Press': 'Incline Barbell Bench Press',
  'It Band Stretch': 'IT Band Cross-Over Stretch',
  'Knee To Chess Stretch': 'Knee-to-Chest Stretch',
  'Mixed Row Pryramid': 'Mixed Row Pyramid',
  'Overhead Tricep Stretch': 'Overhead Triceps Stretch',
  Pushup: 'Push-Up',
  'Reverse Grip Tricep Pushdown': 'Reverse-Grip Triceps Pushdown',
  'Ring Dips': 'Ring Dip',
  'Rowing Sprint': 'Row Sprints',
  'Shrimp Squats': 'Shrimp Squat',
  'Stead State Row': 'Steady-State Row',
  'Standing Squad Stretch': 'Standing Quad Stretch',
  'Tower Pull Up Hold': 'Towel Pull-Up Hold',
  'Trap Bar Deadlift': 'Trapbar Deadlift',
  'Tricep Kickback': 'Triceps Kickback',
  'Tricep Pushdown': 'Triceps Pushdown',
  'Wide Grip Pushup': 'Wide-Grip Push-Up',
  'World Greatest Stretch': "World's Greatest Stretch",
  'Warrior 2': 'Warrior II',
};

export function normalizeExerciseNameKey(name: string): string {
  return String(name)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function canonicalExerciseName(name: string): string {
  return LOCAL_EXERCISE_NAME_ALIASES[name] ?? name;
}
