import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { styled, Box } from "@mui/material";

import Layout from "@/components/Layout";
import CategoryForm from "@/components/CategoryForm";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function NewCategoryPage() {
  return (
    <Layout>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          overflow: "hidden",
          margin: "3rem 1rem",
        }}
      >
        <DrawerHeader />
        <CategoryForm />
      </Box>
    </Layout>
  );
}
