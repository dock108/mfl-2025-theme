const React = require('react');
const Card = require('./Card.jsx'); // Assuming Card.jsx is in the same directory

module.exports = {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    children: {
      control: 'text',
      defaultValue: 'This is a card with default text.'
    },
    className: { control: 'text' },
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#22252b' }], // Theme background
    },
  },
};

const Template = (args) => <Card {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Card Content Here',
};

export const WithCustomClass = Template.bind({});
WithCustomClass.args = {
  children: 'Card with an additional custom CSS class.',
  className: 'border-2 border-accent',
};

// To demonstrate hover, you might need to rely on Chromatic for visual testing
// or describe the hover state. Storybook Args don't directly control CSS :hover states.
export const HoverStateInfo = Template.bind({});
HoverStateInfo.args = {
  children: 'This card uses the .glow-hover class. Hover to see the effect (visual test).',
};
HoverStateInfo.parameters = {
  docs: {
    description: {
      story: 'The `glow-hover` class is applied, which adds a box shadow on hover. Verify visually.'
    }
  }
}; 