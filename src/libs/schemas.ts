export const domain = {
  name: "SkyDrop",
  version: "1.0.0",
};

export const schemas = {
  Space: [
    { name: "from", type: "address" },
    { name: "timestamp", type: "uint64" },
    { name: "space", type: "string" },
    { name: "about", type: "string" },
  ],
};
