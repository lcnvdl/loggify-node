# loggify-node
Client for loggify web service

## Installation
```bash
npm i --save loggify-node
```

## Usage
```javascript
const Manager = require("loggify-node");

const managerSingleton = new Manager("<Project Key>", "<Access Token>");

managerSingleton.setAutoSync(true);

managerSingleton.log("INFO", "Application initialized");
```
