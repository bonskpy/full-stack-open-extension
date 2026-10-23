import Alert from "@mui/material/Alert";
import { useNotification } from "../stores";

const Notification = () => {
  const message = useNotification((state) => state.alert.message);
  const type = useNotification((state) => state.alert.type);

  if (message) {
    return <Alert severity={type}>{message}</Alert>;
  }
  return null;
};

export default Notification;
