import { c as createInvalidVariablesError, g as getEnv$1, s as setOnSetGetEnv } from './runtime_C7NvO4i5.mjs';

const schema = {"GOOGLE_SERVICE_ACCOUNT_EMAIL":{"context":"server","access":"secret","type":"string"},"GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY":{"context":"server","access":"secret","type":"string"},"GOOGLE_SHEETS_SPREADSHEET_ID":{"context":"server","access":"secret","type":"string"},"GOOGLE_SHEETS_SHEET_NAME":{"context":"server","access":"secret","type":"string"},"SANITY_STUDIO_PROJECT_ID":{"context":"server","access":"secret","type":"string"},"SANITY_STUDIO_DATASET":{"context":"server","access":"secret","type":"string"},"GOOGLE_CALENDAR_ID":{"context":"server","access":"secret","type":"string"},"SENDER_NET_ACCESS_TOKEN":{"context":"server","access":"secret","type":"string"},"GOOGLE_APP_PASSWORD":{"context":"server","access":"secret","type":"string"},"TIENDANUBE_ACCESS_TOKEN":{"context":"server","access":"secret","type":"string"},"TIENDANUBE_USER_ID":{"context":"server","access":"secret","type":"string"}};

function getEnvFieldType(options) {
  const optional = options.optional ? options.default !== void 0 ? false : true : false;
  let type;
  if (options.type === "enum") {
    type = options.values.map((v) => `'${v}'`).join(" | ");
  } else {
    type = options.type;
  }
  return `${type}${optional ? " | undefined" : ""}`;
}
const stringValidator = ({ max, min, length, url, includes, startsWith, endsWith }) => (input) => {
  if (typeof input !== "string") {
    return {
      ok: false,
      errors: ["type"]
    };
  }
  const errors = [];
  if (max !== void 0 && !(input.length <= max)) {
    errors.push("max");
  }
  if (min !== void 0 && !(input.length >= min)) {
    errors.push("min");
  }
  if (length !== void 0 && !(input.length === length)) {
    errors.push("length");
  }
  if (url !== void 0 && !URL.canParse(input)) {
    errors.push("url");
  }
  if (includes !== void 0 && !input.includes(includes)) {
    errors.push("includes");
  }
  if (startsWith !== void 0 && !input.startsWith(startsWith)) {
    errors.push("startsWith");
  }
  if (endsWith !== void 0 && !input.endsWith(endsWith)) {
    errors.push("endsWith");
  }
  if (errors.length > 0) {
    return {
      ok: false,
      errors
    };
  }
  return {
    ok: true,
    value: input
  };
};
const numberValidator = ({ gt, min, lt, max, int }) => (input) => {
  const num = parseFloat(input ?? "");
  if (isNaN(num)) {
    return {
      ok: false,
      errors: ["type"]
    };
  }
  const errors = [];
  if (gt !== void 0 && !(num > gt)) {
    errors.push("gt");
  }
  if (min !== void 0 && !(num >= min)) {
    errors.push("min");
  }
  if (lt !== void 0 && !(num < lt)) {
    errors.push("lt");
  }
  if (max !== void 0 && !(num <= max)) {
    errors.push("max");
  }
  if (int !== void 0) {
    const isInt = Number.isInteger(num);
    if (!(int ? isInt : !isInt)) {
      errors.push("int");
    }
  }
  if (errors.length > 0) {
    return {
      ok: false,
      errors
    };
  }
  return {
    ok: true,
    value: num
  };
};
const booleanValidator = (input) => {
  const bool = input === "true" ? true : input === "false" ? false : void 0;
  if (typeof bool !== "boolean") {
    return {
      ok: false,
      errors: ["type"]
    };
  }
  return {
    ok: true,
    value: bool
  };
};
const enumValidator = ({ values }) => (input) => {
  if (!(typeof input === "string" ? values.includes(input) : false)) {
    return {
      ok: false,
      errors: ["type"]
    };
  }
  return {
    ok: true,
    value: input
  };
};
function selectValidator(options) {
  switch (options.type) {
    case "string":
      return stringValidator(options);
    case "number":
      return numberValidator(options);
    case "boolean":
      return booleanValidator;
    case "enum":
      return enumValidator(options);
  }
}
function validateEnvVariable(value, options) {
  const isOptional = options.optional || options.default !== void 0;
  if (isOptional && value === void 0) {
    return {
      ok: true,
      value: options.default
    };
  }
  if (!isOptional && value === void 0) {
    return {
      ok: false,
      errors: ["missing"]
    };
  }
  return selectValidator(options)(value);
}

/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-check

// @ts-expect-error
/** @returns {string} */
// used while generating the virtual module
// biome-ignore lint/correctness/noUnusedFunctionParameters: `key` is used by the generated code
const getEnv = (key) => {
	return getEnv$1(key);
};

const _internalGetSecret = (key) => {
	const rawVariable = getEnv(key);
	const variable = rawVariable === '' ? undefined : rawVariable;
	const options = schema[key];

	const result = validateEnvVariable(variable, options);
	if (result.ok) {
		return result.value;
	}
	const type = getEnvFieldType(options);
	throw createInvalidVariablesError(key, type, result);
};

setOnSetGetEnv(() => {
	GOOGLE_SERVICE_ACCOUNT_EMAIL = _internalGetSecret("GOOGLE_SERVICE_ACCOUNT_EMAIL");
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = _internalGetSecret("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");
GOOGLE_SHEETS_SPREADSHEET_ID = _internalGetSecret("GOOGLE_SHEETS_SPREADSHEET_ID");
GOOGLE_SHEETS_SHEET_NAME = _internalGetSecret("GOOGLE_SHEETS_SHEET_NAME");
_internalGetSecret("SANITY_STUDIO_PROJECT_ID");
_internalGetSecret("SANITY_STUDIO_DATASET");
GOOGLE_CALENDAR_ID = _internalGetSecret("GOOGLE_CALENDAR_ID");
SENDER_NET_ACCESS_TOKEN = _internalGetSecret("SENDER_NET_ACCESS_TOKEN");
GOOGLE_APP_PASSWORD = _internalGetSecret("GOOGLE_APP_PASSWORD");
_internalGetSecret("TIENDANUBE_ACCESS_TOKEN");
_internalGetSecret("TIENDANUBE_USER_ID");

});
let GOOGLE_SERVICE_ACCOUNT_EMAIL = _internalGetSecret("GOOGLE_SERVICE_ACCOUNT_EMAIL");
let GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = _internalGetSecret("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");
let GOOGLE_SHEETS_SPREADSHEET_ID = _internalGetSecret("GOOGLE_SHEETS_SPREADSHEET_ID");
let GOOGLE_SHEETS_SHEET_NAME = _internalGetSecret("GOOGLE_SHEETS_SHEET_NAME");
_internalGetSecret("SANITY_STUDIO_PROJECT_ID");
_internalGetSecret("SANITY_STUDIO_DATASET");
let GOOGLE_CALENDAR_ID = _internalGetSecret("GOOGLE_CALENDAR_ID");
let SENDER_NET_ACCESS_TOKEN = _internalGetSecret("SENDER_NET_ACCESS_TOKEN");
let GOOGLE_APP_PASSWORD = _internalGetSecret("GOOGLE_APP_PASSWORD");
_internalGetSecret("TIENDANUBE_ACCESS_TOKEN");
_internalGetSecret("TIENDANUBE_USER_ID");

export { GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY as G, SENDER_NET_ACCESS_TOKEN as S, GOOGLE_SERVICE_ACCOUNT_EMAIL as a, GOOGLE_CALENDAR_ID as b, GOOGLE_APP_PASSWORD as c, GOOGLE_SHEETS_SHEET_NAME as d, GOOGLE_SHEETS_SPREADSHEET_ID as e };
