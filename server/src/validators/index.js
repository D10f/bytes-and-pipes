import Ajv from "ajv";
import AjvErrors from "ajv-errors";
import AjvFormats from "ajv-formats";

import { fileUploadHeadersSchema } from "./file";

const ajv = new Ajv({
  $data: true,
  allErrors: true,
  removeAdditional: true,
});

AjvErrors(ajv);
AjvFormats(ajv);

/**
 * This allows to throw specific type of errors and with custom messages
 * TODO: Create specific validation error type
 */
const createValidator = (JSONValidator) => {
  return (input) => {
    const isValid = JSONValidator(input);

    if (isValid) {
      return true;
    }

    throw new Error("Invalid User Input", {
      errors: JSONValidator.errors.map((error) => ({
        message: error.message,
      })),
    });
  };
};

export const validateFileUploadHeaders = createValidator(
  ajv.compile(fileUploadHeadersSchema)
);
