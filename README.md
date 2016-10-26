# http-config-cache
Caches configs. Supports JSON

``` 
configCache('http://cdn.restocks.io/test.json').then((data) => {
  console.log(data);
}).catch((err) => {
  console.log(err);
});
```