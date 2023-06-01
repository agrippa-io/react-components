export const TABLE_CATEGORY = {
  APPEARANCE: 'Appearance',
  FLAGS: 'Flags',
  HTML: 'HTML',
  MATERIAL_UI: 'Material UI',
  REACT: 'React',
}

export const argTypesTextField = {
  autoComplete: {
    description:
      "This prop helps users to fill forms faster, especially on mobile devices. The name can be confusing, as it's more like an autofill. You can learn more about it following the specification.",
    type: 'string',
    control: null,
    table: {
      category: TABLE_CATEGORY.MATERIAL_UI,
    },
  },
  autoFocus: {
    description:
      'If true, the input element is focused during the first mount.',
    type: 'bool',
    control: {
      type: 'boolean',
    },
    table: {
      category: TABLE_CATEGORY.FLAGS,
    },
  },
  children: {
    description: 'The content of the component.',
    type: 'node',
    control: null,
    table: {
      category: TABLE_CATEGORY.REACT,
    },
  },
  classes: {
    description:
      'Override or extend the styles applied to the component. See CSS API below for more details.',
    type: 'object',
    control: null,
    table: {
      category: TABLE_CATEGORY.APPEARANCE,
    },
  },
  color: {
    type:
      "'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | string",
    description:
      'The color of the component. It supports both default and custom theme colors, which can be added as shown in the palette customization guide.',
    defaultValue: 'primary',
    options: ['primary', 'secondary', 'error', 'info', 'success', 'warning'],
    control: {
      type: 'select',
    },
    table: {
      category: TABLE_CATEGORY.APPEARANCE,
    },
  },
  defaultValue: {
    description: 'The default value. Use when the component is not controlled.',
    type: 'any',
    control: null,
    table: {
      category: TABLE_CATEGORY.MATERIAL_UI,
    },
  },
  disabled: {
    description: 'If true, the component is disabled.',
    type: 'bool',
    defaultValue: false,
    control: {
      type: 'boolean',
    },
    table: {
      category: TABLE_CATEGORY.MATERIAL_UI,
    },
  },
  error: {
    description: 'If true, the label is displayed in an error state.',
    type: 'bool',
    defaultValue: false,
    control: {
      type: 'boolean',
    },
    table: {
      category: TABLE_CATEGORY.MATERIAL_UI,
    },
  },
  FormHelperTextProps: {
    description: 'Props applied to the FormHelperText element.',
    type: 'object',
    control: null,
    table: {
      category: TABLE_CATEGORY.MATERIAL_UI,
    },
  },
  fullWidth: {
    description:
      'If true, the input will take up the full width of its container.',
    type: 'bool',
    defaultValue: false,
    control: {
      type: 'boolean',
    },
    table: {
      category: TABLE_CATEGORY.APPEARANCE,
    },
  },
  helperText: {
    description: 'The helper text content.',
    type: 'node',
    control: {
      type: 'string',
    },
    table: {
      category: TABLE_CATEGORY.MATERIAL_UI,
    },
  },
  id: {
    description:
      'The id of the input element. Use this prop to make label and helperText accessible for screen readers.',
    type: 'string',
    control: {
      type: 'string',
    },
    table: {
      category: TABLE_CATEGORY.HTML,
    },
  },
  InputLabelProps: {
    description:
      'Props applied to the InputLabel element. Pointer events like onClick are enabled if and only if shrink is true.',
    type: 'object',
    control: null,
    table: {
      category: TABLE_CATEGORY.MATERIAL_UI,
    },
  },
  inputProps: {
    description: 'Attributes applied to the input element.',
    type: 'object',
    control: null,
    table: {
      category: TABLE_CATEGORY.MATERIAL_UI,
    },
  },
  InputProps: {
    description:
      'Props applied to the Input element. It will be a FilledInput, OutlinedInput or Input component depending on the variant prop value.',
    type: 'object',
    control: null,
    table: {
      category: TABLE_CATEGORY.MATERIAL_UI,
    },
  },
  inputRef: {
    description: 'Pass a ref to the input element.',
    type: 'object',
    control: null,
    table: {
      category: TABLE_CATEGORY.REACT,
    },
  },
  label: {
    description: 'The label content.',
    type: 'node',
    control: {
      type: 'string',
    },
    table: {
      category: TABLE_CATEGORY.HTML,
    },
  },
  margin: {
    description:
      'If dense or normal, will adjust vertical spacing of this and contained components.',
    type: "'dense' | 'none' | 'normal'",
    defaultValue: 'none',
    options: ['dense', 'none', 'normal'],
    control: {
      type: 'select',
    },
    table: {
      category: TABLE_CATEGORY.HTML,
    },
  },
  maxRows: {
    description:
      'Maximum number of rows to display when multiline option is set to true.',
    type: "'number' | 'string'",
    control: {
      type: 'number',
    },
    table: {
      category: TABLE_CATEGORY.MATERIAL_UI,
    },
  },
  minRows: {
    description:
      'Minimum number of rows to display when multiline option is set to true.',
    type: "'number' | 'string'",
    control: {
      type: 'number',
    },
    table: {
      category: TABLE_CATEGORY.MATERIAL_UI,
    },
  },
  multiline: {
    description: 'If true, a textarea element is rendered instead of an input.',
    type: 'bool',
    defaultValue: false,
    control: {
      type: 'boolean',
    },
    table: {
      category: TABLE_CATEGORY.MATERIAL_UI,
    },
  },
  name: {
    description: 'Name attribute of the input element.',
    type: 'string',
    control: {
      type: 'string',
    },
    table: {
      category: TABLE_CATEGORY.HTML,
    },
  },
  onChange: {
    description:
      'Callback fired when the value is changed. Signature: function(event: object) => void event: The event source of the callback. You can pull out the new value by accessing event.target.value (string).',
    type: 'func',
    control: null,
    table: {
      category: TABLE_CATEGORY.REACT,
    },
  },
  placeholder: {
    description:
      'The short hint displayed in the input before the user enters a value.',
    type: 'string',
    control: null,
    table: {
      category: TABLE_CATEGORY.HTML,
    },
  },
  required: {
    description:
      'If true, the label is displayed as required and the input element is required.',
    type: 'bool',
    control: {
      type: 'boolean',
    },
    table: {
      category: TABLE_CATEGORY.HTML,
    },
  },
  rows: {
    description:
      'Number of rows to display when multiline option is set to true.',
    type: "'number' | 'string'",
    control: {
      type: 'number',
    },
    table: {
      category: TABLE_CATEGORY.HTML,
    },
  },
  select: {
    description:
      'Render a Select element while passing the Input element to Select as input parameter. If this option is set you must pass the options of the select as children.',
    type: 'bool',
    defaultValue: false,
    control: {
      type: 'boolean',
    },
    table: {
      category: TABLE_CATEGORY.MATERIAL_UI,
    },
  },
  SelectProps: {
    description: 'Props applied to the Select element.',
    type: 'object',
    control: null,
    table: {
      category: TABLE_CATEGORY.MATERIAL_UI,
    },
  },
  size: {
    description: 'The size of the component.',
    type: "'medium' | 'small' | string",
    options: ['medium', 'small'],
    table: {
      category: TABLE_CATEGORY.MATERIAL_UI,
    },
  },
  sx: {
    description:
      'The system prop that allows defining system overrides as well as additional CSS styles. See the `sx` page for more details.',
    type: 'Array<func | object> | func | object',
    control: null,
    table: {
      category: TABLE_CATEGORY.APPEARANCE,
    },
  },
  type: {
    description:
      'Type of the input element. It should be a valid HTML5 input type.',
    type: 'string',
    options: [
      'button',
      'checkbox',
      'color',
      'date',
      'datetime-local',
      'email',
      'file',
      'hidden',
      'image',
      'month',
      'number',
      'password',
      'radio',
      'range',
      'reset',
      'search',
      'submit',
      'tel',
      'text',
      'time',
      'url',
      'week',
    ],
    control: {
      type: 'select',
    },
    table: {
      category: TABLE_CATEGORY.APPEARANCE,
    },
  },
  value: {
    description:
      'The value of the input element, required for a controlled component.',
    type: 'any',
    control: null,
    table: {
      category: TABLE_CATEGORY.APPEARANCE,
    },
  },
  variant: {
    description: 'The variant to use.',
    type: "'filled' | 'outlined' | 'standard'",
    defaultValue: 'outlined',
    options: ['filled', 'outlined', 'standard'],
    control: {
      type: 'select',
    },
    table: {
      category: TABLE_CATEGORY.APPEARANCE,
    },
  },
}
