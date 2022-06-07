import { ContextModalProps, ModalsProvider } from '@mantine/modals';
import { Text, Button } from '@mantine/core';

const ErrorModal = ({ context, id, innerProps }) => {
  return (
    <>
      <Text size='sm'>{innerProps.errorMessage}</Text>
      <Button
        color='red'
        fullWidth
        mt='md'
        onClick={() => context.closeModal(id)}>
        Okay 🤷‍♂️
      </Button>
    </>
  );
};

export default ErrorModal;
