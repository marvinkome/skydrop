import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    body: "Open Sans, sans-serif",
    heading: "Open Sans, sans-serif",
  },

  components: {
    Input: {
      variants: {
        outline: {
          field: {
            rounded: "18px",
            bg: "#FDFCFF",
            border: "1px solid",
            borderColor: "rgba(25, 15, 51, 0.1)",
            boxShadow: "inset 0px 0.934426px 10px rgba(25, 15, 51, 0.2)",
            color: "black",
            px: 6,
            py: 8,
            mt: 2,

            _hover: {
              borderColor: "rgba(25, 15, 51, 0.2)",
            },

            _placeholder: {
              color: "rgb(0 0 0 / 36%)",
            },

            _focus: {
              borderColor: "rgba(25, 15, 51, 0.2)",
              outline: "none",
              boxShadow: "inset 0px 0.934426px 10px rgba(25, 15, 51, 0.2)",
            },
          },
        },
      },
    },
    Textarea: {
      variants: {
        outline: {
          rounded: "18px",
          bg: "#FDFCFF",
          border: "1px solid",
          borderColor: "rgba(25, 15, 51, 0.1)",
          boxShadow: "inset 0px 0.934426px 10px rgba(25, 15, 51, 0.2)",
          color: "black",
          px: 6,
          py: 10,
          mt: 2,

          _hover: {
            borderColor: "rgba(25, 15, 51, 0.2)",
          },

          _placeholder: {
            color: "rgb(0 0 0 / 36%)",
          },

          _focus: {
            borderColor: "rgba(25, 15, 51, 0.2)",
            outline: "none",
            boxShadow: "inset 0px 0.934426px 10px rgba(25, 15, 51, 0.2)",
          },
        },
      },
    },
    Button: {
      variants: {
        solid: {
          backgroundColor: "#7E4DFF",
          rounded: "50px",
          color: "#fff",
          px: 12,
          _hover: {
            backgroundColor: "#7E4DFF",
            transform: "scale(1.02)",
            _disabled: {
              backgroundColor: "rgb(0 0 0 / 95%)",
            },
          },
          _focus: { boxShadow: "0 0 0 1.8px rgba(0, 0, 0, 0.4)" },
        },

        outline: {
          border: "1px solid rgb(0 0 0 / 26%)",
          backgroundColor: "transparent",
          rounded: "0px",
          _focus: { boxShadow: "0 0 0 1.8px rgba(0, 0, 0, 0.4)" },
        },
      },
    },
  },
});

export default theme;
