import React from "react";
import prisma from "libs/prisma";
import NextLink from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";
import { Button, chakra, Container, Icon, Image, Link, Stack, StackDivider, Text } from "@chakra-ui/react";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import { MdCelebration } from "react-icons/md";
import { parseJSON, format } from "date-fns";
import { useWeb3React } from "@web3-react/core";
import { truncateAddress } from "libs/utils";

const Page = ({ member }: { member: any }) => {
  return (
    <chakra.main>
      <chakra.header py={1} px={10}>
        <Image src="/logo.svg" alt="Logo" boxSize="8rem" />
      </chakra.header>

      <Container maxW="100%" px={20}>
        <Stack direction={{ base: "column", md: "row" }} spacing={16}>
          <chakra.article flex={1} bgColor="#F6F5FA" py={12} px={8} rounded="20px">
            <chakra.div mb={10}>
              <Text mb={2} fontWeight="600">
                Address
              </Text>
              <Text fontSize="sm">{truncateAddress(member.address, 4)}</Text>
            </chakra.div>

            <Stack mb={14} direction="row" justify="space-between" alignItems="center">
              <chakra.div>
                <Text mb={2} fontWeight="600">
                  Username
                </Text>
                <Text fontSize="sm">{member.name}</Text>
              </chakra.div>

              <chakra.div align="right">
                <Text mb={2} fontWeight="600">
                  Joined
                </Text>
                <Text fontSize="sm">{format(parseJSON(member.createdAt), "do MMMM, yyyy")}</Text>
              </chakra.div>
            </Stack>

            <Stack mb={14} direction="row" justify="space-between" alignItems="center">
              <chakra.div>
                <Text mb={2} fontWeight="600">
                  Quests
                </Text>
                <Text fontSize="sm">{member.quests.length}</Text>
              </chakra.div>

              <chakra.div align="right">
                <Text mb={2} fontWeight="600">
                  Points
                </Text>
                <Text fontSize="sm">{(member.quests || []).reduce((total: number, curr: any) => total + curr.points, 0)}</Text>
              </chakra.div>
            </Stack>
          </chakra.article>

          {/* space member */}
          <chakra.section flex={3.5}>
            <Stack direction="row" justifyContent="space-between">
              <Text fontSize="xl" fontWeight="700" color="#7D4CFF">
                All Quests
              </Text>
            </Stack>

            <chakra.div my={4}>
              {/* table header */}
              <chakra.div bgColor="#F6F5FA" d="flex" w="full" direction="row" mb={8} py={6} px={10} borderTopRadius="20px">
                <Stack direction="row" flex={4}>
                  <Text fontSize="sm">Title</Text>
                </Stack>

                <Stack justifyContent="center" direction="row" flex={2} alignItems="center">
                  <Text fontSize="sm">Points</Text>
                  <Icon color="rgba(25, 15, 51, 0.5)" fontSize="sm" as={AiOutlineQuestionCircle} />
                </Stack>

                {/* <Stack justifyContent="center" direction="row" flex={2} alignItems="center">
                  <Text fontSize="sm">Points</Text>
                  <Icon color="rgba(25, 15, 51, 0.5)" fontSize="sm" as={AiOutlineQuestionCircle} />
                </Stack> */}
              </chakra.div>

              {/* empty view */}
              {member.quests.length === 0 && (
                <chakra.div textAlign="center" my={20}>
                  <Text mb={5}>No quests completed by this user</Text>
                </chakra.div>
              )}

              <Stack spacing={8} divider={<StackDivider />}>
                {member.quests.map((quest: any) => (
                  <chakra.div key={quest.id} d="flex" w="full" direction="row" px={10}>
                    <Stack direction="row" flex={4}>
                      <Text fontSize="sm">{quest.title}</Text>
                    </Stack>

                    <Stack justifyContent="center" direction="row" flex={2}>
                      <Text fontSize="sm">{quest.points}</Text>
                    </Stack>
                  </chakra.div>
                ))}
              </Stack>
            </chakra.div>
          </chakra.section>
        </Stack>
      </Container>
    </chakra.main>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const spaceId = context.params?.id as string;
  const memberId = context.params?.memberId as string;

  const member = await prisma.member.findFirst({
    where: {
      id: parseInt(memberId || "", 10),
      space: { id: parseInt(spaceId || "", 10) },
    },

    select: {
      address: true,
      name: true,
      createdAt: true,
      quests: {
        select: {
          id: true,
          title: true,
          points: true,
        },
      },
    },
  });

  return {
    props: {
      member: JSON.parse(JSON.stringify(member)),
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const members = await prisma.member.findMany({
    include: { space: true },
  });

  return {
    paths: members.map((member) => ({
      params: {
        id: `${member.space?.id || ""}`,
        memberId: `${member.id}`,
      },
    })),
    fallback: "blocking",
  };
};

export default Page;
