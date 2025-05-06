const React = require('react');
const Button = require('./Button.jsx');

module.exports = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    children: { control: 'text', defaultValue: 'Click Me' },
    onClick: { action: 'clicked' },
    disabled: { control: 'boolean' },
    className: { control: 'text' },
    type: { control: { type: 'select', options: ['button', 'submit', 'reset'] } },
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#22252b' }],
    },
  },
};

const Template = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Primary Button',
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: 'Disabled Button',
  disabled: true,
};

// Hover state is managed by CSS (.glow-hover). Storybook can show the base state.
export const HoverInfo = Template.bind({});
HoverInfo.args = {
  children: 'Hover Over Me (Visual Test)',
};
HoverInfo.parameters = {
  docs: {
    description: {
      story: 'This button uses the .glow-hover class. Hover to see the effect. Test interaction by clicking (see Actions tab).'
    }
  }
}; 