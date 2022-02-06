import React from "react";
import Api from "libs/api";
import { useRouter } from "next/router";
import { schemas, domain } from "libs/schemas";
import { providers } from "ethers";
import { chakra, Image, Heading, Container, Stack, FormControl, FormLabel, Input, Textarea, Button, useToast } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useMutation } from "react-query";
import { injected } from "libs/wallet";

const useSetupSpace = () => {
  const { library, account, activate } = useWeb3React();
  const toast = useToast();
  const router = useRouter();

  const createSpaceMutation = useMutation(
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
        space: payload.name,
        about: payload.about,
      };

      const data = {
        domain,
        types: { Space: schemas.Space },
        message,
      };

      const sig = await signer._signTypedData(data.domain, data.types, data.message);
      console.log("Sign", { address: account, sig, data });

      const { payload: result } = await Api().post("/space-settings", {
        address: account,
        sig,
        data,
      });

      console.log("Result", result);
      return result;
    },
    {
      onSuccess: ({ id: spaceId }) => {
        router.push({
          pathname: `/space/[spaceId]/`,
          query: { spaceId },
        });
      },
      onError: (e: any) => {
        toast({
          title: "Error creating space",
          description: e.message,
          position: "bottom-right",
          status: "error",
        });
      },
    }
  );

  return createSpaceMutation;
};

const Home = () => {
  const createSpaceMutation = useSetupSpace();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const name = (e.target as any)["name"].value;
    const about = (e.target as any)["about"].value;

    createSpaceMutation.mutate({ name, about });
  };

  return (
    <chakra.section minH="100vh" bgImage="url('/background.svg')" bgRepeat="no-repeat">
      <chakra.header py={1} px={10}>
        <Image src="/logo.svg" alt="Logo" boxSize="8rem" />
      </chakra.header>

      <Container maxW="container.md" py={5} px={10} textAlign="center">
        <Heading mb={16} fontFamily="Montserrat" fontWeight="bold" color="#190F33" textShadow="0px 10px 20px rgba(126, 77, 255, 0.4)">
          Reward NFT & DAO community participation in a few clicks
        </Heading>

        <Stack as="form" onSubmit={onSubmit} w="lg" mx="auto" alignItems="center" spacing={10}>
          <FormControl isRequired>
            <FormLabel fontWeight="600" fontSize="sm" htmlFor="name">
              Community name
            </FormLabel>
            <Input isRequired id="name" type="text" placeholder="The name of your community" size="lg" fontSize="md" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontWeight="600" fontSize="sm" htmlFor="about">
              About
            </FormLabel>
            <Textarea isRequired rows={5} py={4} id="about" placeholder="Say something about your community"></Textarea>
          </FormControl>

          <Button isLoading={createSpaceMutation.isLoading} type="submit" w="full" transform="scale(1.05)" size="lg" fontSize="md">
            Create space
          </Button>
        </Stack>
      </Container>
    </chakra.section>
  );
};

export default Home;
