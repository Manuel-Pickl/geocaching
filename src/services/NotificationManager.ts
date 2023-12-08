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
    alert('Push subscription succeded');
  })
  .catch((error) => {
    console.error(`Push subscription failed: ${error}`);
    alert(`Push subscription failed: ${error}`);
  });


export const sendPushMessage = (
  title: string,
  icon: string = "./globe.svg",
  message: string = "") =>
{
  navigator.serviceWorker.ready.then((registration) =>
  {
    registration.showNotification(
      title, {
        icon: icon,
        body: message
      }
    );
  });
}