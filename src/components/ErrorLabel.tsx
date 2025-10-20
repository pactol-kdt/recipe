const ErrorLabel = ({
  message,
  dataLength,
  isSubmit,
}: {
  message: string;
  dataLength: number;
  isSubmit: boolean;
}) => {
  return (
    isSubmit && dataLength === 0 && <p className="text-xs font-medium text-red-500">{message}</p>
  );
};

export default ErrorLabel;
