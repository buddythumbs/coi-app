export type configStateType = {
  statuses: array,
  subsystems: array,
};

type actionType = {
  type: string
};

export default function config(state={
    statuses : [
      'draft',
      'submit',
      'approve',
      'execute',
      'complete'
    ],
    subsystems:[
      "Generic Support",
      "PM / FCO",
      "Dynamics",
      "F&T and Layout",
      "Dose Control",
      "C+T",
      "Defectivity",
      "Illumination",
      "Sensors",
      "Metrology",
      "Projection",
      "Reticle Handling",
      "Computing Software and Servers",
      "Software",
      "Wafer Handling",
      "Wafer Stage",
      "Laser (ARF/KRF)",
      "Reticle Stage",
      "ABS / Wafer Fab Apps",
      "ABS / Factory Integration",
      "ABS / Imaging",
      "ABS / Productivity",
      "ABS / Overlay",
      "ABS / Overlay-Alignment",
      "ABS / Lens Heating",
      "ABS / Defectivity - Immersion",
    ],
  },action) {
  switch (action.type) {
    default:
      state = {...state};
  }
  return state
}
