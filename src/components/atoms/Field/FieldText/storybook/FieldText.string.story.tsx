import { ComponentStory, ComponentMeta } from "@storybook/react";

import { FieldText } from "../FieldText";
import { FormProvider, useForm } from "react-hook-form";
import { Box, Button, TextField } from "@mui/material";
import { ReactHookFormStatePane } from "../../../../organisms/ReactHookFormStatePane";
import { validateMinChar, validateMaxChar, validateRangeChar } from "../../../../../services";
import { argTypesTextField } from "../../../../../constants";

const sxContainerRoot = {
  display: "flex",
  direction: "row",
  flexBasis: "100%",
};

const sxContainerPane = {
  display: "flex",
  direction: "column",
  flexBasis: "50%",
  margin: "0 5px",
};

export default {
  title: "Components / atoms / Field / FieldText / String",
  component: FieldText,
  argTypes: argTypesTextField,
} as ComponentMeta<typeof FieldText>;

export const FieldTextStringComponent: ComponentStory<typeof TextField> = (args) => {
  const formProviderProps = useForm({
    mode: "onChange",
  });
  const onSubmit = (data: any) => console.log("Form Data", data);

  return (
    <FormProvider {...formProviderProps}>
      <Box sx={sxContainerRoot}>
        <Box sx={sxContainerPane}>
          <form onSubmit={formProviderProps.handleSubmit(onSubmit)}>
            <FieldText
              name="fieldChar"
              textFieldProps={{
                label: "String",
                helperText: "Enter a string",
                ...args,
                inputProps: {
                  placeholder: "Enter a string",
                  ...args.inputProps,
                },
              }}
            />

            <FieldText
              name="fieldMinChar"
              rules={{
                validate: validateMinChar({ min: 5 }),
              }}
              textFieldProps={{
                label: "Min Characters",
                helperText: "Enter a string with 5 or more characters",
                ...args,
                inputProps: {
                  placeholder: "Enter a string with 5 or more characters",
                  ...args.inputProps,
                },
              }}
            />

            <FieldText
              name="fieldMax"
              rules={{
                validate: validateMaxChar({ max: 10 }),
              }}
              textFieldProps={{
                label: "Max Characters",
                helperText: "Enter a string with 10 or fewer characters",
                ...args,
                inputProps: {
                  placeholder: "Enter a string with 10 or fewer characters",
                  ...args.inputProps,
                },
              }}
            />

            <FieldText
              name="fieldRangeChar"
              rules={{
                validate: validateRangeChar({ min: 5, max: 10 }),
              }}
              textFieldProps={{
                label: "Character Range",
                helperText: "Enter a string between 5 and 10 characters",
                ...args,
                inputProps: {
                  placeholder: "Enter a string between 5 and 10 characters",
                  ...args.inputProps,
                },
              }}
            />

            <FieldText
              name="fieldTextarea"
              rules={{
                validate: validateRangeChar({ min: 5, max: 250 }),
              }}
              textFieldProps={{
                label: "Textarea for large bodies of text",
                helperText: "Insert large text block",
                multiline: true,
                rows: 5,
                ...args,
                inputProps: {
                  placeholder: "Insert large text block",
                  ...args.inputProps,
                },
              }}
            />

            <Button
              type="submit"
              variant="outlined"
              sx={{
                marginTop: "10px",
              }}
              fullWidth
            >
              Submit
            </Button>
          </form>
        </Box>
        <ReactHookFormStatePane sx={sxContainerPane} />
      </Box>
    </FormProvider>
  );
};
