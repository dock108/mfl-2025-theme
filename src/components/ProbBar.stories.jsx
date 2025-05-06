const React = require('react');
const ProbBar = require('./ProbBar.jsx');

module.exports = {
  title: 'Components/ProbBar',
  component: ProbBar,
  argTypes: {
    percentage: { control: { type: 'range', min: 0, max: 100, step: 1 }, defaultValue: 50 },
    className: { control: 'text' },
    barClassName: { control: 'text' },
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#22252b' }],
    },
  },
};

const Template = (args) => <div style={{ width: '200px' }}><ProbBar {...args} /></div>;

export const At25Percent = Template.bind({});
At25Percent.args = {
  percentage: 25,
};

export const At58Percent = Template.bind({});
At58Percent.args = {
  percentage: 58,
};

export const At90Percent = Template.bind({});
At90Percent.args = {
  percentage: 90,
};

export const Full = Template.bind({});
Full.args = {
  percentage: 100,
};

export const Empty = Template.bind({});
Empty.args = {
  percentage: 0,
}; 