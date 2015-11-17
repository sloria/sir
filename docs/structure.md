
Structure
---------

The folder structure provided is only meant to serve as a guide, it is by no means prescriptive. It is something that has worked very well for me and my team, but use only what makes sense to you.

```
.
├── bin                      # Build/Start scripts
├── build                    # All build-related configuration
│   └── webpack              # Environment-specific configuration files for webpack
├── config                   # Project configuration settings
├── src                      # Application source code
│   ├── components           # Generic React Components (generally Dumb components)
│   ├── containers           # Components that provide context (e.g. Redux Provider)
│   ├── layouts              # Components that dictate major page structure
│   ├── modules              # Redux action type/action/reducer modules: https://github.com/erikras/ducks-modular-redux
│   ├── routes               # Application route definitions
│   ├── store                # Redux store configuration
│   ├── utils                # Generic utilities
│   ├── views                # Components that live at a route
│   └── app.js               # Application bootstrap and rendering
└── tests                    # Unit tests
```

### Components vs. Views vs. Layouts

**TL;DR:** They're all components.

This distinction may not be important for you, but as an explanation: A **Layout** is something that describes an entire page structure, such as a fixed navigation, viewport, sidebar, and footer. Most applications will probably only have one layout, but keeping these components separate makes their intent clear. **Views** are components that live at routes, and are generally rendered within a **Layout**. What this ends up meaning is that, with this structure, nearly everything inside of **Components** ends up being a dumb component.

