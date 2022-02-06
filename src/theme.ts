import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    body: "Open Sans, sans-serif",
    heading: "Open Sans, sans-serif",
  },

  styles: {
    global: {
      body: {
        color: "#190F33",
        fontWeight: 500,
      },
    },
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
      sizes: {
        lg: { fontSize: "md" },
      },
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
          border: "1px solid rgba(25, 15, 51, 0.7)",
          backgroundColor: "transparent",
          px: 12,
          rounded: "50px",
          _hover: { backgroundColor: "transparent", border: "1px solid rgba(25, 15, 51, 0.9)" },
          _focus: { boxShadow: "0 0 0 1.8px rgba(25, 15, 51, 0.4)" },
        },
      },
    },
    Checkbox: {
      baseStyle: {
        control: {
          rounded: "10px",
          bgColor: "rgba(246, 245, 250, 0.5)",
          boxShadow: "inset 0px 0.934426px 9.34426px rgba(25, 15, 51, 0.15)",

          _checked: {
            color: "#9C76FE",
            border: "none",
            bgColor: "rgba(246, 245, 250, 0.5)",
            boxShadow: "inset 0px 0.934426px 9.34426px rgba(25, 15, 51, 0.15)",

            _hover: {
              border: "none",
              bgColor: "rgba(246, 245, 250, 0.5)",
              boxShadow: "inset 0px 0.934426px 9.34426px rgba(25, 15, 51, 0.15)",
            },

            _focus: { boxShadow: "inset 0px 0.934426px 9.34426px rgba(25, 15, 51, 0.15)" },
          },
        },
        label: {
          fontWeight: "500",
          ml: 4,
        },
      },

      sizes: {
        lg: {
          control: {
            width: "30px",
            height: "30px",
          },
          icon: { fontSize: "0.9rem" },
          label: { fontSize: "md" },
        },
        md: {
          label: { fontSize: "sm" },
        },
      },
    },
  },
});

export default theme;
