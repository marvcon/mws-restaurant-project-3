if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/sw.js').then(function(reg) {
    console.log("Service Worker registered!");
  }).catch((a) => {
    console.log("Unable to register the service worker... \n", a);
  });
}
