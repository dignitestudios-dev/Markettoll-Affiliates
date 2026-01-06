import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export const getFcmToken = async () => {
  try {
    // Request notification permission
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey:
          "BKGaHhuqh_eiZAL-zfFX8S1sONZ3733G8-yIlchOxgUpayZmAF7RUQyCgN2Uoh3_ql1X55_IMiK0x9_fcFhcEOY",
      });
      return token;
    } else {
      console.error("Notification permission denied");
      return null;
    }
  } catch (err) {
    console.error("Error getting FCM token:", err);
    return null;
  }
};
