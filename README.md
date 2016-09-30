# 10-slides

##  Environment setup:

```
npm install uglify-js-harmony -g
npm install clean-css -g
npm install html-minify -g
```

## Minify files

```
uglifyjs --mangle --output 10s.js -- scripts/10kslides.js
cleancss --output 10s.css styles/10kslides.css
htmlminify -o index.html unminified.html
htmlminify -o help.html unminified-help.html
```
