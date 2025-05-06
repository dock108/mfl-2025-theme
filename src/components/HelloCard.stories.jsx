const React = require('react');
const HelloCard = require('./HelloCard.jsx').default;

module.exports = {
  title: 'Components/HelloCard',
  component: HelloCard,
  parameters: {
    // Optional: Configure a dark theme for this story or all stories
    // backgrounds: {
    //   default: 'dark',
    // },
  },
};

const Template = (args) => <HelloCard {...args} />;

module.exports.Default = Template.bind({});
module.exports.Default.args = {}; 