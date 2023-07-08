import ConfirmAlertDialog, {
  SimpleModalProps,
} from "@/components/ui/confirm-alert-dialog";
import ReactDOM from "react-dom";
export default function showAlertModal(props: SimpleModalProps) {
  const div = document.createElement("div");
  document.body.appendChild(div);
  div.className = "modal-container";
  const afterClose = () => {
    const observer = new MutationObserver((mutationsList) => {
      const targetNode = mutationsList[0].target;
      if (targetNode.childNodes.length === 0) {
        const unmountResult = ReactDOM.unmountComponentAtNode(div);
        if (unmountResult && div.parentNode) {
          div.parentNode.removeChild(div);
        }
        observer.disconnect();
      }
    });
    observer.observe(div, { childList: true });
  };
  ReactDOM.render(
    <ConfirmAlertDialog
      {...props}
      container={div}
      afterClose={() => {
        props.afterClose?.();
        afterClose();
      }}
    />,
    div
  );
}
