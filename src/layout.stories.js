const React = require('react');
const fs = require('fs');
const path = require('path');

// Read the content of layout.html
// Note: For Storybook, paths are relative to the project root or where Storybook is run.
// Adjust if necessary, or make it more robust (e.g., via an environment variable or alias)
let layoutHtml = '';
try {
  layoutHtml = fs.readFileSync(path.resolve(__dirname, '../src/layout.html'), 'utf8');
} catch (e) {
  layoutHtml = '<p>Error loading layout.html. Make sure it exists at src/layout.html</p>';
  console.error("Failed to load layout.html for Storybook:", e);
}

// A simple component to render the HTML string
function LayoutShellComponent() {
  // In a real app, be very careful with dangerouslySetInnerHTML
  return <div dangerouslySetInnerHTML={{ __html: layoutHtml }} />;
}

module.exports = {
  title: 'Layout/Layout Shell',
  component: LayoutShellComponent,
  parameters: {
    layout: 'fullscreen', // Show the layout in full screen
  },
};

const Template = (args) => <LayoutShellComponent {...args} />;

module.exports.Default = Template.bind({});
module.exports.Default.args = {}; 