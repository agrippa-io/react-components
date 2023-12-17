import { Control, ControlProps } from "@storybook/components";

export interface IControlNestedComponentProps {
  argTypes: Record<any, any>;
}

export function ControlNestedComponent({ argTypes }: IControlNestedComponentProps) {
  const renderChildren = () =>
    Object.entries(argTypes).reduce((acc, [key, value]) => {
      // TODO - Figure out what storybook needs for control and labeling

      return acc;
    }, []);

  return <div>COMING SOON</div>;
}
