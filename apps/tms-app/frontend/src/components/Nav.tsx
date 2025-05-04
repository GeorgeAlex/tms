import {
  Box,
  Flex,
  HStack,
  Stack,
  Text,
  Button,
  CollapsibleRoot,
  CollapsibleContent,
} from '@chakra-ui/react';
import React from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { NavLink as RouterNavLink } from 'react-router-dom';

const NavLink = ({ children, to }: { children: React.ReactNode; to: string }) => (
  <RouterNavLink
    to={to}
    style={({ isActive }) => ({
      color: isActive ? 'var(--chakra-colors-blue-600)' : 'inherit',
      textDecoration: 'none',
      '&:hover': {
        color: 'var(--chakra-colors-blue-600)'
      }
    })}
  >
    {children}
  </RouterNavLink>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Box bg="white" px={4} boxShadow="sm">
      <Flex
        maxW="1200px"
        mx="auto"
        h={16}
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>
          <Text fontWeight="bold" fontSize="lg">
            Best TMS
          </Text>
        </Box>
        <Box display={{ base: 'flex', md: 'none' }}>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation"
            variant="ghost"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </Button>
        </Box>
        <HStack
          alignItems="center"
          mx="auto"
          display={{ base: 'none', md: 'flex' }}
        >
          <NavLink to="/create-transaction">Create transaction</NavLink>
          <NavLink to="/transactions">Your transactions</NavLink>
        </HStack>
      </Flex>
      <CollapsibleRoot open={isOpen}>
        <CollapsibleContent>
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as="nav" align="center">
              <NavLink to="/create-transaction">Create transaction</NavLink>
              <NavLink to="/transactions">Your transactions</NavLink>
            </Stack>
          </Box>
        </CollapsibleContent>
      </CollapsibleRoot>
    </Box>
  );
};

export default Navbar;