import {
  Box,
  Button,
  Input,
  NumberInput,
  Textarea,
  VStack,
  Heading,
  Field,
  Alert,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import {
  CreateTransactionDto,
  useCreateTransactionMutation,
} from '../graphql/generated/graphql';

type FormValues = Omit<CreateTransactionDto, 'metadata'> & { metadata: string };

const CreateTransactionForm: React.FC = () => {
  const [createTransaction, { loading }] = useCreateTransactionMutation();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      sourceAccount: '',
      targetAccount: '',
      externalId: '',
      amount: 0,
      currency: '',
      metadata: '{}',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      const metadataObj: Record<string, string> = JSON.parse(values.metadata);
      await createTransaction({
        variables: {
          input: {
            ...values,
            metadata: metadataObj,
          },
        },
      });
      reset();
      setSubmitSuccess('Transaction created successfully');
      setSubmitError(null);
    } catch (err) {
      let errorMessage = 'Failed to create transaction';
      if (err instanceof Error) {
        errorMessage = `${errorMessage}: ${err.message}`;
      }

      setSubmitError(errorMessage);
      setSubmitSuccess(null);
    }
  };

  return (
    <Box
      maxW="600px"
      mx="auto"
      mt={16}
      p={6}
      boxShadow="md"
      borderRadius="md"
      bg="white"
    >
      <Heading mb={4} size="lg" textAlign="center">
        Transaction details
      </Heading>
      <VStack as="form" gap={4} onSubmit={handleSubmit(onSubmit)}>
        <Field.Root invalid={!!errors.sourceAccount}>
          <Field.Label>Source Account</Field.Label>
          <Input
            {...register('sourceAccount', {
              required: 'Source Account is required',
            })}
            placeholder="e.g. acct-123"
          />
          <Field.ErrorText>{errors.sourceAccount?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.targetAccount}>
          <Field.Label>Target Account</Field.Label>
          <Input
            {...register('targetAccount', {
              required: 'Target Account is required',
            })}
            placeholder="e.g. acct-456"
          />
          <Field.ErrorText>{errors.targetAccount?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.externalId}>
          <Field.Label>External ID</Field.Label>
          <Input
            {...register('externalId', { required: 'External ID is required' })}
            placeholder="e.g. ext-789"
          />
          <Field.ErrorText>{errors.externalId?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.amount}>
          <Field.Label>Amount</Field.Label>
          <NumberInput.Root min={0} step={1}>
            <NumberInput.Control />
            <NumberInput.Input
              {...register('amount', {
                required: 'Amount is required',
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: 'Must be a positive value, greater than 0',
                },
              })}
            />
          </NumberInput.Root>
          <Field.ErrorText>{errors.amount?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.currency}>
          <Field.Label>Currency</Field.Label>
          <Input
            {...register('currency', {
              required: 'Currency is required',
              maxLength: { value: 3, message: '3-letter code' },
            })}
            placeholder="e.g. USD"
          />
          <Field.ErrorText>{errors.currency?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.metadata}>
          <Field.Label>Metadata (JSON)</Field.Label>
          <Textarea
            {...register('metadata', {
              required: 'Metadata is required',
              validate: (val) => {
                try {
                  const parsed = JSON.parse(val);
                  if (
                    Object.values(parsed).some(
                      (value) => typeof value !== 'string'
                    )
                  ) {
                    return 'Metadata must be a JSON object with string values only';
                  }
                  return true;
                } catch {
                  return 'Invalid JSON';
                }
              },
            })}
            placeholder='e.g. {"note":"Payment"}'
          />
          <Field.ErrorText>{errors.metadata?.message}</Field.ErrorText>
        </Field.Root>

        <Button type="submit" colorScheme="teal" loading={loading} width="full">
          Submit
        </Button>

        {submitSuccess && (
          <Alert.Root status="success" title={submitSuccess}>
            <Alert.Indicator />
            <Alert.Title>{submitSuccess}</Alert.Title>
          </Alert.Root>
        )}

        {submitError && (
          <Alert.Root status="error" title={submitError}>
            <Alert.Indicator />
            <Alert.Title>{submitError}</Alert.Title>
          </Alert.Root>
        )}
      </VStack>
    </Box>
  );
};

export default CreateTransactionForm;
