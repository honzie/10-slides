# 10-slides

##  Environment setup:

```
npm install uglify-js-harmony -g
npm install clean-css -g
```

## Compiling files

```
uglifyjs --mangle --output 10s.js -- scripts/10kslides.js
cleancss --output 10s.css styles/10kslides.css 
```

Output 
