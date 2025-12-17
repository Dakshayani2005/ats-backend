const validTransitions = {
  APPLIED: ["SCREENING", "REJECTED"],
  SCREENING: ["INTERVIEW", "REJECTED"],
  INTERVIEW: ["OFFER", "REJECTED"],
  OFFER: ["HIRED", "REJECTED"]
};

exports.canTransition = (from, to) => {
  return validTransitions[from]?.includes(to);
};
