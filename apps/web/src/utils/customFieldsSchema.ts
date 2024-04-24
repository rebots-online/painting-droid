import type { Size } from "./common";

export type CustomField =
  | {
      type: "string";
      name: string;
      defaultValue: string;
    }
  | {
      type: "option-size";
      name: string;
      options: { value: Size; label: string }[];
      defaultValue: Size;
    }
  | {
      type: "option-string";
      name: string;
      options: { value: string; label: string }[];
      defaultValue: string;
    }
  | {
      type: "option-number";
      name: string;
      options: { value: number; label: string }[];
      defaultValue: number;
    };

export type CustomFieldsSchema = Record<string, CustomField>;

export type CustomFieldsSchemaValues<T extends Record<string, CustomField>> = {
  [K in keyof T]: T[K]["defaultValue"];
};

export const getDefaultValues = (schema: Record<string, CustomField>) => {
  return Object.entries(schema).reduce((acc, [key, value]) => {
    acc[key] = value.defaultValue;
    return acc;
  }, {} as Record<string, unknown>);
};
