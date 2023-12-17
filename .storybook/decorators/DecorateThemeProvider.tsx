// @ts-ignore
import { getTheme } from "@agrippa-io/storybook-mui-5/dist/themes/utils/getTheme";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { THEMES_MUI_5, defaultTheme } from "../../src/styles/themes/Matx/MatxThemes";

// @ts-ignore
export const DecorateThemeProvider = (Story, context) => {
  const theme = getTheme(context, THEMES_MUI_5, defaultTheme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story {...context} />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
