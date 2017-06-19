"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import React and React DOM
var React = require("react");
var react_dom_1 = require("react-dom");
// Import the Hot Module Reloading App Container – more on why we use 'require' below
var AppContainer = require('react-hot-loader').AppContainer;
// Import our App container (which we will create in the next step)
var App_1 = require("./containers/App");
// Get the root element from the HTML
var rootEl = document.getElementById('root');
// And render our App into it, inside the HMR App ontainer which handles the hot reloading
react_dom_1.render(React.createElement(AppContainer, null,
    React.createElement(App_1.default, null)), rootEl);
// Handle hot reloading requests from Webpack
if (module.hot) {
    module.hot.accept('./containers/App', function () {
        // If we receive a HMR request for our App container, then reload it using require (we can't do this dynamically with import)
        var NextApp = require('./containers/App').default;
        // And render it into the root element again
        react_dom_1.render(React.createElement(AppContainer, null,
            React.createElement(NextApp, null)), rootEl);
    });
}
//# sourceMappingURL=index.js.map