import React, { useState } from "react";
import NextLink from "next/link";
import prisma from "libs/prisma";
import Api from "libs/api";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import {
  chakra,
  Container,
  Stack,
  Heading,
  IconButton,
  Image,
  FormControl,
  FormLabel,
  Input,
  Button,
  Link,
  Text,
  Textarea,
  Checkbox,
  HStack,
  StackDivider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { GrClose } from "react-icons/gr";
import { useWeb3React } from "@web3-react/core";
import { useMutation } from "react-query";
import { injected } from "libs/wallet";
import { domain, schemas } from "libs/schemas";
import { providers } from "ethers";

const useSendPointsMutation = () => {
  const { library, account, activate } = useWeb3React();
  const toast = useToast();
  const router = useRouter();

  return useMutation(
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
        quest: JSON.stringify({
          title: payload.title,
          reason: payload.reason,
          points: payload.points,
        }),
        members: JSON.stringify(payload.members),
      };

      const data = {
        domain,
        types: { Quest: schemas.Quest },
        message,
      };
      console.log("Data", { address: account, data });

      const sig = await signer._signTypedData(data.domain, data.types, data.message);
      console.log("Sign", { address: account, sig, data });

      const { payload: result } = await Api().post(`/space/${payload.spaceId}/send-points`, {
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
          title: "Error sending points",
          description: e.message,
          position: "bottom-right",
          status: "error",
        });
      },
    }
  );
};

const Page = ({ members }: any) => {
  const { query } = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const sendPointsMutation = useSendPointsMutation();

  const [values, setValues] = useState({
    title: "",
    points: "",
    reason: "",
    members: [] as string[],
  });

  const onSubmit = async () => {
    onClose();

    sendPointsMutation.mutate({
      spaceId: query.id,
      title: values.title,
      points: values.points,
      reason: values.reason,
      members: values.members.map((id) => ({
        name: members.find((m: any) => m.id === id)?.name,
        id: members.find((m: any) => m.id === id)?.id,
      })),
    });
  };

  return (
    <chakra.main>
      <chakra.header py={1} px={10}>
        <Image src="/logo.svg" alt="Logo" boxSize="8rem" />
      </chakra.header>

      <Container maxW="container.sm" px={20} mb={9}>
        <Stack mb={14} w="full" direction="row" alignItems="center" justifyContent="space-between">
          <Heading fontSize="2xl">Send Points</Heading>
          <NextLink href={`/space/${query.id}`} passHref>
            <IconButton as={Link} variant="link" fontSize="2xl" aria-label="Go back" icon={<GrClose />} />
          </NextLink>
        </Stack>

        <Stack
          as="form"
          onSubmit={(e) => {
            e.preventDefault();
            onOpen();
          }}
          w="full"
          mx="auto"
          alignItems="center"
          spacing={10}
        >
          <FormControl isRequired>
            <FormLabel fontWeight="600" fontSize="sm" htmlFor="title">
              Quest title
            </FormLabel>
            <Input
              isRequired
              id="title"
              type="text"
              fontSize="md"
              value={values.title}
              onChange={(e) => setValues({ ...values, title: e.target.value })}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontWeight="600" fontSize="sm" htmlFor="points">
              How many points for this quest (1 - 10)?
            </FormLabel>
            <Input
              isRequired
              id="points"
              type="number"
              min={1}
              max={10}
              fontSize="md"
              value={values.points}
              onChange={(e) => setValues({ ...values, points: e.target.value })}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontWeight="600" fontSize="sm" htmlFor="reason">
              Reason
            </FormLabel>
            <Textarea
              isRequired
              rows={3}
              py={4}
              id="reason"
              value={values.reason}
              onChange={(e) => setValues({ ...values, reason: e.target.value })}
            ></Textarea>
          </FormControl>

          <FormControl isRequired>
            <FormLabel mb={5} fontWeight="600" fontSize="sm" htmlFor="search">
              Who completed this quest?
            </FormLabel>

            <Stack w="full" spacing={3} divider={<StackDivider />}>
              {members.map((member: any) => (
                <HStack key={member.id} justify="space-between" py={4}>
                  <Text fontSize="sm">{member.name}</Text>
                  <Checkbox
                    size="lg"
                    value={String(values.members.includes(members.id))}
                    onChange={(e) =>
                      setValues({
                        ...values,
                        members: e.target.checked ? [...values.members, member.id] : values.members.filter((id) => id !== member.id),
                      })
                    }
                  />
                </HStack>
              ))}
            </Stack>
          </FormControl>

          <Stack w="full" spacing={5}>
            <Button isLoading={sendPointsMutation.isLoading} type="submit" w="full" transform="scale(1.05)" size="lg" fontSize="md">
              Continue
            </Button>
          </Stack>
        </Stack>
      </Container>

      <Modal isCentered size="sm" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent rounded="25px">
          <ModalHeader />
          <ModalCloseButton />
          <ModalBody px={8} py={10}>
            <Stack alignItems="center" spacing={8}>
              <Text textAlign="center">
                Please confirm that you’re sending{" "}
                <chakra.span color="#7E4DFF" fontWeight="600">
                  {values.points} points
                </chakra.span>{" "}
                each to{" "}
                <chakra.span color="#7E4DFF" fontWeight="600">
                  {values.members.length} members
                </chakra.span>
              </Text>

              <Stack w="full" px={10}>
                <Button onClick={onSubmit} fontSize="md">
                  Confirm
                </Button>

                <Button onClick={onClose} variant="outline" fontSize="md">
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </chakra.main>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const spaces = await prisma.space.findMany({});

  return {
    paths: spaces.map((space) => ({ params: { id: `${space.id}` } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const spaceId = context.params?.id as string;

  const members = await prisma.member.findMany({
    where: { space: { id: parseInt(spaceId || "", 10) } },
    select: {
      id: true,
      name: true,
    },
  });

  return {
    props: {
      members: JSON.parse(JSON.stringify(members)),
    },
    revalidate: 10,
  };
};

export default Page;
