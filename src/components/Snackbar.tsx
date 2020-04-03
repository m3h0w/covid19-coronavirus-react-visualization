import { useEffect, FC } from 'react';
import PubSub from 'pubsub-js';
import { withSnackbar, WithSnackbarProps } from 'notistack';

export enum SeverityLevel {
  error = 'error',
  warning = 'warning',
  info = 'info',
  success = 'success',
}

interface IProps {
  severity: SeverityLevel;
  text: string;
  autoHideDuration?: number;
}

const DEFAULT_AUTOHIDE_DURATION = 6000;

export const SNACK_BAR_TOPIC = 'SNACK_BAR_TOPIC';

const CustomizedSnackbar_: FC<WithSnackbarProps> = ({ enqueueSnackbar }) => {
  useEffect(() => {
    const token = PubSub.subscribe(SNACK_BAR_TOPIC, (msg, data) => {
      enqueueSnackbar(data.text, data);
    });
    return () => PubSub.unsubscribe(token);
  }, [enqueueSnackbar]);

  return '';
};

const CustomizedSnackbar = withSnackbar(CustomizedSnackbar_);
export default CustomizedSnackbar;

export function showSnackBar(
  variant: SeverityLevel,
  text: string | { message: string },
  duration: number = DEFAULT_AUTOHIDE_DURATION
) {
  PubSub.publish(SNACK_BAR_TOPIC, {
    variant,
    text: text.message ? text.message : text,
    autoHideDuration: duration,
  });
}

export const showErrorSnackBar = (text: string, duration: number = DEFAULT_AUTOHIDE_DURATION) =>
  showSnackBar(SeverityLevel.error, text, duration);

export const showSuccessSnackBar = (text: string, duration: number = DEFAULT_AUTOHIDE_DURATION) =>
  showSnackBar(SeverityLevel.success, text, duration);

export const showInfoSnackBar = (text: string, duration: number = DEFAULT_AUTOHIDE_DURATION) =>
  showSnackBar(SeverityLevel.info, text, duration);
