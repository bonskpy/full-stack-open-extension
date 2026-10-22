import Alert from "@mui/material/Alert";


const Notification = ({ message }) => {
  if (message) {

    switch (message.type){
    case "success":
      return <Alert severity="success">{message.content}</Alert>;
    case "info":
      return <Alert severity="info">{message.content}</Alert>;
    case "warning":
      return <Alert severity="warning">{message.content}</Alert>;
    default:
      return <Alert severity="error">{message.content}</Alert>;
    };
  }
  return null;
};

export default Notification;
