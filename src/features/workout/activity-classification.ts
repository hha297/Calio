/**
 * Internal activity classifications for calorie estimates.
 *
 * Primary source: 2024 Adult Compendium of Physical Activities
 * https://pacompendium.com/adult-compendium/
 * https://pmc.ncbi.nlm.nih.gov/articles/PMC10818145/
 *
 * MET values and Compendium codes must never appear in normal user-facing UI.
 * Individual gym lifts do not have universal Compendium rows — use session categories.
 */

export type ActivityEvidence =
  /** Direct Compendium activity row (e.g. named cardio). */
  | 'compendium_activity'
  /** Broader Compendium category used as an honest proxy (resistance / calisthenics bands). */
  | 'compendium_category_proxy'
  /** Catalog intensity hint mapped into a Compendium band (not a unique lift measurement). */
  | 'intensity_band_proxy';

export type ActivityClass = {
  /** Internal stable key. */
  key: string;
  /** Internal MET used only for ACSM math. */
  met: number;
  /** Compendium specific activity code when applicable. */
  compendiumCode: string | null;
  intensity: 'light' | 'moderate' | 'vigorous';
  evidence: ActivityEvidence;
  /** i18n key suffix under workout.activityClass.* */
  labelKey:
    | 'resistanceTraining'
    | 'resistanceVigorous'
    | 'calisthenicsLight'
    | 'calisthenicsModerate'
    | 'calisthenicsVigorous'
    | 'stretching'
    | 'yoga'
    | 'cardio'
    | 'mixed';
};

/** Documented Compendium anchors used by Calio. */
export const COMPENDIUM = {
  /** 02054 — resistance, multiple exercises, 8–15 reps */
  resistanceGeneral: {
    code: '02054',
    met: 3.5,
  },
  /** 02052 — squats / deadlift, slow or explosive */
  resistanceSquatDeadlift: {
    code: '02052',
    met: 5.0,
  },
  /** 02050 — vigorous weightlifting / bodybuilding */
  resistanceVigorous: {
    code: '02050',
    met: 6.0,
  },
  /** 02024 — calisthenics light (curl-ups, crunch, plank) */
  calisthenicsLight: {
    code: '02024',
    met: 2.8,
  },
  /** 02022 — calisthenics moderate */
  calisthenicsModerate: {
    code: '02022',
    met: 3.8,
  },
  /** 02020 — calisthenics vigorous (push-ups, pull-ups, burpees, …) */
  calisthenicsVigorous: {
    code: '02020',
    met: 7.5,
  },
  /** 02056 — body-weight resistance, general */
  bodyweightResistanceGeneral: {
    code: '02056',
    met: 3.0,
  },
  /** 02057 — body-weight resistance, high intensity */
  bodyweightResistanceHigh: {
    code: '02057',
    met: 6.5,
  },
  /** 02101 — stretching, mild */
  stretchingMild: {
    code: '02101',
    met: 2.3,
  },
  /** Fallback moderate cardio when catalog intensity is missing */
  cardioModerateFallback: {
    code: null,
    met: 7.0,
  },
} as const;

const SQUAT_DEADLIFT =
  /\b(squat|deadlift|romanian|trap\s*bar|sumo|good\s*morning|hip\s*thrust|leg\s*press)\b/i;
const HOLD_OR_CORE_LIGHT =
  /\b(plank|dead\s*hang|hold|crunch|curl\s*up|hollow|dead\s*bug|bird\s*dog|stretch)\b/i;
const VIGOROUS_BW =
  /\b(burpees?|muscle\s*ups?|handstand|pistols?|jumps?|hiit|tabata|battle\s*ropes?|pull[\s-]?ups?|chin[\s-]?ups?|dips?)\b/i;
const YOGA = /\b(yoga|sun\s*salutation|downward|warrior\s*pose)\b/i;

/**
 * Classify a catalog exercise for preview estimates.
 * Strength lifts share a resistance-training category — never invent per-lift MET.
 */
export function classifyExerciseActivity(input: {
  exerciseType: string;
  name?: string | null;
  metValue?: number | null;
}): ActivityClass {
  const name = input.name?.trim() ?? '';
  const metHint =
    typeof input.metValue === 'number' && input.metValue > 0 ? input.metValue : null;

  if (input.exerciseType === 'strength') {
    // Preview for a single lift still uses the general multi-exercise resistance model
    // (02054). Squats/deadlifts may use 02052 as a closer category proxy — still not a
    // unique measurement of that named lift in isolation.
    if (SQUAT_DEADLIFT.test(name)) {
      return {
        key: 'resistance_squat_deadlift',
        met: COMPENDIUM.resistanceSquatDeadlift.met,
        compendiumCode: COMPENDIUM.resistanceSquatDeadlift.code,
        intensity: 'moderate',
        evidence: 'compendium_category_proxy',
        labelKey: 'resistanceTraining',
      };
    }
    return {
      key: 'resistance_general',
      met: COMPENDIUM.resistanceGeneral.met,
      compendiumCode: COMPENDIUM.resistanceGeneral.code,
      intensity: 'moderate',
      evidence: 'compendium_category_proxy',
      labelKey: 'resistanceTraining',
    };
  }

  if (input.exerciseType === 'bodyweight') {
    if (VIGOROUS_BW.test(name) || (metHint != null && metHint >= 8)) {
      return {
        key: 'calisthenics_vigorous',
        met: COMPENDIUM.calisthenicsVigorous.met,
        compendiumCode: COMPENDIUM.calisthenicsVigorous.code,
        intensity: 'vigorous',
        evidence: name ? 'compendium_category_proxy' : 'intensity_band_proxy',
        labelKey: 'calisthenicsVigorous',
      };
    }
    if (HOLD_OR_CORE_LIGHT.test(name) || (metHint != null && metHint <= 3.5)) {
      return {
        key: 'calisthenics_light',
        met: COMPENDIUM.calisthenicsLight.met,
        compendiumCode: COMPENDIUM.calisthenicsLight.code,
        intensity: 'light',
        evidence: 'compendium_category_proxy',
        labelKey: 'calisthenicsLight',
      };
    }
    if (metHint != null && metHint >= 6) {
      return {
        key: 'bodyweight_resistance_high',
        met: COMPENDIUM.bodyweightResistanceHigh.met,
        compendiumCode: COMPENDIUM.bodyweightResistanceHigh.code,
        intensity: 'vigorous',
        evidence: 'intensity_band_proxy',
        labelKey: 'calisthenicsVigorous',
      };
    }
    return {
      key: 'calisthenics_moderate',
      met: COMPENDIUM.calisthenicsModerate.met,
      compendiumCode: COMPENDIUM.calisthenicsModerate.code,
      intensity: 'moderate',
      evidence: 'compendium_category_proxy',
      labelKey: 'calisthenicsModerate',
    };
  }

  if (input.exerciseType === 'cardio') {
    if (metHint != null && metHint >= 2 && metHint <= 18) {
      return {
        key: 'cardio_catalog',
        met: metHint,
        compendiumCode: null,
        intensity: metHint >= 9 ? 'vigorous' : metHint >= 5 ? 'moderate' : 'light',
        evidence: 'compendium_activity',
        labelKey: 'cardio',
      };
    }
    return {
      key: 'cardio_moderate_fallback',
      met: COMPENDIUM.cardioModerateFallback.met,
      compendiumCode: null,
      intensity: 'moderate',
      evidence: 'compendium_category_proxy',
      labelKey: 'cardio',
    };
  }

  // Flexibility / mobility / other
  if (YOGA.test(name)) {
    return {
      key: 'yoga_general',
      met: 3.0,
      compendiumCode: null,
      intensity: 'light',
      evidence: 'compendium_category_proxy',
      labelKey: 'yoga',
    };
  }
  return {
    key: 'stretching_mild',
    met: COMPENDIUM.stretchingMild.met,
    compendiumCode: COMPENDIUM.stretchingMild.code,
    intensity: 'light',
    evidence: 'compendium_category_proxy',
    labelKey: 'stretching',
  };
}

/** Session-level resistance MET (logged workout), not per-lift fiction. */
export function classifyResistanceSession(input: {
  exercises: { exerciseType: string; metValue?: number | null; name?: string | null }[];
}): ActivityClass {
  const hasVigorousBw = input.exercises.some(
    (e) =>
      e.exerciseType === 'bodyweight' &&
      classifyExerciseActivity(e).intensity === 'vigorous',
  );
  const hasHeavyCompounds = input.exercises.some(
    (e) => e.exerciseType === 'strength' && SQUAT_DEADLIFT.test(e.name ?? ''),
  );
  if (hasVigorousBw) {
    return {
      key: 'resistance_session_vigorous_bw',
      met: COMPENDIUM.resistanceVigorous.met,
      compendiumCode: COMPENDIUM.resistanceVigorous.code,
      intensity: 'vigorous',
      evidence: 'compendium_category_proxy',
      labelKey: 'resistanceVigorous',
    };
  }
  if (hasHeavyCompounds) {
    return {
      key: 'resistance_session_squat_deadlift',
      met: COMPENDIUM.resistanceSquatDeadlift.met,
      compendiumCode: COMPENDIUM.resistanceSquatDeadlift.code,
      intensity: 'moderate',
      evidence: 'compendium_category_proxy',
      labelKey: 'resistanceTraining',
    };
  }
  return {
    key: 'resistance_session_general',
    met: COMPENDIUM.resistanceGeneral.met,
    compendiumCode: COMPENDIUM.resistanceGeneral.code,
    intensity: 'moderate',
    evidence: 'compendium_category_proxy',
    labelKey: 'resistanceTraining',
  };
}
