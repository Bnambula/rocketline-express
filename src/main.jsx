import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../rocketline-express.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

The key thing is the `../` path must correctly point to wherever `rocketline-express.jsx` actually lives. If it's in the root of the repository, `../rocketline-express.jsx` is correct — but only if `main.jsx` is inside a `src/` folder.

---

**Most likely issue:** When you uploaded `rocketline-express.jsx` to GitHub, it went into the **root** of the repository, but `src/main.jsx` was also placed in the root instead of inside a proper `src` folder.

Check your GitHub repository — your file structure should look **exactly** like this:
```
rocketline-express/
├── index.html
├── package.json
├── vite.config.js
├── rocketline-express.jsx   ← in root
└── src/
    └── main.jsx             ← inside src folder
