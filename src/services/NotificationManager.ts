export const sendPushMessage = (
  title: string,
  message: string = "") =>
{
  navigator.serviceWorker.ready.then((registration) => {
    if (message != "") {
      registration.showNotification(title, { body: message });
    }
    else {
      registration.showNotification(title);
    }
  });
}