this API need to implemented in the script.js that are loaded by the html pages.

# important
you can detect whether it is an electron app by checking whether this variable is defined
```js
    electronAPI
```
# API (only one)
> electronAPI.export(type)
- the type is ("transaction"|"price"|"stock"|"stockDynamic"), similar to 
- it will show the client where to save the file, fetch the data, and store that data in the chosen file.