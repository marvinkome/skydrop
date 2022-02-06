import React from "react";
import NextLink from "next/link";
import Api from "libs/api";
import { useWeb3React } from "@web3-react/core";
import {
  Button,
  chakra,
  Container,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Image,
  Input,
  Link,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { GrClose } from "react-icons/gr";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { injected } from "libs/wallet";
import { providers } from "ethers";
import { domain, schemas } from "libs/schemas";

const useAddSpaceMember = () => {
  const { library, account, activate } = useWeb3React();
  const toast = useToast();
  const router = useRouter();

  const addSpaceMembereMutation = useMutation(
    async (payload: any) => {
      if (!library || !account) {
        await activate(injected, undefined, true);
      }

      let provider: providers.Web3Provider = library;
      const signer = provider.getSigner(account!);

      // format message into schema
      const message = {
        from: account,
        timestamp: parseInt((Date.now() / 1000).toFixed()),
        spaceId: payload.spaceId,
        member: JSON.stringify({
          address: payload.address,
          username: payload.username,
        }),
      };

      const data = {
        domain,
        types: { SpaceMember: schemas.SpaceMember },
        message,
      };

      const sig = await signer._signTypedData(data.domain, data.types, data.message);
      console.log("Sign", { address: account, sig, data });

      const { payload: result } = await Api().post(`/space/${payload.spaceId}/add-member`, {
        address: account,
        sig,
        data,
      });

      console.log("Result", result);
      return result;
    },
    {
      onSuccess: (_, { spaceId }) => {
        router.push({
          pathname: `/space/[spaceId]`,
          query: { spaceId },
        });
      },
      onError: (e: any) => {
        toast({
          title: "Error adding space member",
          description: e.message,
          position: "bottom-right",
          status: "error",
        });
      },
    }
  );

  return addSpaceMembereMutation;
};

const Page = () => {
  const { query } = useRouter();
  const addMemberMutation = useAddSpaceMember();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const address = (e.target as any)["address"].value;
    const username = (e.target as any)["username"].value;

    addMemberMutation.mutate({ spaceId: query.id, address, username });
  };

  return (
    <chakra.main>
      <chakra.header py={1} px={10}>
        <Image src="/logo.svg" alt="Logo" boxSize="8rem" />
      </chakra.header>

      <Container maxW="container.sm" px={20}>
        <Stack mb={14} direction="row" alignItems="center" justifyContent="space-between">
          <Heading fontSize="2xl">Add Member</Heading>
          <NextLink href={`/space/${query.id}`} passHref>
            <IconButton as={Link} variant="link" fontSize="2xl" aria-label="Go back" icon={<GrClose />} />
          </NextLink>
        </Stack>

        <Stack as="form" onSubmit={onSubmit} w="full" mx="auto" alignItems="center" spacing={10}>
          <FormControl isRequired>
            <FormLabel fontWeight="600" fontSize="sm" htmlFor="address">
              Address
            </FormLabel>
            <Input isRequired id="address" type="text" size="lg" fontSize="md" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontWeight="600" fontSize="sm" htmlFor="username">
              Username
            </FormLabel>
            <Input isRequired id="username" type="text" size="lg" fontSize="md" />
          </FormControl>

          <Stack w="full" spacing={5}>
            <Button isLoading={addMemberMutation.isLoading} type="submit" w="full" transform="scale(1.05)" size="lg" fontSize="md">
              Add member
            </Button>

            <NextLink href={`/space/${query.id}`} passHref>
              <Button as={Link} variant="outline" w="full" transform="scale(1.05)" size="lg" fontSize="md">
                Cancel
              </Button>
            </NextLink>
          </Stack>
        </Stack>
      </Container>
    </chakra.main>
  );
};

export default Page;
