import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Button, FormHelperText } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import classes from "../styles/dashboard/Admin.module.css";

const ingreLimitOptions = [
  { name: "One Ingredient Only", value: "1" },
  {
    name: "Set a limit number (more than 1)",
    value: "MORE_THAN_ONE",
  },
  { name: "Multiple Ingredients (no limit)", value: "NO_LIMIT" },
];

export default function CompositionForm({
  id,
  categoryId,
  name: existingName,
  description: existingDescription,
  ingredient_limit: existingIngredientsLimit,
}) {
  const [name, setName] = useState(existingName || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [ingredientsLimit, setIngredientsLimit] = useState(
    existingIngredientsLimit || {}
  );
  const [limitNumber, setLimitNumber] = useState(null);
  const [goToAdmins, setGoToAdmins] = useState(false);
  // console.log(props);
  const router = useRouter();

  const newCompoCategId = router.query?.categoryId;

  console.log(existingIngredientsLimit);
  useEffect(() => {
    if (existingIngredientsLimit) {
      if (
        existingIngredientsLimit === "1" ||
        existingIngredientsLimit === "NO_LIMIT"
      ) {
        setIngredientsLimit(
          ingreLimitOptions.find(
            (option) => option.value === existingIngredientsLimit
          )
        );
      } else if (parseInt(existingIngredientsLimit) > 1) {
        setIngredientsLimit(
          ingreLimitOptions.find((option) => option.value === "MORE_THAN_ONE")
        );
        setLimitNumber(parseInt(existingIngredientsLimit));
      }
    }
  }, [existingIngredientsLimit]);
  // useEffect(() => {
  //   async function getAdminData() {
  //     try {
  //       const response = await axios.get("/api/admin2");
  //       const data = response.data;
  //       console.log(data);
  //       const base64Image = `data:image/jpeg;base64,${data[0].image.data}`;
  //       console.log(base64Image);
  //     } catch (error) {
  //       console.log(`💥💥💥${error}`);
  //     }
  //   }
  //   getAdminData();
  // }, []);
  console.log(ingredientsLimit);

  const saveCompositionHandler = async (e) => {
    e.preventDefault();
    // console.log(e.currentTarget);
    // const formData = new FormData();
    // formData.append("image", selectedProfilePicture);

    const data = {
      name,
      description,
    };

    if (id && categoryId) {
      //   //update
      console.log(data);
      console.log(id);
      try {
        let response;
        // Use Axios PUT request to update the admin record
        if (ingredientsLimit.value === "MORE_THAN_ONE") {
          response = await axios.put("/api/composition", {
            name,
            description,
            ingredientsLimit: "" + limitNumber,
            id,
          });
        } else {
          response = await axios.put("/api/composition", {
            name,
            description,
            ingredientsLimit: ingredientsLimit.value,
            id,
          });
        }
        if (response.status === 200) {
          const admin = response.data;
          console.log("Composition updated: ", admin);
          // Redirect to the admins page after successful update
          router.push("/categories/edit" + id);
        } else {
          console.error("Failed to update composition", response.status);
        }
      } catch (error) {
        console.error("💥An error occurred", error);
      }
    }
    if (newCompoCategId && !id) {
      console.log("❤❤");
      try {
        let response;
        if (ingredientsLimit.value === "MORE_THAN_ONE") {
          response = await axios.post("/api/composition", {
            name,
            description,
            ingredientsLimit: "" + limitNumber,
            newCompoCategId,
          });
        } else {
          response = await axios.post("/api/composition", {
            name,
            description,
            ingredientsLimit: ingredientsLimit.value,
            newCompoCategId,
          });
        }
        if (response.status === 200) {
          const admin = response.data;
          console.log("Composition uploaded:", admin);
        } else {
          console.error("Failed to upload composition:", response.status);
        }
      } catch (error) {
        console.error(
          "An error occurred while uploading the composition:",
          error
        );
      }
      // Handle error cases
    }
    setGoToAdmins(true);
  };
  if (goToAdmins) {
    if (newCompoCategId) {
      router.push("/categories/edit/" + newCompoCategId);
    }
    if (categoryId && id) {
      router.push("/categories/edit/" + categoryId);
    }
  }

  const cancelBtnHandler = () => {
    if (newCompoCategId) {
      router.push("/categories/edit/" + newCompoCategId);
    }
    if (categoryId && id) {
      router.push("/categories/edit/" + categoryId);
    }
  };
  return (
    <Paper sx={{ padding: "1.4rem", display: "flex", flexDirection: "column" }}>
      <div className={classes["input-wrapper"]}>
        <FormControl
          size="small"
          sx={{
            m: 1,
            width: "100%",
            margin: "0",
            "& div": {
              fontSize: "14px",
            },
          }}
        >
          <div className={classes.input}>
            <label
              htmlFor="name"
              style={{
                marginBottom: "4px",
                color: "#adadad",
                fontSize: "15px",
              }}
            >
              Name:
            </label>

            <OutlinedInput
              id="name"
              name="name"
              type="text"
              onChange={(ev) => setName(ev.target.value)}
              required
              value={name}
            />
          </div>
        </FormControl>
        <FormControl
          size="small"
          sx={{
            m: 1,
            width: "100%",
            margin: "0",
            "& div": {
              fontSize: "14px",
            },
          }}
        >
          <div className={classes.input}>
            <label
              htmlFor="description"
              style={{
                marginBottom: "4px",
                color: "#adadad",
                fontSize: "15px",
              }}
            >
              Description:
            </label>

            <OutlinedInput
              id="description"
              name="description"
              type="text"
              onChange={(ev) => setDescription(ev.target.value)}
              required
              value={description}
            />
          </div>
        </FormControl>
        <div>
          <label
            htmlFor="composition"
            style={{
              marginBottom: "4px",
              color: "#adadad",
              fontSize: "15px",
            }}
          >
            Ingredients Limit:
          </label>
          <Autocomplete
            size="small"
            id="composition"
            options={ingreLimitOptions}
            getOptionLabel={(option) => {
              console.log(option);
              console.log(ingredientsLimit);
              return option.name;
            }}
            value={ingredientsLimit} // Set the value prop to control the selected values
            onChange={(event, newValue) => {
              console.log(newValue);
              console.log(event);
              setIngredientsLimit(newValue); // Update the state with the selected values
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
        {ingredientsLimit && ingredientsLimit.value === "MORE_THAN_ONE" && (
          <FormControl
            size="small"
            sx={{
              m: 1,
              width: "100%",
              margin: "0",
              "& div": {
                fontSize: "14px",
              },
            }}
          >
            <div className={classes.input}>
              <label
                htmlFor="limitNumber"
                style={{
                  marginBottom: "4px",
                  color: "#adadad",
                  fontSize: "15px",
                }}
              >
                Set a limit number (more than 1):
              </label>

              <OutlinedInput
                id="limitNumber"
                name="limitNumber"
                type="number"
                onChange={(ev) => setLimitNumber(ev.target.value)}
                required
                value={limitNumber}
              />
            </div>
          </FormControl>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          gap: "1rem",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "4px",
            alignSelf: "center",
            marginTop: "20px",
          }}
        >
          <button
            style={{
              color: "#DE89A1",
              fontSize: "14px",
              textTransform: "none",
              zIndex: "999",
            }}
            onClick={cancelBtnHandler}
          >
            Cancel
          </button>
        </div>
        <div
          style={{
            marginTop: "1.4rem",
            backgroundColor: "#DE89A1",
            borderRadius: "4px",
            alignSelf: "end",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{
              color: "#fff",
              fontSize: "13px",
              textTransform: "none",
              zIndex: "999",
            }}
            onClick={saveCompositionHandler}
          >
            Save
          </Button>
        </div>
      </div>
    </Paper>
  );
}
