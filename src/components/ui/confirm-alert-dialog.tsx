import ReactDOM from "react-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";
import { useBoolean } from "ahooks";

export type SimpleModalProps = {
  content?: React.ReactNode | string;
  title?: React.ReactNode | string;
  onOk?: () => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
  afterClose?: () => void;
  container?: HTMLElement;
};
export default function ConfirmAlertDialog({
  title,
  content,
  onOk,
  onCancel,
  okText = "确认",
  cancelText = "取消",
  afterClose,
  container
}: SimpleModalProps) {
  const [state, { setFalse }] = useBoolean(true);
  return (
    <AlertDialog open={state}>
      <AlertDialogContent container={container}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{content}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              onCancel?.();
              setFalse();
              afterClose?.();
            }}
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onOk?.();
              setFalse();
              afterClose?.();
            }}
          >
            {okText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
