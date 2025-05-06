import React from 'react';
import HelloCard from './HelloCard';

export default {
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

export const Default = Template.bind({});
Default.args = {}; 