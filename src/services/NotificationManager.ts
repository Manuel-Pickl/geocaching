export const sendPushMessage = (
    title: string,
    // icon: string = "",
    message: string = "") =>
  {
    navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, { 
            // icon: icon,
            icon: "./markers/marker1.png",
            image: "./markers/marker2.png",
            badge: "./markers/marker3.png",
            body: message
        });
    });
  }