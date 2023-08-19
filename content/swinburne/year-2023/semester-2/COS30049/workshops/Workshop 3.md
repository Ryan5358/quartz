---
title: "Workshop 3"
tags: 
- COS30049/Workshops
- Project background
---

## Overall System Design

>[!note] Whiteboard
>
>![[../resources/wk3-screenshot.jpg]]


## Material UI
1.  [Grid](https://mui.com/material-ui/react-grid/)

2.  [Content block](https://mui.com/material-ui/react-grid/#complex-grid)

3. Navigation
```js
// Import the core React library, which is needed to define React components.
import React from 'react';

// Import the `Link` component from the `react-router-dom` library
// The `Link` component is used to create links that enable navigation within the application // without a full page reload.
import { Link } from 'react-routed-dom';

// Navigation Component
function Navigation() {
	return (
		// Create a `div` element that contains the navigation links.
		<div>
			// Create a link using 'Link' component that navigates to the root route "/"  
			// with the link text is "Home"
			<Link to="/">Home</Link>
			// Create a link using 'Link' component that navigates to the '/about' route 
			// with the link text is "About"
			<Link to="/about">About</Link>
		</div>
	);
}

// Export the `Navigation` component as the default export of the module.
export default Navigation;
```

```js
// Import the core React library, which is needed to define React components.
import React from 'react';

// Import the `BrowserRouter` and `Route` components from the `react-router-dom` library.
// The `BrowserRouter` provides the routing functionality, and the `Route` component defines 
// a route mapping between URLs and components.
import { BrowserRouter } as Router, Route } from 'react-router-dom';

import Home from './Home';
import About from './About';

// App component
function App() {
	return (
		// Set up the routing infrastructure for the application.
		<Router>
			// Define a route. When the URL matches the path 
			// '/' exactly, the 'Home' component will be rendered.
			<Route path="/" exact component={Home} />
			// Define a route. When the URL matches the path 
			// '/about' exactly, the 'About' component will be rendered.
			<Route path="/about" component={About} />
		</Router>
	);
}

// Export the `App` component as the default export of the module.
export default App;
```

