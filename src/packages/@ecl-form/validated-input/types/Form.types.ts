export enum FieldType {
    TEXT = 'text',
    NUMBER = 'number',
    TEXTAREA = 'textarea',
    OPTION_SINGLE = 'selectSingle',
    OPTION_MULTI = 'selectMulti',
    OPTION_BUTTON = 'selectButton',
    DATE = 'date',
    TIME = 'time',
    DATETIME = 'datetime',
    CHECKBOX = 'checkbox'
}

// interface OptionValue {
//     value: string,
//     label: string
// }
//
// export interface FormField<FormType extends FieldType> {
//     type: FormType,
//     value: FieldTypeMap[FormType],
//     name: string,
//     label: string,
//     placeholder: string,
//     validationCb: (val: FieldTypeMap[FormType]) => ValidityReturn
// }
//
// export type TextField = FormField<FieldType.TEXT>
// export type NumField = FormField<FieldType.NUMBER>
// export type TextAreaField = FormField<FieldType.TEXTAREA>
// export type DateField = FormField<FieldType.DATE>
// export type TimeField = FormField<FieldType.TIME>
// export type DateTimeField = FormField<FieldType.DATETIME>
// export type CheckBoxField = FormField<FieldType.CHECKBOX>
//
// export interface OptionSingleField extends FormField<FieldType.OPTION_SINGLE> {
//     options: { value: string, label: string }[],
// }
//
// export interface OptionMultiField extends FormField<FieldType.OPTION_MULTI> {
//     options: { value: string, label: string, id: number }[],
//     selected: { [id: string]: string }
// }

// export type AllowedFields =
//     TextField |
//     NumField |
//     TextAreaField |
//     DateField |
//     TimeField |
//     DateTimeField |
//     OptionSingleField |
//     OptionMultiField |
//     CheckBoxField

// export type FieldTypeMap = {
//     [FieldType.TEXT]: string,
//     [FieldType.NUMBER]: number,
//     [FieldType.TEXTAREA]: string,
//     [FieldType.OPTION_SINGLE]: OptionValue,
//     [FieldType.OPTION_MULTI]: OptionValue[],
//     [FieldType.DATE]: Date,
//     [FieldType.TIME]: Date,
//     [FieldType.DATETIME]: Date,
//     [FieldType.CHECKBOX]: boolean,
// }

//label uses value if not defined
export type OptionList<T> = { label?: string, value: T, icon?: string }[]

export type FieldValueTypes = string | number | Date | boolean | null | string[] | number[]

export interface NameMappedValues {
    [InputName: string]: FieldValueTypes
}

export interface FieldDisplayCondition {
    name: string,
    value: string
}
