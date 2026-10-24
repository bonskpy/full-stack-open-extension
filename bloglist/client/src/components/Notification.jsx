import Alert from "@mui/material/Alert";
import { useAlertValue } from "../stores";

const Notification = () => {
  const { message, type } = useAlertValue();

  if (message) {
    return <Alert severity={type}>{message}</Alert>;
  }
  return null;
};

export default Notification;
