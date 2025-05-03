import React, { useState, useMemo } from 'react';
import {
  Table,
  Spinner,
  Alert,
  Text,
  Flex,
  Input,
  HStack,
  Button,
  Box,
} from '@chakra-ui/react';
import { format } from 'currency-formatter';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

import { useGetTransactionsQuery } from '../graphql/generated/graphql';

type SortField = 'createdAt' | 'processedAt' | 'amount';
type SortDirection = 'asc' | 'desc';

const TransactionsTable: React.FC = () => {
  const { loading, error, data } = useGetTransactionsQuery();
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [sourceFilter, setSourceFilter] = useState('');
  const [targetFilter, setTargetFilter] = useState('');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedTransactions = useMemo(() => {
    if (!data?.transactions) return [];

    const filtered = data.transactions.filter((tx) => {
      const matchesSource = sourceFilter
        ? tx.sourceAccount.toLowerCase().includes(sourceFilter.toLowerCase())
        : true;
      const matchesTarget = targetFilter
        ? tx.targetAccount.toLowerCase().includes(targetFilter.toLowerCase())
        : true;
      return matchesSource && matchesTarget;
    });

    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'createdAt':
        case 'processedAt':
          comparison =
            new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [
    data?.transactions,
    sortField,
    sortDirection,
    sourceFilter,
    targetFilter,
  ]);

  if (loading) return <Spinner />;

  if (error)
    return (
      <Flex
        maxW="1200px"
        mx="auto"
        mt={16}
        alignItems="center"
        justifyContent="space-between"
        flexDirection="column"
      >
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>{error.message}</Alert.Title>
        </Alert.Root>
      </Flex>
    );

  const SortButton = ({ field }: { field: SortField }) => (
    <Button size="sm" variant="plain" p={0} colorPalette="gray" onClick={() => handleSort(field)}>
      {field.charAt(0).toUpperCase() + field.slice(1)}{' '}
      {sortField === field ? (
        sortDirection === 'asc' ? (
          <FiArrowUp />
        ) : (
          <FiArrowDown />
        )
      ) : undefined}
    </Button>
  );

  return (
    <Flex
      maxW="1200px"
      mx="auto"
      mt={16}
      alignItems="center"
      justifyContent="space-between"
      flexDirection="column"
    >
      <Text fontWeight="bold" fontSize="lg" mb={4}>
        Your transactions
      </Text>

      <HStack gap={4} mb={4} width="100%">
        <Box flex={1}>
          <Input
            placeholder="Filter by source account"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          />
        </Box>
        <Box flex={1}>
          <Input
            placeholder="Filter by target account"
            value={targetFilter}
            onChange={(e) => setTargetFilter(e.target.value)}
          />
        </Box>
      </HStack>

      <Table.Root striped colorPalette="teal" width="100%">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Source</Table.ColumnHeader>
            <Table.ColumnHeader>Target</Table.ColumnHeader>
            <Table.ColumnHeader>
              <SortButton field="amount" />
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              <SortButton field="createdAt" />
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              <SortButton field="processedAt" />
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredAndSortedTransactions.map((tx) => (
            <Table.Row key={tx.id}>
              <Table.Cell>{tx.id}</Table.Cell>
              <Table.Cell>{tx.sourceAccount}</Table.Cell>
              <Table.Cell>{tx.targetAccount}</Table.Cell>
              <Table.Cell>
                {format(tx.amount, { code: tx.currency })}
              </Table.Cell>
              <Table.Cell>{tx.createdAt}</Table.Cell>
              <Table.Cell>{tx.processedAt}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Flex>
  );
};

export default TransactionsTable;
