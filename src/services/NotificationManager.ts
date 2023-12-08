const publicKey: string = "BN2RIWiHvyOZXQ2aW0-_9GrauHRxeK11l-6O0llzxVFLRiKxAMLBKWA4RqeF5Ir7pZ9vD5f8Fd9k_o_zDUdSbxY";

navigator.serviceWorker.ready
  .then((registration) => {
    return registration.pushManager.getSubscription();
  })
  .then((subscription) => {
    if (subscription) {
      return subscription.unsubscribe();
    }
  })
  .then(() => {
    return navigator.serviceWorker.ready
      .then((registration) => {
        return registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: publicKey,
        });
      });
  })
  .then(() => {
    console.log('Push subscription succeded');
  })
  .catch((error) => {
    console.error('Push subscription failed:', error);
  });


export const sendPushMessage = (
  title: string,
  message: string = "") =>
{
  navigator.serviceWorker.ready.then((registration) => {
    if (message != "") {
      registration.showNotification(title, { body: message });
    }
    else {
      registration.showNotification(
        title, {
          icon: "./markers/marker1.png",
          image: "./markers/marker2.png",
          badge: "./markers/marker3.png"
        }
      );
    }
  });
}