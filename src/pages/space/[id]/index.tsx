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

const Page = ({ space, leaderboard }: { space: any; leaderboard: any }) => {
  const { account } = useWeb3React();

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
                Address (Connected)
              </Text>
              <Text fontSize="sm">{account ? truncateAddress(account, 4) : ""}</Text>
            </chakra.div>

            <chakra.div mb={10}>
              <Text mb={2} fontWeight="600">
                Community Name
              </Text>
              <Text fontSize="sm">{space.name}</Text>
            </chakra.div>

            <Stack mb={14} direction="row" justify="space-between" alignItems="center">
              <chakra.div>
                <Text mb={2} fontWeight="600">
                  Members
                </Text>
                <Text fontSize="sm">{space._count.members}</Text>
              </chakra.div>

              <chakra.div align="right">
                <Text mb={2} fontWeight="600">
                  Created
                </Text>
                <Text fontSize="sm">{format(parseJSON(space.createdAt), "do MMMM, yyyy")}</Text>
              </chakra.div>
            </Stack>

            <Stack w="full" alignItems="center">
              <Button rightIcon={<FiEdit2 />} variant="outline" size="lg" w="80%">
                Change
              </Button>
            </Stack>
          </chakra.article>

          {/* space member */}
          <chakra.section flex={3.5}>
            <Stack direction="row" justifyContent="space-between">
              <Text fontSize="xl" fontWeight="700" color="#7D4CFF">
                Leaderboard
              </Text>

              {space._count.members && (
                <Stack direction="row">
                  <NextLink href={`/space/${space.id}/members/add`} passHref>
                    <Button as={Link} variant="outline" fontSize="sm" rightIcon={<IoMdAdd />}>
                      Add Member
                    </Button>
                  </NextLink>

                  <NextLink href={`/space/${space.id}/send-points`} passHref>
                    <Button as={Link} variant="solid" fontSize="sm" rightIcon={<MdCelebration />}>
                      Send Points
                    </Button>
                  </NextLink>
                </Stack>
              )}
            </Stack>

            <chakra.div my={4}>
              {/* table header */}
              <chakra.div bgColor="#F6F5FA" d="flex" w="full" direction="row" mb={8} py={6} px={10} borderTopRadius="20px">
                <Stack direction="row" flex={4}>
                  <Text fontSize="sm">Username</Text>
                </Stack>

                <Stack justifyContent="center" direction="row" flex={2} alignItems="center">
                  <Text fontSize="sm">Quests</Text>
                  <Icon color="rgba(25, 15, 51, 0.5)" fontSize="sm" as={AiOutlineQuestionCircle} />
                </Stack>

                <Stack justifyContent="center" direction="row" flex={2} alignItems="center">
                  <Text fontSize="sm">Points</Text>
                  <Icon color="rgba(25, 15, 51, 0.5)" fontSize="sm" as={AiOutlineQuestionCircle} />
                </Stack>
              </chakra.div>

              {/* empty view */}
              {leaderboard.length === 0 && (
                <chakra.div textAlign="center" my={20}>
                  <Text mb={5}>No members in your space yet</Text>
                  <NextLink href={`/space/${space.id}/members/add`} passHref>
                    <Button as={Link} size="lg" rightIcon={<IoMdAdd />}>
                      Add Member
                    </Button>
                  </NextLink>
                </chakra.div>
              )}

              <Stack spacing={8} divider={<StackDivider />}>
                {leaderboard.map((member: any) => (
                  <chakra.div key={member.id} d="flex" w="full" direction="row" px={10}>
                    <Stack direction="row" flex={4}>
                      <NextLink href={`/space/${space.id}/members/${member.id}`} passHref>
                        <Link textDecoration="underline" fontSize="sm">
                          {member.name}
                        </Link>
                      </NextLink>
                    </Stack>

                    <Stack justifyContent="center" direction="row" flex={2}>
                      <Text fontSize="sm">{member._count.quests}</Text>
                    </Stack>

                    <Stack justifyContent="center" direction="row" flex={2}>
                      <Text fontSize="sm">{(member.quests || []).reduce((total: number, curr: any) => total + curr.points, 0)}</Text>
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

  const space = await prisma.space.findUnique({
    where: { id: parseInt(spaceId || "", 10) },
    select: {
      name: true,
      createdAt: true,
      id: true,
      _count: {
        select: { members: true },
      },
    },
  });

  const leaderboard = await prisma.member.findMany({
    where: { spaceId: parseInt(spaceId || "", 10) },
    orderBy: {
      quests: {
        _count: "desc",
      },
    },
    select: {
      id: true,
      name: true,
      quests: {
        select: {
          points: true,
        },
      },
      _count: {
        select: { quests: true },
      },
    },
  });

  return {
    props: {
      space: JSON.parse(JSON.stringify(space)),
      leaderboard: JSON.parse(JSON.stringify(leaderboard)),
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const spaces = await prisma.space.findMany({});

  return {
    paths: spaces.map((space) => ({ params: { id: `${space.id}` } })),
    fallback: "blocking",
  };
};

export default Page;
