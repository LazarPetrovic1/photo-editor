import { useContext } from "react"
import { AlertContext } from "../contexts/AlertContext"

function AlertContainer() {
  const { alerts, removeAlert } = useContext(AlertContext);
  return (
    <div className="alert-container">
      {alerts.map(a => (
        <div className={a.type} key={a.id} onClick={() => removeAlert(a.id)}>{a.msg}</div>
      ))}
    </div>
  )
}

export default AlertContainer;