const React = require('react');
const Badge = require('./Badge.jsx');

module.exports = {
  title: 'Components/Badge',
  component: Badge,
  argTypes: {
    children: { control: 'text', defaultValue: 'Badge' },
    variant: { control: { type: 'select', options: ['default', 'accent'] } },
    className: { control: 'text' },
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#22252b' }],
    },
  },
};

const Template = (args) => <Badge {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Default Badge',
  variant: 'default',
};

export const Accent = Template.bind({});
Accent.args = {
  children: 'Accent Badge',
  variant: 'accent',
}; 