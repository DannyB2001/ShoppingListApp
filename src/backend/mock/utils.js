export function cloneDeep(value) {
  return JSON.parse(JSON.stringify(value));
}

export function assertId(dtoIn, context) {
  if (!dtoIn || !dtoIn.id) {
    throw new Error(`${context}: dtoIn.id je povinné`);
  }
}

export function buildDtoOut(payload, meta = {}) {
  return {
    status: "ok",
    ...meta,
    data: payload,
  };
}

export function delay(ms = 120) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
