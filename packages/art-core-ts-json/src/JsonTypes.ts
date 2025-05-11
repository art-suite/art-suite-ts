export type JsonScalerValue = string | number | boolean | null;
export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue; }
export type JsonPropsObject = { [key: string]: JsonScalerValue } // JsonObject with all values as JsonScalerValue

export type JsonValue = JsonScalerValue | JsonObject | JsonArray;
export type NonNullJsonValue = Exclude<JsonValue, null>;
