import type { Size } from "@/utils/common";
import { OptionNumberCustomField } from "./optionNumberCustomField";
import { OptionSizeCustomField } from "./optionSizeCustomField";
import { StringCustomField } from "./stringCustomField";
import type { CustomField } from "@/utils/customFieldsSchema";

export const CustomFieldArray = (props: {
  schema: Record<string, CustomField>;
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}) => {
  const { values, onChange, schema } = props;
  return (
    <>
      {Object.entries(values)
        .filter(([key]) => schema[key])
        .map(([key, value]) => {
          const option = schema[key];
          if (option.type === "string") {
            <StringCustomField
              customField={schema[key]}
              value={value as string}
              onChange={(value) => onChange(key, value)}
            />;
          }
          if (option.type === "option-size") {
            return (
              <OptionSizeCustomField
                customField={schema[key]}
                value={value as Size}
                onChange={(value) => onChange(key, value)}
              />
            );
          }
          if (option.type === "option-number") {
            return (
              <OptionNumberCustomField
                customField={schema[key]}
                value={value as number}
                onChange={(value) => onChange(key, value)}
              />
            );
          }
        })}
    </>
  );
};

