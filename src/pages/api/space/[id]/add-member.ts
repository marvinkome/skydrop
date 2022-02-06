/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { utils } from "ethers";
import { domain as appDomain } from "libs/schemas";
import prisma from "libs/prisma";
import { pinJson } from "libs/ipfs";

const LOG_TAG = "[space-add-member]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, body } = req;

    switch (method) {
      case "POST": {
        console.log(LOG_TAG, "add member to space %j", JSON.stringify(body, null, 2));

        const { domain, message, types } = body.data;

        // verify timestamp
        const ts = Date.now() / 1000;
        const overTs = (ts + 180).toFixed(); // +3 min
        const underTs = (ts - 180).toFixed(); /// -3 min

        if (message.timestamp > overTs || message.timestamp < underTs) {
          console.log(LOG_TAG, "[error]", "wrong timestamp", method);
          return res.status(400).send({ error: "wrong timestamp" });
        }

        // verify domain
        if (domain.name !== appDomain.name || domain.version !== appDomain.version) {
          console.log(LOG_TAG, "[error]", "wrong doamin", method);
          return res.status(400).send({ error: "wrong domain" });
        }

        // verify signature
        const recoveredAddress = utils.verifyTypedData(domain, types, message, body.sig);
        if (body.address !== recoveredAddress) {
          console.log(LOG_TAG, "[error]", "wrong signature", recoveredAddress);
          return res.status(400).send({ error: "wrong signature" });
        }

        // verify space ownership
        const spaceId = message.spaceId;
        const member = JSON.parse(message.member);

        const space = await prisma.space.findFirst({
          where: { id: parseInt(spaceId, 10), admin: body.address },
        });
        if (!space) {
          console.log(LOG_TAG, "[error]", "not permitted", { spaceId });
          return res.status(400).send({ error: "wrong space, or address is not an admin" });
        }

        // verify data
        // - any other form of validation?

        // save store details in ipfs
        const hash = await pinJson(`space-members/${body.address}/${space.name?.toLowerCase()}`, {
          ...body,
        });
        console.log(LOG_TAG, "store snapshot of action", { ipfs: hash });

        // store data in DB
        const result = await prisma.member.create({
          data: {
            name: member.username,
            address: member.address,
            hash,
            space: {
              connect: { id: space.id },
            },
          },
        });

        console.log(LOG_TAG, "space member saved in db", { result });
        return res.status(200).send(result);
      }
      default:
        console.log(LOG_TAG, "[error]", "unauthorized method", method);
        return res.status(500).send({ error: "unauthorized method" });
    }
  } catch (error) {
    console.log(LOG_TAG, "[error]", "general error", {
      name: (error as any).name,
      message: (error as any).message,
      stack: (error as any).stack,
    });

    return res.status(500).send({ error: "request failed" });
  }
};
